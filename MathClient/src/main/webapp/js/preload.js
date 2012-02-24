(function() {

org.weblogo.preload = {};

var preload = org.weblogo.preload;

org.weblogo.preload.loadSelected = function(selected, myCodeMirror) {
    $.get(preload[selected], function(data) {
        myCodeMirror.setValue(data);
    }, "text");
};


var preload = {
    blank:  "lib/wbl/blank.wbl",
    basic_drawing: "lib/wbl/basic_drawing.wbl",
    change_color: "lib/wbl/change_color.wbl",
    triple_right_triangle: "lib/wbl/triple_right_triangle.wbl",
    function_null_call: "lib/wbl/function_null_call.wbl",
    function_parameter_call: "lib/wbl/function_parameter_call.wbl",
    function_parameters_call: "lib/wbl/function_parameters_call.wbl",
    icosahedron: "lib/wbl/icosahedron.wbl",
    triangle_size: "lib/wbl/triangle_size.wbl",
    soccer_ball: "lib/wbl/soccer_ball.wbl"
};

//*************** BLANK *****************


//***************** DRAWING *******************
// preload.basic_drawing = (<r><![CDATA[// This demonstrates how to use basic draw commands

// forward 10
// right 45
// forward 10
// left 45
// forward 10

// ]]></r>).toString();

// //***************** PROPERTIES *******************
// preload.change_color = (<r><![CDATA[// This demonstrates how to change color and pen size

// set color "blue"
// set pensize 20
// forward 360

// ]]></r>).toString();




// //***************** REPEAT *******************
// preload.triple_right_triangle = (<r><![CDATA[// This demonstrates how to use the repeat funtion.
// // This causes the turtle to move forward 90 steps, 
// // turn right 90 degrees, repeated three times.

// repeat 3 {
//   forward 90
//   right 90
// }

// ]]></r>).toString();


// //***************** FUNCTION *******************
// preload.function_null_call = (<r><![CDATA[// This demonstrates how to write and call a function
// // that has no parameters.

// tri = function [] {
//     repeat 3 {
//         forward 90
//         right 90
//     }
// } 

// tri()

// ]]></r>).toString();

// //***************** FUNCTION *******************
// preload.function_parameter_call = (<r><![CDATA[// This demonstrates how to write and call a function
// // that has a single parameter.

// tri = function [newcolor] {
//     set color newcolor
//     repeat 3 {
//         forward 90
//         right 90
//     }
// } 

// tri "green"

// ]]></r>).toString();

// //***************** FUNCTION *******************
// preload.function_parameters_call = (<r><![CDATA[// This demonstrates how to write and call a function
// // that has more than one parameter.

// tri = function [x,newcolor] {
//     set color newcolor
//     repeat 3 {
//         forward x
//         right x
//     }
// } 

// tri [90,"green"]

// ]]></r>).toString();


// //***************** DRAW TRIANGLE *****************
// preload.draw_triangle_size = (<r><![CDATA[

// tri = function [size] {
//     repeat 3 {
//         forward size
//         right (180 - size)
//     }
// } 

// tri 90

// ]]></r>).toString();


// //***************** ICOSAHEDRON *******************
// preload.icosahedron = (<r><![CDATA[// This program projects a 20-sided object onto a sphere 
// x = 63.5 
// theta = 108
// thetatwo = 72/2

// tri = function () { 
//   repeat 3 { forward x right theta }
// }

// penta = function () {
//   repeat 5 { tri() right 72 }
// }

// repeat 3 {
//   penta()
//   forward x  
//   right thetatwo
// }

// left 72
// forward x
// right thetatwo

// repeat 3 {
//   penta()
//   forward x
//   left thetatwo
// }

// ]]></r>).toString();

}());
