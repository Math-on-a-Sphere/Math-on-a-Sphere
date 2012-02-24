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
    soccer_ball: "lib/wbl/soccer_ball.wbl",
    starburst: "lib/wbl/starburst.wbl"
};

}());
