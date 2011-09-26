var org = org || {};
org.weblogo = {
    geom: {}
};

(function() {

var geom = org.weblogo.geom;

org.weblogo.geom.mult_33 = function(m, v) {
    return [
       m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] + v[2],
       m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] + v[2],
       m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] + v[2],
    ];
};

org.weblogo.geom.add_3 = function(a, b) {
    return [ a[0] + b[0], a[1] + b[1], a[2] + b[2]];
};

org.weblogo.geom.dot_3 = function(a, b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];  
};

org.weblogo.geom.dist_3 = function(a, b) {
    var diff = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    return geom.dot_3(diff, diff); 
}

/** Converts a unit 3-d vector into a unit quaternion by prepending 0 as the real part **/

org.weblogo.geom.quat_from_3 = function(n) {
    return [0, n[0], n[1], n[2]];
};

/** Convert spherical polar coordinates to 3-dimensional unit vector representing
 * position on sphere surface
 * @param theta Inclination from equator in degrees (north pole is +pi/2)
 * @param phi Azimuth measured anticlockwise as seen from north pole (in the range -pi to pi) - 
 * a "Greenwichian" system with the 0 degree azimuth at (0, -1)
 */

org.weblogo.geom.polar_to_3 = function(theta, phi) {
    return [Math.cos(theta) * Math.sin(phi), 
            -Math.cos(theta) * Math.cos(phi),
             Math.sin(theta)];
};
/** Convert a 3-dimensional unit vector back into spherical polars, inverting polar_to_3 
 * @return [theta, phi]
 */
org.weblogo.geom.polar_from_3 = function(n) {
    return [Math.asin(n[2]), Math.atan2(n[0], -n[1])];
};

/** Convert standard spherical polar coordinates to quaternion unit vector
 * representing position
 * @param theta Inclination from equator in degrees (north pole is +pi/2)
 * @param phi Azimuth measured anticlockwise as seen from north pole (in the range -pi to pi)
 */

org.weblogo.geom.polar_to_quat = function(theta, phi) {
    var three = geom.polar_to_3(theta, phi);
    return geom.quat_from_3(three);
};

/** Multiply two quaternions together - compute the product pq */
org.weblogo.geom.quat_mult = function(p, q) {
    return [
        p[0]*q[0] - p[1]*q[1] - p[2]*q[2] - p[3]*q[3],
        p[0]*q[1] + p[1]*q[0] + p[2]*q[3] - p[3]*q[2],
        p[0]*q[2] - p[1]*q[3] + p[2]*q[0] + p[3]*q[1],
        p[0]*q[3] + p[1]*q[2] - p[2]*q[1] + p[3]*q[0] 
    ]
};

/** Inverts a quaternion, assuming it to be a unit (actually returns its conjugate) */
org.weblogo.geom.quat_inv = function(v) {
    return [v[0], -v[1], -v[2], -v[3]];
}

/** Conjugates one quaternion by another, computing the product q v q^{-1} - this
 * has the effect of rotating the vector represented by v by the "versor" represented by
 * q. This currently uses the very slow method of multiplying 3 quaternions - it could be
 * upgraded to a much more efficient method where the real part of v is assumed to be zero. 
 * This would use the efficient 30-operation expression 
 * v + 2q x (q x v + wv) described at http://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation 
 * and in slightly more detail at https://mollyrocket.com/forums/viewtopic.php?p=6154 */
 
org.weblogo.geom.quat_conj = function(q, v) {
    var inv = geom.quat_inv(q);
    var two = geom.quat_mult(q, geom.quat_from_3(v));
    var result = geom.quat_mult(two, inv);
    return [result[1], result[2], result[3]]; 
};

/** Recovers the 3-vector unit normal required to rotate the 3-d unit vector p0 
 * into the 3-d unit vector p1 along unit sphere great circle */

org.weblogo.geom.axis_from_heading = function(p0_3, p1_3) {
    var p0 = geom.quat_from_3(p0_3), p1 = geom.quat_from_3(p1_3);
    var q = geom.quat_mult(p1, geom.quat_inv(p0));
    var sinW = Math.sqrt(1 - q[0] * q[0]);
    return [q[1] / sinW, q[2] / sinW, q[3] / sinW]; 
};

/** Given an axis and angle, construct the versor quaternion value which will act as a rotation
 * by that angle about the axis 
 * @param n The 3-d unit normal vector forming the axis for the rotation
 * @param W The rotation angle, measured in radians 
 */ 

org.weblogo.geom.versor_from_parts = function(n, W) {
    var sinW = Math.sin(W / 2);
    return [Math.cos(W / 2), sinW * n[0], sinW * n[1], sinW * n[2]]; 
};

/** Converts a unit vector in 3d into "ECE" coordinates in pixels, given
 * rectangular width and height */

org.weblogo.geom.pixel_from_3 = function(n, width, height) {
    var polar = geom.polar_from_3(n);
    return [width *  (polar[1] + Math.PI) / (2 * Math.PI),
             height * (Math.PI/2 - polar[0]) / Math.PI];
};


}());