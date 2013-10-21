#ifdef GL_ES
precision highp float;
#endif

#define wr 210.0
#define cr 190.0

#define aapix 4

float PI = 3.14159265358979323846264;

uniform bool useLighting;
uniform vec3 ambientColor;

uniform vec3 lightingDirection;
uniform vec3 directionalColor;
uniform vec3 backgroundColor;

uniform mat3 moonMatrix;

uniform sampler2D sampler;

vec3 project_colour(vec2 pix) {
    vec2 spos = vec2( (pix.x - wr) / cr, (pix.y - wr) / cr);
    float l2 = dot(spos, spos);
    if (l2 > 1.0) {
        return backgroundColor;
    }
    else {
        vec3 apos = vec3( spos, sqrt(1.0 - l2)); // absolute position normal
        vec3 npos = moonMatrix * apos; // position normal in "original" space
        vec2 tpos = vec2(atan(npos.z, -1.0 * npos.x)/(2.0 * PI) + 0.5, asin(npos.y)/PI + 0.5);
        vec4 ncol = texture2D(sampler, tpos);
        vec3 vLightWeighting;
        
        if (!useLighting) {
            vLightWeighting = vec3(1.0, 1.0, 1.0);
        }
        else {
            float directionalLightWeighting = max(dot(apos, lightingDirection), 0.0);
            vLightWeighting = ambientColor + directionalColor * directionalLightWeighting;
        }
        return ncol.rgb * vLightWeighting;
    }
}

float aapixf = float(aapix);

void main(void) {
    vec3 accum = vec3(0.0);
    for (int aax = 0; aax < aapix; ++ aax) {
        for (int aay = 0; aay < aapix; ++aay) {
            vec2 coord = vec2(float(gl_FragCoord.x) + float(aax) / aapixf, float(gl_FragCoord.y) + float(aay) / aapixf);
            vec3 col = project_colour(coord);
            accum += col;
        }
    }
    gl_FragColor = vec4(accum / (aapixf * aapixf), 1.0);
}