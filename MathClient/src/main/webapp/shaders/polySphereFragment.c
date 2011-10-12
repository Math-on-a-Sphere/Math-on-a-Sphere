#ifdef GL_ES
precision highp float;
#endif

#define wr 210.0
#define cr 180.0

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

uniform mat3 uMoonMatrix;

uniform sampler2D uSampler;

void main(void) {
    vec2 spos = vec2( (gl_FragCoord.x - wr) / cr, (gl_FragCoord.y - wr) / cr);
    vec3 npos = uMoonMatrix * vec3( spos, 1.0 - length(spos));
    vec3 ncol = sin(npos * 100.0);
    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = vec4(textureColor.rgb * vLightWeighting + ncol, textureColor.a);
}