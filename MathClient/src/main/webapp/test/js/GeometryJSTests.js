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
        testUtil.assertClose("Correct result for rotation pi/4 from equator towards pole",
           expected, rotated);
        
    });
    
})();