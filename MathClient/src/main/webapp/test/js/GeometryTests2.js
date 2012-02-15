var test = {};

(function ($) {

    var geom = org.weblogo.geom;

    var scale = 400;
    
    var writeRGB = function(array, index, values) {
        array[index] = values[0];
        array[index + 1] = values[1];
        array[index + 2] = values[2];
        array[index + 3] = 0xff;
    };
    
    var scalec = function(colour, scale) {
        for (var i = 0; i < 3; ++ i) {
            colour[i] *= scale;
        }
    };
    
    var polygon = org.weblogo.geom.make_turtle();
    
    test.renderTurtle = function() {
        var canvas = $("#canvas")[0];
        var colfill = [0, 0xee, 0xee];
        var colbord = [0, 0xff, 0xff];
        var black = [0, 0, 0];
        var width = canvas.width;
        var height = canvas.height;
        var context = canvas.getContext("2d");
        var imgd = context.createImageData(width, height);
        var pix = imgd.data;
        var index = 0;
        var init = Date.now();
        for (var j = 0; j < height; ++ j) {
            for (var i = 0; i < width; ++ i) {
                var xp = Math.PI * (i - width/2) / scale, yp = Math.PI * (j - height / 2) / scale;
                var r = geom.polar_to_3(.5 * -yp, .5 * xp);
                r = geom.point_by_angle(r, [0, -1, 0], 1);
                
                var within = geom.raster_point(polygon, r);
                var bshade = (within.shade != 1 && within.shade != 0)? within.shade : 0;
                var bmap = 2 * (0.25 - (bshade - 0.5) * (bshade - 0.5)); 
                var fshade = (bshade? bshade : within.within) / 2; 
                var fcol = vec3.scale(colfill, fshade, vec3.create());
                var bcol = vec3.scale(colbord, bmap, vec3.create());
                var col = vec3.add(fcol, bcol);
                
                writeRGB(imgd.data, index, col);
                index += 4;
            }
        }
        var lag = Date.now() - init;
        var rate = width * height * 1000.0 / lag;
        console.log("Completed in " + lag + "ms " + rate.toFixed(2) + " pixels/s");
        context.putImageData(imgd, 0, 0);
    };
    
    test.init = function() {
        $("#button").click(test.renderTurtle);
    } 
  
})(jQuery);