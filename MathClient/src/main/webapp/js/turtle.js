(function() {

var geom = org.weblogo.geom;

var id = 1;

// All internal turtle structures store a position as 3d, a heading as a 3d axis,
// measurements in radians and times in seconds
org.weblogo.turtleDefaults = {
    position: geom.polar_to_3(0, 0),
    heading: null,  // computed to be towards the pole in creator
    colour: "white",
    width: 0,
    drawing: true,
    speed: Math.PI // travel halfway round sphere in 1 second
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

raster.close = function(val1, val2, period) {
    var togo = {val1: val1, val2: val2};
    if (val2 - val1 > period/2) {
        togo.wrap = [0, -period];
        togo.val1 += period;
    }
    else if (val1 - val2 > period / 2) {
        togo.wrap = [0, -period];
        togo.val2 += period;
    }
    if (!togo.wrap) {
        togo.wrap = [0];
    }
    return togo;
}

org.weblogo.raster.closification = function(start2, end2, width, height) {
    var closx = raster.close(start2[0], end2[0], width);
    var closy = raster.close(start2[1], end2[1], height);
    return {
        start: [closx.val1, closy.val1],
        end:   [closx.val2, closy.val2],
        wrap_x: closx.wrap,
        wrap_y: closy.wrap
    }; 
};

org.weblogo.raster.stroke_line_elem = function(start, end, options) {
    var width = options.config.width;
    var height = options.config.height;
    var start2 = geom.pixel_from_3(start, width, height);
    var end2 = geom.pixel_from_3(end, width, height);
    var close = org.weblogo.raster.closification(start2, end2, width, height);
    var canvas = options.config.context;
    for (var i = 0; i < close.wrap_x.length; ++ i) {
        canvas.beginPath();
        canvas.moveTo(close.start[0] + close.wrap_x[i], close.start[1]);
        canvas.lineTo(close.end  [0] + close.wrap_x[i], close.end  [1]);
        if (options.width === 0) {
            canvas.stroke();  
        }
        else {
            canvas.fill();
        }
    } 
};

org.weblogo.raster.stroke_line = function(options) {
    options.config.context.fillStyle = options.config.context.strokeStyle =  
       org.weblogo.colour.cssFromColour(options.colour);
    var distance = 0, pos = options.start;
    while (true) {
        var newDistance = distance + options.config.rasterStep;
        if (newDistance > options.distance) {
            newDistance = options.distance;
        }
        var versor = geom.versor_from_parts(options.heading, newDistance);
        newPos = geom.quat_conj(versor, options.start);
        org.weblogo.raster.stroke_line_elem(pos, newPos, options); 
        if (newDistance >= options.distance) {
            break;
        }
        pos = newPos; distance = newDistance;
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