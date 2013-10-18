#ifdef GL_ES
precision highp float;
#endif

#define cr 512.0

const float PI = 3.14159265358979323846264;
const float PI2 = 2.0*PI;

const int MAX_LINES = 16;

vec3 polar_to_3 (float theta, float phi) {
    return vec3(cos(theta) * sin(phi), 
               -cos(theta) * cos(phi),
                sin(theta));
}

vec3 intersect_planes (vec4 p1, vec3 p2, float sign) {
    vec3 p1_3 = vec3(p1);
    float g = dot(p1_3, p2);
    float d2 = 1.0 - g*g;
    float a1 = p1[3];
    float c1 = - a1/ d2;
    float c2 = a1 * g/ d2;
    float l2 = (d2 - a1*a1) / (d2 * d2);
    return p1_3*c1 + p2*c2 + sign*sqrt(l2)*cross(p1_3, p2);
}

vec3 intersect_hplanes (vec3 p1, vec3 p2) {
    return normalize(cross(p1, p2));
}

vec3 point_by_angle (vec3 point, vec3 axis, float angle) {
    float c  = cos(angle), s = sin(angle), c1 = 1.0 - c;
    float ux = axis[0],   uy = axis[1],    uz = axis[2];
    float px = point[0],  py = point[1],   pz = point[2];
    return vec3(
    (c + ux*ux*c1)    * px + (ux*uy*c1 - uz*s) * py + (ux*uz*c1 + uy*s) * pz,
    (uy*ux*c1 + uz*s) * px + (c + uy*uy*c1)    * py + (uy*uz*c1 - ux*s) * pz,
    (uz*ux*c1 - uy*s) * px + (uz*uy*c1 + ux*s) * py + (c + uz*uz*c1)    * pz 
    );
}

// JS atan2 in range -PI to PI
float get_parameter (vec3 conj, float angle, vec3 point) {
    vec3 upped = point_by_angle(point, conj, angle);
    float param = atan(upped[0], -1.0 * upped[1]); // work around HD 5000 bug
    return param;
}

vec3 axis_from_heading (vec3 p0_3, vec3 p1_3) {
    vec3 norm = cross(p0_3, p1_3);
    return normalize(norm);
}

struct conjStruct {
    vec3 conj;
    float angle;
    float start;
    float end;
    float bendstart;
    float bend;
    float mind;
    float maxd;
    };

// Compute rotation which takes line axis to the pole, for purposes of mapping
// line intervals
// returns (conj, angle) packed into vec4, suitable for is_intersect
conjStruct line_to_conj (vec3 point1, vec3 xine, vec3 point2) {
    vec3 conj = axis_from_heading(xine, vec3(0.0, 0.0, 1.0));
    float angle = acos(xine[2]);
    float start = get_parameter(conj, angle, point1);
    float end = get_parameter(conj, angle, point2);
    return conjStruct(conj, angle, start, end, 0.0, 0.0, 0.0, 0.0);
}

float pr = 0.0, pg = 0.0, pb = 0.0;

uniform int lineCount;
uniform float lineWidth;

// hopefully: http://stackoverflow.com/questions/8202173/setting-the-values-of-a-struct-array-from-js-to-glsl

struct polyStruct {
    conjStruct conj;
    vec4 line4; // somehow there is an objection during linking, naming this field "line"
    };

uniform polyStruct poly[MAX_LINES];
uniform vec3 exterior;
uniform vec4 colfill;
uniform vec4 colbord;

float is_within_core(float start, float param, float end) {
    float isign = sign(end - start);
    float ind = step(-isign*param, -isign*start) * step(isign*param, isign*end);
    return ((1.0 - isign)/2.0 + isign * ind);
}

float is_within_perp (float start, float param, float end, float startslop, float endslop) {
    start = mod(start - startslop, PI2);
    end = mod(end + endslop, PI2);
    param = mod(param, PI2);
    return is_within_core(start, param, end);
}

// conj2 is polygon's conj - used for intersection with perpendiculars for shading
float is_intersect_perp (conjStruct conj1, conjStruct conj2, vec3 point, float startslop, float endslop) {
    float param2 = get_parameter(conj2.conj, conj2.angle, point);
    float is2 = is_within_perp(conj2.start, param2, conj2.end, startslop, endslop);
    return is2;
}

float applyShade (float shade, float slope) {
    float tshade = slope + step(-1e-9, -slope); // slope of 0 maps to 1
    return min(shade, tshade);
}

// http://stackoverflow.com/questions/4911400/shader-optimization-is-a-ternary-operator-equivalent-to-branching
// apparently it is - these function calls are presumably much cheaper
float cotSlop (float slope, float slop, float bend) {
    return mix(
         0.3 * slop * (2.0 * slope - 0.8) / tan(bend),
         1.8 * slop * min(2.0 * slope - 1.0, 0.0) / sin(2.0 * bend),
         step(PI / 2.0, bend)   // 0 if bend < PI/2, picks first branch  
         );
}


