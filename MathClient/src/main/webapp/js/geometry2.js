
(function() {

var geom = org.weblogo.geom;

var id = function() {
    return mat4.identity(mat4.create());
};

org.weblogo.geom.intersect_planes = function(p1, p2, sign) {
    var g = vec3.dot(p1, p2);
    var d2 = 1 - g*g;
    var a1 = p1[3] || 0, a2 = p2[3] || 0;
    var c1 = (a2 * g - a1) / d2;
    var c2 = (a1 * g - a2) / d2;
    var l2 = (d2 + 2*a1*a2*g - (a1*a1 + a2*a2)) / (d2 * d2);
    var t1 = vec3.scale(p1, c1, vec3.create());
    var t2 = vec3.scale(p2, c2, vec3.create());
    var t3 = vec3.scale(vec3.cross(p1, p2, vec3.create()), sign * Math.sqrt(l2));
    var sum = vec3.add(t1, vec3.add(t2, t3));
    return sum;
};

org.weblogo.geom.intersect_hplanes = function(p1, p2) {
    return geom.norm_3(geom.cross_3(p1, p2));
}

org.weblogo.geom.point_by_angle = function(point, axis, angle) {
    return mat4.multiplyVec3(mat4.rotate(id(), angle, axis), point, vec3.create());
}

var check_polygon = function(points, lines) {
    var c = points.length;
    for (var i = 0; i < c; ++ i) {
        //console.log("d1 ", vec3.dot(lines[i], points[i]), " d2 ", vec3.dot(lines[i], points[(i + 1)%c]));
        var axis = geom.axis_from_heading(points[i], points[(i + 1)%c]);
        //console.log("Orient: ", vec3.dot(lines[i], axis)); 
    }  
};

org.weblogo.geom.find_exterior = function(a1, point, a2) {
    var angle = Math.acos(-vec3.dot(a1, a2));
    // kick the point off by a small amount to avoid alignment problems
    var rot = geom.point_by_angle(a1, point, angle / 2 + 1e-4);
    var adj = geom.point_by_angle(point, rot, Math.PI/100);
    return geom.norm_3(adj);
};

org.weblogo.geom.line_to_conj = function(point1, line, point2) {
    var conj = geom.axis_from_heading(line, [0, 0, 1]);
    var angle = Math.acos(vec3.dot(line, [0, 0, 1]));
    var start = geom.get_parameter(conj, angle, point1);
    var end = geom.get_parameter(conj, angle, point2);
    return {
        conj: conj,
        angle: angle,
        start: start,
        end: end
    };
};

org.weblogo.geom.measure_polygon = function(polygon) {
    var c = polygon.points.length;
    polygon.exterior = geom.find_exterior(polygon.lines[c - 1], polygon.points[0], polygon.lines[0]);
    polygon.conj = [];
    for (var i = 0; i < c; ++ i) {
        var line = polygon.lines[i];
        polygon.conj[i] = geom.line_to_conj(polygon.points[i], line, polygon.points[(i + 1)%c]); 
        //console.log("Upped ", line, " to ", geom.point_by_angle(line, polygon.conj[i].conj, polygon.conj[i].angle));
    }
};

// JS atan2 in range -PI to PI
org.weblogo.geom.get_parameter = function(conj, angle, point) {
    var upped = geom.point_by_angle(point, conj, angle);
    var param = Math.atan2(upped[0], -upped[1]);
    return param;
}

org.weblogo.geom.make_turtle = function(size, apex) {
    size = Math.PI/25;
    apex = Math.PI/8;
    var rotl = mat4.rotate(id(), size, [-1, 0, 0]);
    mat4.rotate(rotl, -apex, [0, -1, 0]);
    var tl = mat4.multiplyVec3(rotl, [-1, 0, 0], vec3.create());
    var rotr = mat4.rotate(id(), size, [-1, 0, 0]); 
    
    mat4.rotate(rotr, apex, [0, -1, 0]);
    var tr = mat4.multiplyVec3(rotr, [1, 0, 0], vec3.create());
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
    
    check_polygon(points, lines);
    var polygon = {
        points: points,
        lines: lines,
        color: 0xffff00
    };
    geom.measure_polygon(polygon);
    return polygon;
};

// These two taken from GLSL definitions
org.weblogo.geom.clamp = function(x, minVal, maxVal) {
    return Math.min(Math.max(x, minVal), maxVal);
}

org.weblogo.geom.smoothstep = function(edge0, edge1, x) {
    var t = geom.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
};

org.weblogo.geom.sign = function(x) {
    return x > 0? 1 : (x < 0 ? -1 : 0);  
};

org.weblogo.geom.is_within = function(start, param, end) {
    var sign = (end - start) > 0? 1 : -1;  
    var ind = (param >= start) * (param <= end);
    return (1 - sign)/2 + sign * ind;
};

org.weblogo.geom.angDiff = function(ang1, ang2) {
    return 1 - Math.abs(((4 + ((ang1 - ang2) / Math.PI)) % 2) - 1);
}

org.weblogo.geom.endShade = function(start, param, end, slop) {
    var ds = geom.angDiff(param, start);
    var de = geom.angDiff(param, end);
    return Math.max(0, slop - Math.min(ds, de));
};

org.weblogo.geom.endShadeDot = function(dot, incf) {
    return geom.smoothstep(0, 0.00005* incf, 1 - dot);
};

// conj2 is polygon's conj
org.weblogo.geom.is_intersect = function(conj1, conj2, point, slop, incs) {
    var param1 = geom.get_parameter(conj1.conj, conj1.angle, point);
    var is1 = geom.is_within(conj1.start, param1, conj1.end);
    var slop1 = geom.endShade(conj1.start, param1, conj1.end, slop);
    var bigis1 = is1 || geom.sign(slop1);
    
//    console.log("within1 ", conj1, " start ", conj1.start, " end ", conj1.end, " param1 ", param1, " is1 ", is1, " bigis1 ", bigis1, " slop1 ", slop1);
    var param2 = geom.get_parameter(conj2.conj, conj2.angle, point);
    var is2 = geom.is_within(conj2.start, param2, conj2.end);
//    console.log("within2 ", conj2,  " start ", conj2.start, " end ", conj2.end, " param2 ", param2, " is2 ", is2);
    return {within: bigis1 * is2, slop: slop1, smallIs: is1 * is2};
};

org.weblogo.geom.applyRes = function(accum, record, maxslop, leaving) {
    accum.count += record.within;
    var slop = record.slop;
    var shade = ((1 - record.smallIs) * slop + record.smallIs * (2 * maxslop - slop)) / (2 * maxslop);
    shade = -(leaving - 1) / 2 + shade * leaving;
//    console.log("shade " + shade + " within " + record.within);
    accum.shade *= record.within * shade + (1 - record.within);
}

org.weblogo.geom.raster_point = function(poly, point) {
    var c = poly.lines.length;
    // line joining point to exterior point
    var axis = geom.axis_from_heading(point, poly.exterior);
    var conj = geom.line_to_conj(point, axis, poly.exterior);
    var accum = {count: 0, shade: 1}
    for (var i = 0; i < c; ++ i) {
        var line = poly.lines[i];
        var normal = geom.axis_from_heading(point, line);
        var normconj = geom.line_to_conj(point, normal, line);
        var inc = geom.dot_3(axis, line);
        var incf = .002 / Math.sqrt(1 - inc * inc);
        var incs = geom.sign(inc); 
//        console.log("inc ", inc, " incf " , incf);
        var intersect1 = geom.intersect_planes(line, axis, 1);
        var normal1 = geom.point_by_angle(line, intersect1, Math.PI / 2);
        // inc positive indicates *LEAVING*
        var incs = geom.sign(geom.dot_3(normal1, axis));
        var isInt = geom.is_intersect(conj, poly.conj[i], intersect1, incf, incs);
//        console.log("up count: ", isInt, " intersect point ", intersect1, " incs ", incs);
        geom.applyRes(accum, isInt, incf, incs);
        var intersect2 = geom.intersect_planes(line, axis, -1);
//        var normal2 = geom.point_by_angle(line, intersect2, Math.PI / 2);
        var incs2 = -incs;//geom.sign(geom.dot_3(normal2, axis));
        var isInt2 = geom.is_intersect(conj, poly.conj[i], intersect2, incf, incs2);
//        console.log("up count: ", isInt2, " intersect point ", intersect2, " incs2 ", incs2);
        geom.applyRes(accum, isInt2, incf, incs2);
    }
//    console.log("WITHIN: ", accum.count, " shade ", accum.shade);
    return {within: accum.count %2, shade: accum.shade};
};

var polygon = org.weblogo.geom.make_turtle();
/*
var count = geom.raster_point(polygon, [0.000001, -1, 0]);
var up = geom.point_by_angle([0.0001, -1, 0], [-1, 0, 0], Math.PI/4);
var count = geom.raster_point(polygon, up);

var down = geom.point_by_angle([0.0001, -1, 0], [-1, 0, 0], -Math.PI/4);
var count = geom.raster_point(polygon, down);

var midbot = geom.point_by_angle(polygon.points[2], polygon.lines[2], Math.PI/60);
console.log(geom.dot_3(midbot, polygon.lines[2]));
var count = geom.raster_point(polygon, midbot);

var midbotup = geom.point_by_angle(midbot, [-1, 0, 0], .005);
var count = geom.raster_point(polygon, midbotup);

console.log("midbot ", midbot, " midbotup ", midbotup);
*/
var midbot3 = geom.point_by_angle(polygon.points[2], polygon.lines[1], -.01);
console.log(geom.dot_3(midbot3, polygon.lines[1]));
var count = geom.raster_point(polygon, midbot3);

}());

