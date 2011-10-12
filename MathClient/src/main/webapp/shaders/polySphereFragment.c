#ifdef GL_ES
precision highp float;
#endif

#define wr 210.0
#define cr 190.0

float PI = 3.14159265358979323846264;

uniform bool uUseLighting;
uniform vec3 uAmbientColor;

uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;

uniform mat3 uMoonMatrix;

uniform sampler2D uSampler;

vec3 backc = vec3(0.0, 0.0, 0.5);

void main(void) {
    vec2 spos = vec2( (gl_FragCoord.x - wr) / cr, (gl_FragCoord.y - wr) / cr);
    float l2 = dot(spos, spos);
    if (l2 > 1.0) {
       discard;
       }
    vec3 apos = vec3( spos, sqrt(1.0 - l2)); // absolute position normal
    vec3 npos = uMoonMatrix * apos; // position normal in "original" space
    vec2 tpos = vec2(atan(npos.z, -npos.x)/(2.0 * PI) + 0.5, asin(npos.y)/PI + 0.5);
    //vec3 ncol = sin(npos * 100.0) / 4.0;
    vec4 ncol = texture2D(uSampler, tpos);
    vec3 vLightWeighting;
    
    if (!uUseLighting) {
        vLightWeighting = vec3(1.0, 1.0, 1.0);
    } 
    else {
        float directionalLightWeighting = max(dot(apos, uLightingDirection), 0.0);
        vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
    }
    float edgeStep = smoothstep(0.99, 1.0, l2); // AA the edge of the sphere
    gl_FragColor = vec4(mix(ncol.rgb * vLightWeighting, backc, edgeStep), ncol.a);
}