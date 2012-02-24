/*
 * Copyright 2010, Google Inc. Licence: 3-clause new BSD
 * All rights reserved.
 * Copyright 2012, U Colorado @ Boulder
 */
 
org.weblogo.webgl = {};
 
(function() {
  
/** Convert a multidimensional array into a flat array suitable to be sent
 * as a GLSL buffer */
org.weblogo.webgl.flattenArray = function(array2, target) {
    var dim = array2[0].length;
    var togo = new Uint8Array(array2.length * dim);
    var c = 0;
    for (var i = 0; i < array2.length; ++ i) {
        for (var j = 0; j < dim; ++ j) {
            togo[c++] = array2[i][j];
        }
    }
    return togo;
};

// Small utility to set uniform values a little more briefly
org.weblogo.webgl.uniformSetter = function(gl, shaderProgram) {
    var that = {};
    that.set = function(name, type, value) {
        var setter = gl["uniform"+type];
        var location = shaderProgram[name];
     //   console.log("Set " + name + " to ", value);
        try {
            setter.call(gl, shaderProgram[name], value);
        }
        catch (e) {
            console.log(e);
            console.log("Unable to set " + name + " at " + location + " to ", value, " (" + typeof(value)+ ") using " + setter); 
        }
    };
    that.setv = function(prefix, index, name, type, value) {
        var fullName = prefix + "[" + index + "]." + name;
        that.set(fullName, type, value);
    };
    return that;
};

org.weblogo.webgl.textToShader = function(gl, text, type, events) {
    var shader;
    console.log("Beginning convert " + type);
    if (type === "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type === "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        events.error({message: "Unrecognised shader type " + type});
    }

    gl.shaderSource(shader, text);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        events.onError.fire({message: "Error compiling " + type + " shader: " + 
            gl.getShaderInfoLog(shader)});
    }
    return shader;
};

org.weblogo.webgl.loadShaders = function(gl, shaderSpecs, events, callback) {
    var deferreds = [];
    var shaders = {};
    fluid.each(shaderSpecs, function(file, key) {
        deferreds.push($.ajax({
            type: "GET",
            dataType: "text",
            url: file,
            success: function(data) {
                shaders[key] = org.weblogo.webgl.textToShader(gl, data, key, events)
                console.log("Ajax success for " + key);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Ajax Error " + textStatus);
                events.onError.fire({message: textStatus + " " + errorThrown});
            },
            complete: function() {
                console.log("Ajax complete for " + key);
            }
        }));
    });
    $.when.apply($, deferreds).then(function() {
        console.log("All Ajax done");
        callback(shaders);
        });
};

var GET_A_WEBGL_BROWSER = '' +
  'This page requires a browser that supports WebGL.<br/>' +
  '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

var OTHER_PROBLEM = '' +
  "It doesn't appear your computer can support WebGL.<br/>" +
  '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';

/**
 * Creates a webgl context. If creation fails it will
 * change the contents of the container of the <canvas>
 * tag to an error message with the correct links for WebGL.
 * @param {Element} canvas. The canvas element to create a
 *     context from.
 * @param {WebGLContextCreationAttirbutes} opt_attribs Any
 *     creation attributes you want to pass in.
 * @param {function:(msg)} opt_onError An function to call
 *     if there is an error during creation.
 * @return {WebGLRenderingContext} The created context.
 */
org.weblogo.webgl.setupWebGL = function(canvas, opt_attribs, events) {
    function signal(msg) {
        var str = window.WebGLRenderingContext ?
                 OTHER_PROBLEM :
                 GET_A_WEBGL_BROWSER;
        str += "\nError: " + msg;
        events.onError.fire(str)
    };
    
    if (canvas.addEventListener) {
        canvas.addEventListener("webglcontextcreationerror", function(event) {
            signal(event.statusMessage);
          }, false);
    }
    var context = org.weblogo.webgl.createGLContext(canvas, opt_attribs);
    if (!context) {
        if (!window.WebGLRenderingContext) {
            signal("");
        }
    }
    return context;
};

/**
 * Creates a webgl context.
 * @param {!Canvas} canvas The canvas tag to get context
 *     from. If one is not passed in one will be created.
 * @return {!WebGLContext} The created context.
 */
org.weblogo.webgl.createGLContext = function(canvas, opt_attribs) {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var ii = 0; ii < names.length; ++ii) {
        try {
            context = canvas.getContext(names[ii], opt_attribs);
        } catch(e) {
            console.log(e);
        }
        if (context) {
            break;
        }
    }
    return context;
};