// Note on modular operations:
// Astoundingly, this operation is missing from GLSL, and the implementation reserves
// the right to do any integer divides using FP anyway (spec section 5.13) - 
// also, spect section 10.28 indicates rounding mode of integer division is undefined!!!
// 10.30 states that 9/3 may evaluate to 2 !!!
// 9 / 3 = 9.0 * (1.0 / 3.0) = 9.0 * 0.333 = 2.997 = 2 (integer)

void update_bounds (float dot, inout float minPos, inout float maxNeg) {
    float upPos = step(dot, 0.0)*1e9 + step(0.0, dot)*dot;
    minPos = min(minPos, upPos);
        
    float downNeg = step(0.0, dot)*-1e9 + step(dot, 0.0)*dot;
    maxNeg = max(maxNeg, downNeg);
}


void raster_point (vec3 point, out float within, out float shade) {
    int c = lineCount;
    float slop = 0.02;//lineWidth;
    shade = 1.0;
    float minPos = 1e9, maxNeg = -1e9;
    float dead = 1.0;
    for (int i = 0; i < MAX_LINES; ++ i) {
        // we can't write a loop with a non-constant
        // index - http://www.khronos.org/webgl/public-mailing-list/archives/1012/msg00091.html
        if (i >= c) {
            break;
        }
        vec4 line4 = poly[i].line4;
        vec3 line3 = vec3(line4);
        vec3 normal = axis_from_heading(point, line3);
        
        conjStruct normconj = line_to_conj(point, normal, line3);
        conjStruct polyconj = poly[i].conj;
        float bends = PI - polyconj.bendstart/2.0;
        float bende = PI - polyconj.bend/2.0;
        
        float ndot = dot(line3, point) + line4[3];

        dead *= step(polyconj.mind, ndot);
        dead *= step(ndot, polyconj.maxd);
        if (dead == 0.0) {
            break;
        }
        
        float slope = clamp((-ndot + slop)/(2.0 * slop), 0.0, 1.0);
        
        float startslop = cotSlop(slope, slop, bends);
        float endslop = cotSlop(slope, slop, bende);
        
        vec3 intersectn1 = intersect_planes(line4, normal, 1.0);
        float isIntn1 = is_intersect_perp(normconj, polyconj, intersectn1, startslop, endslop);
        if (isIntn1 > 0.0) { // hopefully the locality of these branches will justify the cost
            shade = applyShade(shade, slope);
            update_bounds(ndot, minPos, maxNeg);
            }
        
        vec3 intersectn2 = intersect_planes(line4, normal, -1.0);
        float isIntn2 = is_intersect_perp(normconj, polyconj, intersectn2, startslop, endslop);
        if (isIntn2 > 0.0) {
            shade = applyShade(shade, slope);
            update_bounds(ndot, minPos, maxNeg);
            }
    }
    float fStr = -(1.0/minPos + 1.0/maxNeg);
    within = dead * (1.0 - step(fStr, 0.0));
    shade = shade * dead;
}

void simple_raster_point (vec3 point, out float within, out float shade) {
    int c = lineCount;
    float withins = 1.0;
    for (int i = 0; i < MAX_LINES; ++ i) {
        if (i >= c) {
            break;
        }
        vec4 line4 = poly[i].line4;
        vec3 line3 = vec3(line4);
        float ndot = dot(line3, point) + line4[3];
        float twithin = step(ndot, 0.0);
        withins *= twithin;
    }
    within = sign(withins);
    shade = 1.0;
}


void main(void) {
    float xp = PI * (gl_FragCoord.x - cr) / cr;
    float yp = PI * (gl_FragCoord.y - cr/2.0) / cr;
    vec3 r = polar_to_3(yp, xp);
    float within = 0.0;
    float shade = 1.0;
    raster_point(r, within, shade);
    //pr = dot(poly[2].line4, poly[2].line4);
    
    float bshade = (shade == 1.0 || shade == 0.0)? 0.0 : shade;

    if (bshade + within == 0.0) {
        discard;
        }
    else {
        float bmap = 2.0 * (0.25 - (bshade - 0.5) * (bshade - 0.5)); 
        float fshade = (bshade > 0.0? bshade : within) / 2.0;
    
        vec4 pcol = vec4(1,0,0,1)*pr + vec4(0,1,0,1)*pg + vec4(0,0,1,1)*pb;
    
        gl_FragColor = colfill*fshade + colbord*bmap + pcol;
        gl_FragColor[3] = fshade * 4.0;
        }
    }