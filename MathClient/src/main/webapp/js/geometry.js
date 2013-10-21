var org = org || {};
org.weblogo = {
    geom: {}
};

(function () {

var geom = org.weblogo.geom;

org.weblogo.geom.rad2deg = function (r) {
    return (r*180)/Math.PI
};
org.weblogo.geom.deg2rad = function (d) {
    return (d*Math.PI)/180
};


org.weblogo.geom.mult_33 = function (m, v) {
    return [
       m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] + v[2],
       m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] + v[2],
       m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] + v[2],
    ];
};

org.weblogo.geom.add_3 = function (a, b) {
    return [ a[0] + b[0], a[1] + b[1], a[2] + b[2]];
};

org.weblogo.geom.cross_3 = function (a, b) {
    return [ 
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
    ]
};

// Produces a value safe to be sent to Math.acos, in the range [-1, 1]
org.weblogo.geom.safe_dot_3 = function (a, b) {
    var dot = geom.dot_3(a, b);
    return dot < -1.0 ? -1.0 : (dot > 1.0 ? 1.0 : dot); 
}

org.weblogo.geom.dot_3 = function (a, b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];  
};

org.weblogo.geom.scale_3 = function (a, l) {
    return [a[0] * l, a[1] * l, a[2] * l];
};

org.weblogo.geom.scale_4 = function (a, l) {
    return [a[0] * l, a[1] * l, a[2] * l, a[3] * l];  
};

org.weblogo.geom.norm_3 = function (a) {
    var norm = geom.length_3(a);
    return norm === 0? [0, 0, 1] : geom.scale_3(a, 1/norm);
};

org.weblogo.geom.dist_3 = function (a, b) {
    var diff = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    return geom.dot_3(diff, diff); 
};

org.weblogo.geom.length_3 = function (a) {
     return Math.sqrt(geom.dot_3(a, a));
};


/** Converts a unit 3-d vector into a unit quaternion by prepending 0 as the real part **/

org.weblogo.geom.quat_from_3 = function (n) {
    return [0, n[0], n[1], n[2]];
};

/** Convert spherical polar coordinates to 3-dimensional unit vector representing
 * position on sphere surface
 * @param theta Inclination from equator in degrees (north pole is +pi/2)
 * @param phi Azimuth measured anticlockwise as seen from north pole (in the range -pi to pi) - 
 * a "Greenwichian" system with the 0 degree azimuth at (0, -1)
 */

org.weblogo.geom.polar_to_3 = function (theta, phi) {
    return [Math.cos(theta) * Math.sin(phi), 
            -Math.cos(theta) * Math.cos(phi),
             Math.sin(theta)];
};
/** Convert a 3-dimensional vector back into spherical polars, inverting polar_to_3 
 * @return [theta, phi, r]
 */
org.weblogo.geom.polar_from_3 = function (n) {
    var norm = geom.length_3(n);
    return [Math.asin(n[2] / norm), Math.atan2(n[0], -n[1]), norm];
};

/** Convert standard spherical polar coordinates to quaternion unit vector
 * representing position
 * @param theta Inclination from equator in degrees (north pole is +pi/2)
 * @param phi Azimuth measured anticlockwise as seen from north pole (in the range -pi to pi)
 */

org.weblogo.geom.polar_to_quat = function (theta, phi) {
    var three = geom.polar_to_3(theta, phi);
    return geom.quat_from_3(three);
};

/** Multiply two quaternions together - compute the product pq */
org.weblogo.geom.quat_mult = function (p, q) {
    return [
        p[0]*q[0] - p[1]*q[1] - p[2]*q[2] - p[3]*q[3],
        p[0]*q[1] + p[1]*q[0] + p[2]*q[3] - p[3]*q[2],
        p[0]*q[2] - p[1]*q[3] + p[2]*q[0] + p[3]*q[1],
        p[0]*q[3] + p[1]*q[2] - p[2]*q[1] + p[3]*q[0] 
    ]
};

/** Inverts a quaternion, assuming it to be a unit (actually returns its conjugate) */
org.weblogo.geom.quat_inv = function (v) {
    return [v[0], -v[1], -v[2], -v[3]];
}

/** Conjugates one quaternion by another, computing the product q v q^{-1} - this
 * has the effect of rotating the vector represented by v by the "versor" represented by
 * q. This currently uses the very slow method of multiplying 3 quaternions - it could be
 * upgraded to a much more efficient method where the real part of v is assumed to be zero. 
 * This would use the efficient 30-operation expression 
 * v + 2q x (q x v + wv) described at http://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation 
 * and in slightly more detail at https://mollyrocket.com/forums/viewtopic.php?p=6154 */
 
org.weblogo.geom.quat_conj = function (q, v) {
    var inv = geom.quat_inv(q);
    var two = geom.quat_mult(q, geom.quat_from_3(v));
    var result = geom.quat_mult(two, inv);
    return [result[1], result[2], result[3]]; 
};

/** Recovers the 3-vector unit normal required to rotate the 3-d unit vector p0 
 * into the 3-d unit vector p1 along unit sphere great circle */

org.weblogo.geom.axis_from_heading = function (p0_3, p1_3) {
    var norm = geom.cross_3(p0_3, p1_3);
    return geom.norm_3(norm);
};

