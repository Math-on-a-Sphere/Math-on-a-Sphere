(function ($) {

    var geom = org.weblogo.geom;
    var P = Math.PI;
    var S = Math.sqrt(2) / 2;
  
    org.weblogo.tests = {};
    
    var turtleTests = new jqUnit.TestCase("Turtle Tests");

    var testUtil = org.weblogo.testUtil;
    
    org.weblogo.tests.mockConfig = function() {
        return {
            width: 1024,
            height: 512,
            turtles: [org.weblogo.turtle()],
        }  
    };
    
    var makeQSE = function(config) {
        var executor = org.weblogo.executor(config);
        var qse = org.weblogo.quickStringExecutor(executor, config);
        return qse;
    }
    
    turtleTests.test("motion tests", function () {
    
        var config = org.weblogo.tests.mockConfig();
        var executor = makeQSE(config);
        
        var turtle = config.turtles[0];
        turtle.drawing = false; // avoid hitting the canvas with rendering
        
        executor.execute("right 90");
        testUtil.assertClose("Turned right", [0, 0, 1], turtle.heading);
        
        executor.execute("forward 45");
        testUtil.assertClose("Moved eighth", [S, -S, 0], turtle.position);
        testUtil.assertClose("No change in heading", [0, 0, 1], turtle.heading);
        
        executor.execute("left 90");
        executor.execute("forward 90");
        testUtil.assertClose("Moved to north pole", [0, 0, 1], turtle.position);
        
        executor.execute("back 90");
        testUtil.assertClose("Back to equator", [S, -S, 0], turtle.position);
        
        executor.execute("left 270");
        executor.execute("forward 180");
        testUtil.assertClose("Opposite point", [-S, S, 0], turtle.position);
        
    });
    
    turtleTests.test("command tests", function () {
    
        var config = org.weblogo.tests.mockConfig();
        var executor = makeQSE(config);
        
        var turtle = config.turtles[0];
        
        var result = executor.execute("set color green");
        jqUnit.assertFalse("No command error", result);
        jqUnit.assertEquals("Turtle colour is set", "green", turtle.colour);
        
        var result2 = executor.execute("set colour green");
        jqUnit.assertTrue("Command error expected", result2.message); 
        jqUnit.assertEquals("Turtle colour unchanged", "green", turtle.colour);
        
        var result3 = executor.execute("set color bleen");
        jqUnit.assertTrue("Command error expected", result3.message); 
        jqUnit.assertEquals("Turtle colour unchanged", "green", turtle.colour);
        
        var result4 = executor.execute("set pen-size 4");
        jqUnit.assertFalse("No command error", result4);
        jqUnit.assertEquals("Pen size changed", 4, turtle.width);
        
        var result5 = executor.execute("set pen-size -33");
        jqUnit.assertTrue("Command error expected", result5.message); 
        jqUnit.assertEquals("Pen size unchanged", 4, turtle.width);
       
        var result6 = executor.execute("set color 120.5");
        jqUnit.assertFalse("No command error", result6);
        jqUnit.assertEquals("Turtle colour is set", 120.5, turtle.colour); 
    });
    
})();