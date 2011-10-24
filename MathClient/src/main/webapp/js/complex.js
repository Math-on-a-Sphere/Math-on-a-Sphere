(function() {
    org.weblogo.complex = {};
    
    org.weblogo.complex.glConfig = {
        shaders: {
            vertex: "shaders/nullVertex.c",
            fragment: "shaders/sphericalHarmFragment.c"
        },
        variables: {
            vertexPosition: {storage: "attribute", type: "vertexAttribArray"},
            palette: "uniform", 
            time: "uniform"
        },
        animate: false
    };

org.weblogo.turtle.commands.sph = function() {
    return {type: "sph"}
};
org.weblogo.turtle.commands.sph.args = [];

org.weblogo.executors.sph = function(config, command, tick) {
    var component = config.complexComponent;
    component.initTime = tick;
    var that = {};
    var imageData = config.context.createImageData(config.width, config.height);
    var gl = component.gl;
    component.userPostDraw = function(that) {
        gl.readPixels(0, 0, config.width, config.height, gl.RGBA, gl.UNSIGNED_BYTE, imageData.data);
        config.context.putImageData(imageData, 0, 0);
    };

    that.toTick = function(now) {
        component.draw();
    };
    return that;
};


org.weblogo.complex.webGLStart = function(canvas, client) {
    var component = org.weblogo.webgl.initWebGLComponent(canvas, 
            org.weblogo.complex.glConfig, {
                userDraw: org.weblogo.complex.userDraw,
                initBuffers: org.weblogo.webgl.makeSquareVertexBuffer,
                events: client.events
            }, org.weblogo.complex.componentInit);
    client.config.complexComponent = component;  
};

org.weblogo.complex.userDraw = function(that) {
    var gl = that.gl;
    gl.uniform1f(that.shaderProgram.time, Date.now() - that.initTime);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, that.paletteTexture);
    gl.uniform1i(that.shaderProgram.palette, 0);
};

// Create a palette linearly moving from black to red and then red to yellow, 
// as in http://www.mai.liu.se/~halun/complex/domain_coloring-unicode.html
org.weblogo.complex.yellowRedPalette = function() {
    var togo = [];
    var red = [255, 0, 0];
    var yellow = [255, 255, 0];
    var black = [0, 0, 0];
    for (var i = 0; i < 128; ++ i) {
        var lerp = vec3.lerp(black, red, i / 128, []);
        lerp[3] = 255;
        togo[i] = lerp;
    }
    for (var i = 128; i < 256; ++ i) {
        var lerp = vec3.lerp(red, yellow, (i - 128) / 128, []);
        lerp[3] = 255;
        togo[i] = lerp;
    }
    return togo;
};

org.weblogo.complex.componentInit = function(that) {
    that.initTime = Date.now();
    that.palette = org.weblogo.webgl.flattenArray(org.weblogo.complex.yellowRedPalette());  
    var gl = that.gl;
    that.paletteTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, that.paletteTexture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, that.palette);
    
//    gl.texImage2D(GLenum target, GLint level, GLenum internalformat, 
//                    GLsizei width, GLsizei height, GLint border, GLenum format, 
//                    GLenum type, ArrayBufferView pixels);
        
        
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

};

})();