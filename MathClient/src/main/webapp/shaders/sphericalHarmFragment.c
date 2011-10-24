#ifdef GL_ES
precision highp float;
#endif

#define cr 512.0

float PI = 3.14159265358979323846264;

uniform float time;

uniform sampler2D palette;

void main(void) {
    vec2 spos = vec2( PI* gl_FragCoord.x / cr, PI * gl_FragCoord.y / cr);
    //float angle = atan(spos.y, spos.x);
    float phase = (spos.x + spos.y + time / 1000.0) / PI;
    gl_FragColor = texture2D(palette, vec2(fract(phase), 0.0));
    //gl_FragColor = texture2D(palette, vec2(gl_FragCoord.x / 1024.0, 1.0));
    }
