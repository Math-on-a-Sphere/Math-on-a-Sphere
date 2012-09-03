(function() {

var geom = org.weblogo.geom;

var id = 1;

// All internal turtle structures store a position as 3d, a heading as a 3d axis,
// measurements in radians and times in seconds
org.weblogo.turtleDefaults = {
    position: geom.polar_to_3(0, 0),
    heading: null,  // computed to be towards the pole in creator
    colour: "white",
    width: Math.PI/80,
    drawing: true,
    showing: true,
    speed: Math.PI - .001, // travel halfway round sphere in 1 second
    turnSpeed: 4*Math.PI
};
 
org.weblogo.turtle = function(userOptions) {
    var that = {};
    var options = $.extend(true, {}, org.weblogo.turtleDefaults, userOptions);
    // if user has not initialised heading, set it to pole from their initial point
    // TODO: indeterminacy
    if (!options.heading) {
        var pole = geom.polar_to_3(Math.PI/2, 0);
        options.heading = geom.axis_from_heading(options.position, pole); 
    }
    $.extend(true, that, options);
    that.id = id++;
    return that;
};

org.weblogo.raster = {};
var raster = org.weblogo.raster;


org.weblogo.raster.stroke_line_elem = function(start, end, options) {
    var width = options.config.width;
    var height = options.config.height;

    var canvas = options.config.context;
    var corners;
    var poles;
    if (options.width > 0) {
        var poly = geom.polygon_line_elem(start, end, options);
        poles = geom.check_poles(poly);
        corners = poly.corners;
    }
    else {
        corners = [start, end];
    }
    var corners2 = fluid.transform(corners, function(corner) {
        return geom.pixel_from_3(corner, width, height);
        });
    // console.log("Corners: " + JSON.stringify(corners2));
    var close;
    if (poles[0] || poles[1]) {
        // console.log("Pole");
        var polar_y = poles[0]? 0 : height;
        close = geom.convert_polar_polygon(corners2, width, polar_y);
    }
    else {
        close = geom.closification(corners2, width);
    }
    var p = close.points;
    for (var i = 0; i < close.wrap_x.length; ++ i) {
        canvas.beginPath();
        canvas.moveTo(p[0][0] + close.wrap_x[i], p[0][1]);
        for (var j = 1; j < p.length; ++ j) {
            canvas.lineTo(p[j][0] + close.wrap_x[i], p[j][1]);
        }
        canvas.closePath();
        canvas.stroke();  
        canvas.fill();
    }
};

org.weblogo.raster.stroke_line = function(options) {
    options.config.context.fillStyle = options.config.context.strokeStyle =  
       org.weblogo.colour.cssFromColour(options.colour);
    var distance = 0, pos = options.start;
    // Add tiny amount of jitter to compensate for rendering bugs, especially on Chrome
    //  - ensure that successive polygons abut - experimental
    var jitter = 1e-3;
    while (true) {
        options.config.context.fillStyle = options.config.context.strokeStyle =  
            org.weblogo.colour.cssFromColour(options.colour);
        var cosy = Math.cos(geom.polar_from_3(pos)[0]);
        // take smaller steps close to the poles
        var sfac = (cosy*cosy + 1/40) * 5;

        var step = options.config.rasterStep * sfac; 
        var newDistance = distance + step + jitter;
        if (newDistance > options.distance) {
            newDistance = options.distance + jitter;
        }

        newPos = geom.rotate_by(options.start, options.heading, newDistance);
        
        org.weblogo.raster.stroke_line_elem(pos, newPos, options); 
        if (newDistance >= options.distance) {
            break;
        }
        distance = newDistance - jitter;
        pos = geom.rotate_by(options.start, options.heading, distance); 
    }
};

org.weblogo.colour = {};

org.weblogo.colour.cssFromRGB = function(rgb) {
    return "rgb(" + Math.round(rgb[0]) + "," + Math.round(rgb[1]) + "," + Math.round(rgb[2]) + ")"; 
}

org.weblogo.colour.cssFromColour = function(colour) {
    if (typeof(colour) === "string") {
        colour = org.weblogo.netLogoColourNames[colour];
    }
    if (typeof(colour) === "number") {
        colour = org.weblogo.netLogoColourToRGB(colour); 
    }
    // it should now be an RGB list
    return org.weblogo.colour.cssFromRGB(colour);
}

org.weblogo.importReserve = function() {
    var output = "";
    $.each(org.weblogo.netLogoColourNames, function(pair){
        output += pair + " = \"" + pair + "\";\n";
    });
    output += "var on = 1; var off = 0;\n";
    //output += "color = \"color\";\n";
    //output += "pensize = \"pensize\";\n";
    return output;
}

org.weblogo.netLogoColourNames = {
    black: 0, 
    gray: 5,
    white: 9.9, 
    red: 15,
    orange: 25, 
    brown: 35,
    yellow: 45, 
    green: 55,
    lime: 65,
    turquoise: 75,
    cyan: 85,
    sky: 95,
    blue: 105,
    violet: 115, 
    magenta: 125,
    pink: 135
};

// These values and function reverse-engineered from inspection of published
// NetLogo colour system which is pretty wacky but does have the virtue of sampling
// a lot of RGB space using a single float value

org.weblogo.netLogoColours = [
    [141, 141, 141], //  5
    [215, 50,   41], // 15
    [241, 106,  21], // 25
    [157, 110,  72], // 35
    [237, 237,  49], // 45
    [ 89, 176,  60], // 55
    [ 44, 209,  59], // 65
    [ 29, 159, 120], // 75
    [ 84, 196, 196], // 85
    [ 45, 141, 190], // 95
    [ 52, 93,  169], // 105
    [124, 80,  164], // 115
    [167, 27,  106], // 125
    [224, 127, 150]  // 135
];

org.weblogo.wrapNetLogoColour = function(num) {
    return (num % 140) + (num < 0? 140 : 0);  
}

org.weblogo.netLogoColourToRGB = function(num) {
    num = org.weblogo.wrapNetLogoColour(num);
    var bracket = Math.floor(num / 10);
    var base = org.weblogo.netLogoColours[bracket];
    var intensity = num % 10;
    var f, togo;
    if (intensity < 5) {
        f = (intensity / 5);
        togo = [base[0] * f, base[1] * f, base[2] * f];
    }
    else {
        f = (10 - intensity) / 5;
        togo = [255 - (255 - base[0]) * f, 
                255 - (255 - base[1]) * f,
                255 - (255 - base[2]) * f]
    }
    return togo;
};


})();
