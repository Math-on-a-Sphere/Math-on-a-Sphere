(function ($) {

    var geom = org.weblogo.geom;

    org.weblogo.testUtil = {};
        
    org.weblogo.testUtil.assertClose3 = function(message, expected, actual) {
        var distance = geom.dist_3(expected, actual);
        jqUnit.assertTrue(message + " " + JSON.stringify(expected) +
          " to " + JSON.stringify(actual) + ": distance " + distance, distance < 1e-12);
    };
    
    org.weblogo.testUtil.assertClose = function(message, expected, actual) {
        var distance = Math.abs(expected - actual);
        jqUnit.assertTrue(message + " " + JSON.stringify(expected) +
          " to " + JSON.stringify(actual) + ": distance " + distance, distance < 1e-6);
    };
        
})();