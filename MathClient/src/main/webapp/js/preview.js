(function () {
    org.weblogo.preview = {};

    org.weblogo.preview.glConfig = {
        shaders: {
            vertex: "shaders/nullVertex.c",
            fragment: "shaders/directSphereFragment.c"
        },
        variables: {
            vertexPosition: {storage: "attribute", type: "vertexAttribArray"}, 
            moonMatrix: "uniform",
            sampler: "uniform",
            useLighting: "uniform",
            ambientColor: "uniform",
            backgroundColor: "uniform",
            lightingDirection: "uniform",
            directionalColor: "uniform"
        },
        animate: true,
        autoClear: true
    };

    function canvasToTexture(gl, canvas) {
        var texture = gl.createTexture();
        oldTexture = moonTexture;
        moonTexture = texture;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    var moonTexture, oldTexture;

    var mouseDown = false;
    var lastMouseX = null;
    var lastMouseY = null;

    var moonRotationMatrix = mat4.identity(mat4.create());
    
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

    org.weblogo.preview.userDraw = function (that) {
        var shaderProgram = that.shaderProgram;
        var gl = that.gl;

        var lighting = document.getElementById("lighting").checked;
        gl.uniform1i(shaderProgram.useLighting, lighting);
        if (lighting) {
            gl.uniform3f(shaderProgram.ambientColor, 0.2, 0.2, 0.2);

            var lightingDirection = [ -1, -1, -1 ];
            var adjustedLD = vec3.normalize(lightingDirection);
            vec3.scale(adjustedLD, -1);
            gl.uniform3fv(shaderProgram.lightingDirection, adjustedLD);

            gl.uniform3f(shaderProgram.directionalColor, 0.8, 0.8, 0.8);
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, moonTexture);
        gl.uniform1i(shaderProgram.sampler, 0);
        gl.uniform3f(shaderProgram.backgroundColor, 0.0, 0.0, 0.5); // TODO: proper options system, for the sake of Mike!
        if (oldTexture) {
            gl.deleteTexture(oldTexture);
            oldTexture = null;
        }
        
        // inverse rotation matrix since we are rotating the viewport BACKWARDS to
        // recover the sphere in absolute space
        gl.uniformMatrix3fv(shaderProgram.moonMatrix, false, mat3.transpose(mat4.toMat3(moonRotationMatrix)));
    };
 
    org.weblogo.preview.componentInit = function (that) {
        that.updateTexture = function () {
            canvasToTexture(that.gl, that.canvas2d);
        };
        that.updateTexture();
        that.events.onDraw.addListener(that.updateTexture);
        
        that.gl.clearColor(0.0, 0.0, 0.5, 1.0);
      
        that.container.mousedown(handleMouseDown);
        $(document).mouseup(handleMouseUp);
        $(document).mousemove(handleMouseMove);
    };

    org.weblogo.preview.webGLStart = function (canvas3d, canvas2d, client, callback) {
      
        var that = org.weblogo.webgl.initWebGLComponent(canvas3d,
            org.weblogo.preview.glConfig, {
                userDraw: org.weblogo.preview.userDraw,
                initBuffers: org.weblogo.webgl.makeSquareVertexBuffer,
                canvas2d: $(canvas2d)[0],
                events: client.events,
                startListener: callback // TODO: get rid of this rubbish
            }, org.weblogo.preview.componentInit);
        return that;
    }
    
    org.weblogo.preview.resetPosition = function () {
        mouseDown = false;
        lastMouseX = null;
        lastMouseY = null;

        moonRotationMatrix = mat4.identity(mat4.create());
    
        mat4.rotate(moonRotationMatrix, Math.PI / 2, [0, 1, 0]);
        mat4.identity(mat4.create());
    }

})();
