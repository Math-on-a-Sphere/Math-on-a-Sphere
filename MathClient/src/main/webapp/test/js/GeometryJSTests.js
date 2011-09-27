(function ($) {

    var geom = org.weblogo.geom;
  
    org.weblogo.tests = {};
    
    var quaternionTests = new jqUnit.TestCase("Quaternion Tests");


    var testUtil = org.weblogo.testUtil;
        
    quaternionTests.test("arithmetic", function () {
      
        var one = [1, 0, 0, 0]; var m_one = [-1,  0,  0,  0]; 
        var i =   [0, 1, 0, 0]; var m_i   = [ 0, -1,  0,  0];
        var j =   [0, 0, 1, 0]; var m_j   = [ 0,  0, -1,  0];
        var k =   [0, 0, 0, 1]; var m_k   = [ 0,  0,  0, -1];
        
        var tableIndex = [one, i, j, k];
        var multTable = [
            [one, i, j, k],
            [i, m_one, k, m_j],
            [j, m_k, m_one, i],
            [k, j, m_i, m_one]];
            
        jqUnit.expect(16);    
            
        for (var a = 0; a < 4; ++ a) {
            for (var b = 0; b < 4; ++ b) {
            var a_i = tableIndex[a], b_i = tableIndex[b];
            var product = geom.quat_mult(a_i, b_i);
            var expected = multTable[a][b];
            jqUnit.assertDeepEq("Multiplication of units: " + JSON.stringify(a_i) + " with " 
               + JSON.stringify(b_i), expected, product);
            }
        }
    });
    
    quaternionTests.test("rotation", function() {
        var equator = geom.polar_to_3(0, 0);
        var pole = geom.polar_to_3(Math.PI / 2, 0);
        var axis = geom.axis_from_heading(equator, pole);
        // Make the versor to move the equator towards the pole by PI/4
        var versor = geom.versor_from_parts(axis, Math.PI/4);
        var rotated = geom.quat_conj(versor, equator);
        
        var expected = geom.polar_to_3(Math.PI / 4, 0);
        testUtil.assertClose3("Correct result for rotation pi/4 from equator towards pole",
           expected, rotated);
        
    });
    
    function assertInLine(message, axis, points) {
        for (var i = 0; i < points.length; ++ i) {
            testUtil.assertClose(message + " point " + i, 
                0, geom.dot_3(axis, points[i]));
        }
    }
    
    quaternionTests.test("polygon conversion", function() {
        var step = Math.PI/12;
        var width = Math.PI/10;
        var options = {
            width: width,
            heading: [-1, 0, 0] // heading towards the pole
        };
        var start = [0, -1, 0]; // equator zero meridian
        var versor = geom.versor_from_parts(options.heading, step);
        var end = geom.quat_conj(versor, start);
        var structure = geom.polygon_line_elem(start, end, versor, options);
        var c = structure.corners;
        var e = structure.edges;
        
        var Cstep = Math.cos(step);
        var Cwidth = Math.cos(width);
        
        testUtil.assertClose("Edge 0 to edge 2", -Cwidth, 
           geom.dot_3(e[0], e[2]));
        testUtil.assertClose("Edge 1 to edge 3", -Cstep,
           geom.dot_3(e[1], e[3]));
        
        var tolerance = Math.cos(Math.PI/6);
        
        c[4] = start; c[5] = end;
        
        // Arrangement:    1 2
        //                 0 3
        for (var i = 0; i < 6; ++ i) {
            for (var j = i + 1; j < 6; ++ j) {
                var angle = geom.dot_3(c[i], c[j]);
                jqUnit.assertTrue("Point " + i + " to " + j + " in same orientation " + angle,
                   angle > tolerance);
            }
        }
        
        assertInLine("Starting corners on edge 3", 
            e[3], [c[0], start, c[3]]);
        assertInLine("Ending corners on edge 1",
            e[1], [c[1], end, c[2]]);
        assertInLine("Left corners on edge 0",
            e[0], [c[0], c[1]]);
        assertInLine("Right corners on edge 2",
            e[2], [c[2], c[3]]);
    });
    
    quaternionTests.test("polygon x-wrapping", function() {
        var points = [[70, 0], [80, 0], [10, 0], [80,0]];
        var closed = geom.closification(points, 100);
        var expected = {
            points: [[70, 0], [80, 0], [110, 0], [80, 0]],
            wrap_x: [0, -100]
        };
        jqUnit.assertDeepEq("Closed positive polygon", expected, closed);
        
        var points2 = [[10, 0], [80, 0], [90, 0], [80,0]];
        var closed2 = geom.closification(points2, 100);
        var expected2 = {
            points: [[10, 0], [-20, 0], [-10, 0], [-20, 0]],
            wrap_x: [0, 100]
        };
        jqUnit.assertDeepEq("Closed negative polygon", expected2, closed2);
        
        var points3 = [[90, 0], [10, 0]];
        var closed3 = geom.closification(points3, 100);
        var expected3 = {
            points: [[90, 0], [110, 0]],
            wrap_x: [0, -100]
        };
        jqUnit.assertDeepEq("Closed positive line", expected3, closed3);
        
    });
    
})();