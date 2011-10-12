(function() {
    org.weblogo.preview = {};
        
    org.weblogo.preview.initGL = function(canvas, events) {
        try {
            var gl = org.weblogo.webgl.setupWebGL(canvas, events);
            
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
        return gl;
    };

    org.weblogo.preview.shaders = {
        vertex: "shaders/polySphereVertex.c",
        fragment: "shaders/polySphereFragment.c"
    };

    var shaderProgram;

    function initShaders(gl, shaders, events) {

        shaderProgram = gl.createProgram();
        console.log("code " +  gl.getError());
        gl.attachShader(shaderProgram, shaders.vertex);
        console.log("code " +  gl.getError());
        gl.attachShader(shaderProgram, shaders.fragment);
        console.log("code " +  gl.getError());
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            events.error({message: "Could not link shaders: " +
                gl.getProgramInfoLog(shaderProgram) + " code " + gl.getError()});
        //    throw("fail");
        }

        gl.useProgram(shaderProgram);
        console.log("code " +  gl.getError());

        shaderProgram.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.moonMatrixUniform = gl.getUniformLocation(shaderProgram, "uMoonMatrix");

        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
        shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
        shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
        shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
        shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
        console.log("code " +  gl.getError());
    }


    function canvasToTexture(gl, canvas) {
        var texture = gl.createTexture();
        moonTexture = texture;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    var moonTexture;

    var mouseDown = false;
    var lastMouseX = null;
    var lastMouseY = null;

    var moonRotationMatrix =  mat4.identity(mat4.create());
    
    mat4.rotate(moonRotationMatrix, Math.PI / 2, [0, 1, 0]);

    function handleMouseDown(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }


    function handleMouseUp(event) {
        mouseDown = false;
    }


    function handleMouseMove(event) {
        if (!mouseDown) {
            return;
        }
        var newX = event.clientX;
        var newY = event.clientY;

        var deltaX = newX - lastMouseX
        var newRotationMatrix = mat4.create();
        mat4.identity(newRotationMatrix);
        mat4.rotate(newRotationMatrix, deltaX / 200, [0, 1, 0]);

        var deltaY = newY - lastMouseY;
        mat4.rotate(newRotationMatrix, deltaY / 200, [1, 0, 0]);

        mat4.multiply(newRotationMatrix, moonRotationMatrix, moonRotationMatrix);

        lastMouseX = newX
        lastMouseY = newY;
    }

    var vertexBuffer;

    function initBuffers(gl) {
        var vertices = new Float32Array([
            -1, 1,   1,  1,   1, -1,  // Triangle 1
            -1, 1,   1, -1,  -1, -1   // Triangle 2
        ]);
 
        vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);                                        
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }


    function drawScene(gl) {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var lighting = document.getElementById("lighting").checked;
        gl.uniform1i(shaderProgram.useLightingUniform, lighting);
        if (lighting) {
            gl.uniform3f(shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2);

            var lightingDirection = [ -1, -1, -1 ];
            var adjustedLD = vec3.normalize(lightingDirection);
            vec3.scale(adjustedLD, -1);
            gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

            gl.uniform3f(shaderProgram.directionalColorUniform, 0.8, 0.8, 0.8);
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, moonTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        // http://stackoverflow.com/questions/3665671/is-vertexattribpointer-needed-after-each-bindbuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);                                        
        gl.vertexAttribPointer(shaderProgram.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
      
        // inverse rotation matrix since we are rotating the viewport BACKWARDS to
        // recover the sphere in absolute space
        gl.uniformMatrix3fv(shaderProgram.moonMatrixUniform, false, mat3.transpose(mat4.toMat3(moonRotationMatrix)));
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }


    org.weblogo.preview.webGLStart = function(canvas3d, canvas2d, events) {
        var canvas = $(canvas3d);
        var gl = org.weblogo.preview.initGL(canvas[0]);
        var that = {};
        that.updateTexture = function() {
            canvasToTexture(gl, $(canvas2d)[0]);
        };
        org.weblogo.webgl.loadShaders(gl, org.weblogo.preview.shaders, events, function(shaders) {
            initShaders(gl, shaders, events);
            initBuffers(gl);
            that.updateTexture();
    
            gl.clearColor(0.0, 0.0, 0.5, 0.1);
            gl.enable(gl.DEPTH_TEST);
    
            canvas.mousedown(handleMouseDown);
            $(document).mouseup(handleMouseUp);
            $(document).mousemove(handleMouseMove);
            
            org.weblogo.webgl.animator(function() {drawScene(gl)});
        });
        return that;
    }
    
})();