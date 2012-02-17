(function() {

org.weblogo.preload = {};

var preload = org.weblogo.preload;




//*************** BLANK *****************
preload.blank =  (<r><![CDATA[




]]></r>).toString();


//***************** DRAWING *******************
preload.basic_drawing = (<r><![CDATA[// This demonstrates how to use basic draw commands

forward 10
right 45
forward 10
left 45
forward 10

]]></r>).toString();

//***************** PROPERTIES *******************
preload.change_color = (<r><![CDATA[// This demonstrates how to change color and pen size

set color "blue"
set pensize 20
forward 360

]]></r>).toString();




//***************** REPEAT *******************
preload.triple_right_triangle = (<r><![CDATA[// This demonstrates how to use the repeat funtion.
// This causes the turtle to move forward 90 steps, 
// turn right 90 degrees, repeated three times.

repeat 3 {
  forward 90
  right 90
}

]]></r>).toString();


//***************** FUNCTION *******************
preload.function_null_call = (<r><![CDATA[// This demonstrates how to write and call a function
// that has no parameters.

tri = function [] {
    repeat 3 {
        forward 90
        right 90
    }
} 

tri()

]]></r>).toString();

//***************** FUNCTION *******************
preload.function_parameter_call = (<r><![CDATA[// This demonstrates how to write and call a function
// that has a single parameter.

tri = function [newcolor] {
    set color newcolor
    repeat 3 {
        forward 90
        right 90
    }
} 

tri "green"

]]></r>).toString();

//***************** FUNCTION *******************
preload.function_parameters_call = (<r><![CDATA[// This demonstrates how to write and call a function
// that has more than one parameter.

tri = function [x,newcolor] {
    set color newcolor
    repeat 3 {
        forward x
        right x
    }
} 

tri [90,"green"]

]]></r>).toString();

//***************** ICOSAHEDRON *******************
preload.icosahedron = (<r><![CDATA[// This program projects a 20-sided object onto a sphere 
x = 63.5 
theta = 108
thetatwo = 72/2

tri = function () { 
  repeat 3 { forward x right theta }
}

penta = function () {
  repeat 5 { tri() right 72 }
}

repeat 3 {
  penta()
  forward x  
  right thetatwo
}

left 72
forward x
right thetatwo

repeat 3 {
  penta()
  forward x
  left thetatwo
}

]]></r>).toString();

}());