// Create a vertex buffer which will draw a simple square - that is, a scene
// which will cause the fragment shader to execute for every pixel
org.weblogo.webgl.makeSquareVertexBuffer = function(that) {
    var gl = that.gl;
    var vertices = new Float32Array([
            -1, 1,   1,  1,   1, -1,  // Triangle 1
            -1, 1,   1, -1,  -1, -1   // Triangle 2
        ]);
    that.vertexSize = 2;
    that.vertexCount = vertices.length / that.vertexSize;
 
    that.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, that.vertexBuffer);                                        
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
};

org.weblogo.webgl.makeClear = function(that) {
    return function() {
        var gl = that.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

org.weblogo.webgl.makeDraw = function(that) {
    return function() {
        var times = that.times || 1;
        for (var i = 0; i < times; ++ i) {
        var gl = that.gl;
        if (that.autoClear) {
            that.clear();  
        }

        if (that.userDraw) {
            that.userDraw(that);
        }
          // http://stackoverflow.com/questions/3665671/is-vertexattribpointer-needed-after-each-bindbuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, that.vertexBuffer);                                        
        gl.vertexAttribPointer(that.shaderProgram.vertexPosition, that.vertexSize, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, that.vertexCount);
        // gl.finish();
        if (that.userPostDraw) {
            that.userPostDraw(that);
        }
        }
    };
};


org.weblogo.webgl.initGL = function(that) {
    try {
        var canvas = that.container[0];
        that.canvas = canvas;
        var gl = org.weblogo.webgl.setupWebGL(canvas, that.events);
        
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        if (that.clearColor) {
            gl.clearColor.apply(gl, that.clearColor);  
        }
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
    that.gl = gl;
};

function getUniformLocation(gl, shaderProgram, variable) {
    var location = gl.getUniformLocation(shaderProgram, variable);
//    console.log("Got location ", location, " for uniform " + variable);
    shaderProgram[variable] = location;  
}

org.weblogo.webgl.initShaders = function(that, shaders) {
    var gl = that.gl;

    var shaderProgram = gl.createProgram();
    console.log("code " +  gl.getError());
    gl.attachShader(shaderProgram, shaders.vertex);
    console.log("code " +  gl.getError());
    gl.attachShader(shaderProgram, shaders.fragment);
    console.log("code " +  gl.getError());
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        that.events.onError.fire({message: "Could not link shaders: " +
            gl.getProgramInfoLog(shaderProgram) + " code " + gl.getError()});
    //    throw("fail");
    }

    gl.useProgram(shaderProgram);
    fluid.each(that.variables, function(info, variable) {
        function error(message) {
            that.events.onError.fire({message: message});
        }
        if (typeof(info) === "string") {
            info = {storage: info};
        }
        if (info.storage === "uniform") {
            if (info.struct) {
                var struct = fluid.getGlobalValue(info.struct);
                for (var i = 0; i < info.count; ++ i) {
                    for (var key in struct) {
                        var fullvar = variable + "[" + i + "]." + key;
                        getUniformLocation(gl, shaderProgram, fullvar);
                    }
                } 
            }
            else {
                getUniformLocation(gl, shaderProgram, variable);
            }
        }
        else if (info.storage === "attribute") {
            var pos = gl.getAttribLocation(shaderProgram, variable);
            if (info.type === "vertexAttribArray") {
                gl.enableVertexAttribArray(pos);
            }
            else {
                error("Unrecognised attribute type " + info.type);
            }
            shaderProgram[variable] = pos;
        }
        else {
            error("Unrecognised variable storage type " + info.storage);
        }
    });
         

    console.log("code " +  gl.getError());
    that.shaderProgram = shaderProgram;
};


// The main entry point - create a WebGL-enabled "component" using the supplied configuration

// Silly non-standard signature - fix this up when we can port a bit more of Fluid to "Lite"
org.weblogo.webgl.initWebGLComponent = function(container, options, userOptions, onCreate) {
    var that = {
        container: $(container),
    };
    // Yes, we really stick all the options onto the object
    $.extend(true, that, options, userOptions);
    org.weblogo.webgl.initGL(that);

    org.weblogo.webgl.loadShaders(that.gl, that.shaders, that.events, function(shaders) {
        org.weblogo.webgl.initShaders(that, shaders);
        that.initBuffers(that);
        
        that.clear = org.weblogo.webgl.makeClear(that);
        that.draw = org.weblogo.webgl.makeDraw(that);
        if (that.animate) {
            org.weblogo.webgl.animator(that.draw);
        }
        onCreate(that);
        if (that.startListener) {
            that.startListener();
        }
    });
    return that;
};


org.weblogo.webgl.animator = function(callback) {
    var requestor = window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame || function(callback) {
             window.setTimeout(callback, 1000/60);
         };
    var that = {cancelled: false};
    that.ticker = function() {
        if (!that.cancelled) {
             callback();
             requestor(that.ticker);
        };
    };
    that.cancel = function() {
        that.cancelled = true;
    }
    that.ticker();
    return that;
    };
    
})();

