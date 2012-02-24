
(function() {

var geom = org.weblogo.geom;

// p1 is allowed to be inhomogeneous in this optimised version
org.weblogo.geom.intersect_planes = function(p1, p2, sign) {
    var g = geom.dot_3(p1, p2);
    var d2 = 1 - g*g;
    var a1 = p1[3] || 0;
    var c1 = - a1 / d2;
    var c2 = a1 * g / d2;
    var l2 = (d2 - a1*a1) / (d2 * d2);
    var t1 = geom.scale_3(p1, c1);
    var t2 = geom.scale_3(p2, c2);
    var t3 = geom.scale_3(geom.cross_3(p1, p2), sign * Math.sqrt(l2));
    var sum = geom.add_3(t1, geom.add_3(t2, t3));
    return sum;
};

org.weblogo.geom.intersect_hplanes = function(p1, p2) {
    return geom.norm_3(geom.cross_3(p1, p2));
};

org.weblogo.geom.point_by_angle = function(point, axis, angle) {
    var c = Math.cos(angle), s = Math.sin(angle), c1 = 1 - c;
    var ux = axis[0], uy = axis[1], uz = axis[2];
    var px = point[0], py = point[1], pz = point[2];
    return [
    (c + ux*ux*c1)    * px + (ux*uy*c1 - uz*s) * py + (ux*uz*c1 + uy*s) * pz,
    (uy*ux*c1 + uz*s) * px + (c + uy*uy*c1)    * py + (uy*uz*c1 - ux*s) * pz,
    (uz*ux*c1 - uy*s) * px + (uz*uy*c1 + ux*s) * py + (c + uz*uz*c1)    * pz 
    ];
};

// JS atan2 in range -PI to PI
org.weblogo.geom.get_parameter = function(conj, angle, point) {
    var upped = geom.point_by_angle(point, conj, angle);
    var param = Math.atan2(upped[0], -upped[1]);
    return param;
}

var PI2 = Math.PI * 2;

// Compute rotation which takes line axis to the pole, for purposes of mapping
// line intervals
org.weblogo.geom.line_to_conj = function(point1, line, point2, line2) {
    var conj = geom.axis_from_heading(line, [0, 0, 1]);
    var angle = Math.acos(line[2]);
    var start = geom.get_parameter(conj, angle, point1);
    var end = geom.get_parameter(conj, angle, point2);
    if (line2) { // not used on the client
        var cos = vec3.dot(line, line2);
        var sin = vec3.dot(point2, vec3.cross(line, line2, vec3.create()));
        var bend = (PI2 - Math.atan2(sin, cos)) % PI2;
    }
    return {
        conj: conj,
        angle: angle,
        start: start,
        end: end,
        bend: bend
    };
};


// These four taken from GLSL definitions
org.weblogo.geom.clamp = function(x, minVal, maxVal) {
    return Math.min(Math.max(x, minVal), maxVal);
};

org.weblogo.geom.smoothstep = function(edge0, edge1, x) {
    var t = geom.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
};

org.weblogo.geom.step = function(edge, x) {
    return x < edge? 0 : 1;
};

org.weblogo.geom.sign = function(x) {
    return x > 0? 1 : (x < 0 ? -1 : 0);  
};

org.weblogo.geom.is_within = function(start, param, end, startslop, endslop) {
    start = (start - startslop) % PI2;
    end = (end + endslop) % PI2;
    var sign = geom.sign(end - start);
    var ind = (param >= start) * (param <= end);
    return (1 - sign)/2 + sign * ind;
};

// conj2 is polygon's conj
org.weblogo.geom.is_intersect = function(conj1, conj2, point, ig1, startslop, endslop) {
    var param1 = geom.get_parameter(conj1.conj, conj1.angle, point);
    var is1 = ig1 || geom.is_within(conj1.start, param1, conj1.end, 0, 0);
    if (!ig1) {
        // console.log("within1 ", conj1, " start ", conj1.start, " end ", conj1.end, " param1 ", param1, " is1 ", is1);
    }
    var param2 = geom.get_parameter(conj2.conj, conj2.angle, point);
    var is2 = geom.is_within(conj2.start, param2, conj2.end, startslop || 0, endslop || 0);
    if (!ig1) {
        // console.log("within2 ", conj2,  " start ", conj2.start, " end ", conj2.end, " param2 ", param2, " is2 ", is2);
    }
    return is1 * is2;
};

org.weblogo.geom.applyShade = function(shade, isInt, slope) {
    slope = slope * isInt;
    var tshade = slope + geom.step(-1e-9, -slope); // slope of 0 maps to 1
//    console.log(" slope " + slope + " tshade " + tshade);
    return Math.min(shade, tshade);
};

org.weblogo.geom.cotSlop = function(slope, slop, bend) {
    if (bend < Math.PI / 2) {
        return 0.3 * slop * (2 * slope - 0.8) / Math.tan(bend);
    }
    else return 1.8 * slop * Math.min(2 * slope - 1, 0) / Math.sin(2 * bend);
};

org.weblogo.geom.raster_point = function(poly, point) {
    var c = poly.lines.length;
    var slop = 0.01;
    // line joining point to exterior point
    var axis = geom.axis_from_heading(point, poly.exterior);
    var conj = geom.line_to_conj(point, axis, poly.exterior);
    var count = 0, shade = 1;
    for (var i = 0; i < c; ++ i) {
        var line = poly.lines[i];
        var normal = geom.axis_from_heading(point, line);
        var normconj = geom.line_to_conj(point, normal, line);
        var bends = Math.PI - poly.conj[(i - 1 + c)%c].bend / 2;
        var bende = Math.PI - poly.conj[i].bend/2;
        //console.log("bends " + (bends / PI2) + " bende " + (bende / PI2));
        var dot = -vec3.dot(line, point) - (line[3] || 0);
        var slope = geom.clamp(dot + slop, 0, 2 * slop) / (2 * slop);
        
        var startslop = geom.cotSlop(slope, slop, bends);
        var endslop = geom.cotSlop(slope, slop, bende);
        
        // console.log("slope ", slope, " startslop ", startslop, " endslop " , endslop);
        
        var intersectn1 = geom.intersect_planes(line, normal, 1);
        var isIntn1 = geom.is_intersect(normconj, poly.conj[i], intersectn1, 1, startslop, endslop);
        shade = geom.applyShade(shade, isIntn1, slope);
        
        var intersectn2 = geom.intersect_planes(line, normal, -1);
        var isIntn2 = geom.is_intersect(normconj, poly.conj[i], intersectn2, 1, startslop, endslop);
        shade = geom.applyShade(shade, isIntn2, slope);
        
        var intersect1 = geom.intersect_planes(line, axis, 1);
        var isInt = geom.is_intersect(conj, poly.conj[i], intersect1);
        //console.log("up count: ", isInt, " intersect point ", intersect1);
        count += isInt;
        var intersect2 = geom.intersect_planes(line, axis, -1);
        var isInt2 = geom.is_intersect(conj, poly.conj[i], intersect2);
        count += isInt2;
        //console.log("up count: ", isInt2, " intersect point ", intersect2);
    }
    //console.log("WITHIN: ", count, " shade ", shade);
    return {within: count %2, shade: shade};
};


//** ABOVE HERE goes into WebGL

var check_polygon = function(points, lines) {
    var c = points.length;
    for (var i = 0; i < c; ++ i) {
        console.log("d1 ", vec3.dot(lines[i], points[i]), " d2 ", vec3.dot(lines[i], points[(i + 1)%c]));
        var axis = geom.axis_from_heading(points[i], points[(i + 1)%c]);
        console.log("Orient: ", vec3.dot(lines[i], axis)); 
    }  
};

org.weblogo.geom.find_exterior = function(a1, point, a2) {
    var angle = Math.acos(-vec3.dot(a1, a2));
    // kick the point off by a small amount to avoid alignment problems
    var rot = geom.point_by_angle(a1, point, angle/2 + 5e-1);
    var adj = geom.point_by_angle(point, rot, Math.PI/40);
    return geom.norm_3(adj);
};

org.weblogo.geom.measure_polygon = function(polygon) {
    var c = polygon.points.length;
    polygon.exterior = geom.find_exterior(polygon.lines[c - 1], polygon.points[0], polygon.lines[0]);
    polygon.conj = [];
    for (var i = 0; i < c; ++ i) {
        var i1 = (i + 1) %c;
        polygon.lines[i][3] = polygon.lines[i][3] || 0;
        polygon.conj[i] = geom.line_to_conj(polygon.points[i], polygon.lines[i], polygon.points[i1], polygon.lines[i1]);
    }
    for (var i = 0; i < c; ++ i) {
        var i1 = (i + 1) % c;
        polygon.conj[i1].bendstart = polygon.conj[i].bend;
    }
    for (var i = 0; i < c; ++ i) {
        var mind = Number.MAX_VALUE, maxd = Number.MIN_VALUE;
        for (var j = 0; j < c; ++ j) {
            var dot = geom.dot_3(polygon.lines[i], polygon.points[j]);
            var bendstart = polygon.conj[j].bendstart;
            var slop = 2.5 * polygon.lineWidth / Math.sin(bendstart / 2);
            mind = Math.min(dot - slop, mind);
            maxd = Math.max(dot + slop, maxd);
        }
        polygon.conj[i].mind = mind;
        polygon.conj[i].maxd = maxd;
    }
};

var id = function() {
    return mat4.identity(mat4.create());
};

org.weblogo.geom.make_turtle = function(size, apex) {
    size = Math.PI/25;
    apex = Math.PI/8;
    var rotl = mat4.rotate(id(), size, [-1, 0, 0]);
    mat4.rotate(rotl, -apex, [0, -1, 0]);
    var tl = mat4.multiplyVec3(rotl, [-1, 0, 0], vec3.create());
    tl = geom.scale_3(tl, 1.0); // get it out of blasted FloatArray form
    var rotr = mat4.rotate(id(), size, [-1, 0, 0]); 
    
    mat4.rotate(rotr, apex, [0, -1, 0]);
    var tr = mat4.multiplyVec3(rotr, [1, 0, 0], vec3.create());
    tr = geom.scale_3(tr, 1.0);
    var tp = geom.point_by_angle([0, -1, 0], [-1, 0, 0], size);
    //console.log("tl ", tl, " tr ", tr);
    //console.log("tp ", tp, " dot1 ", vec3.dot(tp, tl), " dot2 ", vec3.dot(tp, tr));
    
    var radius = [0, -1, 0, -vec3.dot(tp, [0, -1, 0])];
    var blp2 = geom.intersect_planes(radius, tl, 1);
    var brp2 = geom.intersect_planes(radius, tr, -1);
     
    //console.log("brp2 ", brp2, " dot3 ", vec3.dot(brp2, tr), " blp2 ", blp2, " dot4 ", vec3.dot(blp2, tl));
    //console.log("r1 ", vec3.dot(brp2, radius) + radius[3], " r2 ", vec3.dot(blp2, radius) + radius[3]);
    
    var botl = geom.axis_from_heading(blp2, brp2);
    var botp = geom.intersect_hplanes(botl, [-1, 0, 0]);
    var bota = Math.acos(vec3.dot(botp, [0, -1, 0]));
    //console.log("bota " + bota);
    var bp = geom.point_by_angle([0, -1, 0], [-1, 0, 0], -bota / 2);
    var bl = geom.axis_from_heading(bp, blp2);
    var br = geom.axis_from_heading(brp2, bp);
    
    var points = [tp, brp2, bp, blp2];
    var lines = [tr, br, bl, tl];
    
//    check_polygon(points, lines);
    var polygon = {
        points: points,
        lines: lines,
        lineWidth: 0.01,
        colfill: [0, 0xee, 0, 0xff],
        colbord: [0, 0xff, 0, 0xff]
//        colfill: [0, 0xee, 0xee, 0xff],
//        colbord: [0, 0xff, 0xff, 0xff]
    };
    geom.measure_polygon(polygon);
    return polygon;
};

org.weblogo.testTurtle = {};

// map of uniform members within polygon structure - values currently unused 
org.weblogo.testTurtle.polyStruct = {
    "conj.conj": "vec3",
    "conj.angle": "float",
    "conj.start": "float",
    "conj.end": "float",
    "conj.bendstart": "float",
    "conj.bend": "float",
    "conj.mind": "float",
    "conj.maxd": "float",
    line4: "vec4"
};

org.weblogo.testTurtle.glConfig = {
    shaders: {
        vertex: "shaders/nullVertex.c",
        fragment: "shaders/generalPolygon.c"
    },
    variables: {
        vertexPosition: {storage: "attribute", type: "vertexAttribArray"},
        lineCount: "uniform",
        lineWidth: "uniform",
        colfill: "uniform",
        colbord: "uniform",
        poly: {
            storage: "uniform",
            count: 16,
            struct: "org.weblogo.testTurtle.polyStruct"
        }
    },
    times: 1,
    autoClear: false,
    clearColor: [0, 0, 0, 0],
    animate: false
};

org.weblogo.testTurtle.drawAt = function(config, position, heading) {
    var component = config.testTurtleComponent;
    var canvas2d = config.context; 
    var turtleStart = [0, -1, 0];
    var positionAxis = geom.axis_from_heading(turtleStart, position);
    var positionAngle = Math.acos(geom.dot_3(turtleStart, position));
    
    var carriedHeading = geom.point_by_angle([-1, 0, 0], positionAxis, positionAngle);
    var headingDiffVec = geom.cross_3(carriedHeading, heading);
    var dot = geom.dot_3(carriedHeading, heading);
    // should be parallel to position
    headingDiff = Math.atan2(geom.dot_3(headingDiffVec, position), dot);
    
    var transform = function(point) {
        var point2 = geom.point_by_angle(point, positionAxis, positionAngle);
        var point3 = geom.point_by_angle(point2, position, headingDiff);
        return point3;
    };
    
    var poly = component.turtle;
    
    component.turtlelive.lines = fluid.transform(poly.lines, transform);
    component.turtlelive.points = fluid.transform(poly.points, transform);
    
    org.weblogo.polygonToShader(component.turtlelive, component);
    component.userDraw = null;
    component.clear();
    component.draw();
    
    var gl = component.gl;
    
    canvas2d.drawImage(component.canvas, 0, 0);
};

if (org.weblogo.turtle) {

org.weblogo.turtle.commands.testTurtle = function() {
   return {type: "testTurtle"}
};
org.weblogo.turtle.commands.testTurtle.args = [];

org.weblogo.executors.testTurtle = function(config, command, tick) {
    var component = config.testTurtleComponent;
    component.initTime = tick;
    component.userDraw = org.weblogo.testTurtle.userDraw;
    var that = {};
    //var imageData = config.context.createImageData(config.width, config.height);
    //component.userPostDraw = function(that) {
    //    gl.readPixels(0, 0, config.width, config.height, gl.RGBA, gl.UNSIGNED_BYTE, imageData.data);
    //    config.context.putImageData(imageData, 0, 0);
    //};

    that.toTick = function(now) {
        component.draw();
        //fluid.log("Rendered in " + (Date.now() - now) + "ms " + Date.now());
        return true;
    };
    return that;
};

org.weblogo.turtle.commands.testPolygon = function() {
    return {type: "testPolygon"}
};
org.weblogo.turtle.commands.testPolygon.args = [];

org.weblogo.executors.testPolygon = function(config, command, tick) {
    var component = config.testTurtleComponent;
    component.userDraw = org.weblogo.testPolygon.userDraw;
    component.initTime = tick;
    var that = {};
    that.toTick = function(now) {
        component.draw();
        return true;
    };
    return that;
};

}

org.weblogo.testPolygon = {};

org.weblogo.testPolygon.userDraw = function(that) {
    var heading = geom.point_by_angle([-1, 0, 0], [0, -1, 0], Math.PI/8);
    var end = geom.point_by_angle([0, -1, 0], heading, 2);
  
    that.polygon = org.weblogo.turtleLineToPolygon( {
      start: [0, -1, 0],
      end: end,
      heading: heading,
      distance: 2,
      colour: [0xff, 0xff, 0, 0xff],
      width: Math.PI/20
    });
    org.weblogo.polygonToShader(that.polygon, that);
};

org.weblogo.testTurtle.componentInit = function(that) {
    var gl = that.gl;
    that.turtle = org.weblogo.geom.make_turtle();
    that.turtlelive = $.extend(true, {}, that.turtle);
};

org.weblogo.testTurtle.webGLStart = function(canvas, client, callback) {
    var component = org.weblogo.webgl.initWebGLComponent(canvas, 
            org.weblogo.testTurtle.glConfig, {
                userDraw: org.weblogo.testTurtle.userDraw,
                initBuffers: org.weblogo.webgl.makeSquareVertexBuffer,
                events: client.events, 
                startListener: callback // TODO: get rid of this rubbish
            }, org.weblogo.testTurtle.componentInit);
    client.config.testTurtleComponent = component;  
};

var simples = {conj: "3fv", angle: "1f", start: "1f", 
    end: "1f", bend: "1f", bendstart: "1f", mind: "1f", maxd: "1f"};

// nb - distance is always positive - check whether to invert heading or not
// in caller
org.weblogo.turtleLineToPolygon = function(options) {
    var poly = {
        colfill: options.colour,
        colbord: [0,0,0,0],
        lineWidth: 0.01 // anti-alias border width
    };
    // "downward" diagram, assumed heading rotates antic from start to end
    var perpStart = geom.point_by_angle(options.heading, options.start, Math.PI/2);
    var perpEnd = geom.point_by_angle(options.heading, options.end, Math.PI/2);
    var side0 = fluid.copy(options.heading);
    side0[3] = options.width / 2;
    var side2 = fluid.copy(options.heading);
    side2[3] = - options.width / 2;
    poly.points = [
        geom.intersect_planes(side0, perpStart, 1),
        geom.intersect_planes(side0, perpEnd, 1),
        geom.intersect_planes(side2, perpEnd, 1),
        geom.intersect_planes(side2, perpStart, 1)
    ];
    poly.lines = [side0, perpEnd, side2, perpStart];
    var points = poly.points;
    console.log(geom.dot_3(points[0], options.start));
    console.log(geom.dot_3(points[1], options.end));
    console.log(geom.dot_3(points[2], options.end));
    console.log(geom.dot_3(points[3], options.start));
    console.log(geom.dot_3(points[0], poly.lines[0]) + poly.lines[0][3]);
    console.log(geom.dot_3(points[3], poly.lines[2]) + poly.lines[2][3]);
    return poly;
};

org.weblogo.polygonToShader = function(poly, that) {
    geom.measure_polygon(poly);
  
    var gl = that.gl;
    gl.activeTexture(gl.TEXTURE0);

    var s = org.weblogo.webgl.uniformSetter(gl, that.shaderProgram);
    var c = poly.lines.length;  
    
    s.set("lineCount", "1i", c);
    s.set("lineWidth", "1f", poly.lineWidth);
    s.set("colfill", "4fv", geom.scale_4(poly.colfill, 1.0/255));
    s.set("colbord", "4fv", geom.scale_4(poly.colbord, 1.0/255));
    s.set("exterior", "3fv", poly.exterior);
    
    for (var i = 0; i < c; ++ i) {
        var conj = poly.conj[i];
        fluid.each(simples, function(value, key) {
            s.setv("poly", i, "conj."+key, value, conj[key]);
        });
        s.setv("poly", i, "line4", "4fv", poly.lines[i]);
    }
};

org.weblogo.testTurtle.userDraw = function(that) {
    var poly = that.turtle;
    
    var now = Date.now();
    var angle = (now - that.initTime) / 2000;
    
    var trans = function(point) {
        point = geom.point_by_angle(point, [0, -1, 0], angle);
        point = geom.point_by_angle(point, [-1, 0, 0], angle / 3.7);
        point = geom.point_by_angle(point, [0, 0, 1], angle / 5.9);
        return point;
    };
    
    that.turtlelive.lines = fluid.transform(poly.lines, trans);
    that.turtlelive.points = fluid.transform(poly.points, trans);
    
    org.weblogo.polygonToShader(that.turtlelive, that);
};


    

//var polygon = org.weblogo.geom.make_turtle();
/*
var count = geom.raster_point(polygon, [0.000001, -1, 0]);
var up = geom.point_by_angle([0.0001, -1, 0], [-1, 0, 0], Math.PI/4);
var count = geom.raster_point(polygon, up);

var down = geom.point_by_angle([0.0001, -1, 0], [-1, 0, 0], -Math.PI/4);
var count = geom.raster_point(polygon, down);
*/
//var midbot = geom.point_by_angle(polygon.points[2], polygon.lines[2], Math.PI/60);
//console.log(geom.dot_3(midbot, polygon.lines[2]));
//var count = geom.raster_point(polygon, midbot);

//var midbotup = geom.point_by_angle(midbot, [-1, 0, 0], -.001);
//var count = geom.raster_point(polygon, midbotup);

//console.log("midbot ", midbot, " midbotup ", midbotup);
/*
var midbot3 = geom.point_by_angle(polygon.points[2], polygon.lines[1], -.02);
console.log(geom.dot_3(midbot3, polygon.lines[1]));
var count = geom.raster_point(polygon, midbot3);
*/
}());