/** Given an axis and angle, construct the versor quaternion value which will act as a rotation
 * by that angle about the axis 
 * @param n The 3-d unit normal vector forming the axis for the rotation
 * @param W The rotation angle, measured in radians 
 */ 

org.weblogo.geom.versor_from_parts = function (n, W) {
    var sinW = Math.sin(W / 2);
    return [Math.cos(W / 2), sinW * n[0], sinW * n[1], sinW * n[2]]; 
};

// TODO: optimised as point_by_angle in the GLSL code
org.weblogo.geom.rotate_by = function (v, axis, angle) {
    var versor = geom.versor_from_parts(axis, angle);
    return geom.quat_conj(versor, v);  
};

/** Converts a unit vector in 3d into "ECE" coordinates in pixels, given
 * rectangular width and height */

org.weblogo.geom.pixel_from_3 = function (n, width, height) {
    var polar = geom.polar_from_3(n);
    return [width *  (polar[1] + Math.PI) / (2 * Math.PI),
             height * (Math.PI/2 - polar[0]) / Math.PI];
};

/** Given an array of 4 great circle axes, (left, top, right, bottom), 
  * return an array of their intersections (bl, tl, tr, br)
  */
org.weblogo.geom.edges_to_corners = function (edges) {
    var togo = []
    for (var i = 0; i < 4; ++ i) {
        var ni = (i + 1) % 4;
        var cross = geom.cross_3(edges[i], edges[ni]);
        togo[ni] = geom.norm_3(cross);
    }
    return togo;
};

/** Given an array of 4 corner points (bl, tl, tr, br), return an array of great circles
  * which have them as intersections (left, top, right, bottom)
  * return an array of their intersections 
  */
org.weblogo.geom.corners_to_edges = function (corners) {
    var togo = [];
    for (var i = 0; i < 4; ++ i) {
        var ni = (i + 1) % 4;
        togo[i] = geom.axis_from_heading(corners[i], corners[ni]);
    }
    return togo;
};

/** Given point and versor for a line segment, compute the polygon bounded
 * by great circles that expands the line segment to angle options.width */
org.weblogo.geom.polygon_line_elem = function (start, end, options) {
    var perpHeading = geom.rotate_by(options.heading, start, Math.PI/2);
    
    // leftVersor and rightVersor take points along the midpoint of the path
    // and rotate them to the edges of the path to be filled
    var leftVersor = geom.versor_from_parts(perpHeading, options.width / 2);
    var rightVersor = geom.quat_inv(leftVersor);
    
    var perpHeadingEnd = geom.rotate_by(options.heading, end, Math.PI/2);
    var leftVersorEnd = geom.versor_from_parts(perpHeadingEnd, options.width / 2);
    var rightVersorEnd = geom.quat_inv(leftVersorEnd);
    
    var corners = [geom.quat_conj(leftVersor, start),
                   geom.quat_conj(leftVersorEnd, end),
                   geom.quat_conj(rightVersorEnd, end),
                   geom.quat_conj(rightVersor, start)];
    
    // Four great circles bounding the area, in order left, top, right, bottom
    var edges = geom.corners_to_edges(corners);
    return {edges: edges, corners: corners};
};

org.weblogo.geom.check_poles = function (polygon) {
    var makeDots = function (pole, polygon) {
        return fluid.transform(polygon.edges, function (edge) {
            return geom.dot_3(edge, pole);
        });
    };
    var hasPlus = function (dots) {
        return fluid.find(dots, function (dot) {
            return dot < 0? undefined: true;
        });
    };
    var northDots = makeDots([0, 0, 1], polygon);
    var southDots = makeDots([0, 0, -1], polygon);
    return [!hasPlus(northDots), !hasPlus(southDots)];
};

org.weblogo.geom.convert_polar_polygon = function (corners, width, polar_y) {
    var sorted = corners.sort(function (p1, p2) {
        return p1[1] - p2[1];
    });
    var last = sorted.length - 1;
    var extras = [
        [sorted[0][0] + width, sorted[0][1]], // right image of 0th point
        [width, polar_y],
        [0, polar_y],
        [sorted[last][0] - width, sorted[last][1]]
        ];
    return {
        points: sorted.concat(extras),
        wrap_x: [0]
    };
};

/** Determines whether values intended to be close together have wrapped either
 * backwards or forward around a range of size "period"*/
org.weblogo.geom.hop = function (val1, val2, period) {
    if (val2 - val1 > period/2) {
        return period;
    }
    else if (val1 - val2 > period / 2) {
        return -period;
    }
    else return 0;
}

/** Determine wrapping of points forming a polygon across x-direction of rectangle */
org.weblogo.geom.closification = function (points, width) {
    var firstHop = 0;
    var runHop = 0;
    var togo = {points: [points[0]]};
    for (var i = 1; i < points.length; ++ i) {
        var hop = geom.hop(points[i - 1][0], points[i][0], width);
        runHop += -hop;
        if (hop != 0 & firstHop === 0) {
            firstHop = hop;
        }
        togo.points[i] = [points[i][0] + runHop, points[i][1]];
    }
    togo.wrap_x = firstHop === 0? [0] : [0, firstHop];
    return togo;
};

}());
