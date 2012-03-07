(function() {

org.weblogo.preload = {};

var preload = org.weblogo.preload;

org.weblogo.preload.loadSelected = function(selected, myCodeMirror) {
    $.get(preload[selected], function(data) {
        myCodeMirror.setValue(data);
        myCodeMirror.clearHistory();
    }, "text");
};


var preload = {
    blank:  "lib/wbl/blank.wbl",
    my_design: null,
    testscope: "lib/wbl/test_scope.wbl",
    basic_drawing: "lib/wbl/basic_drawing.wbl",
    change_color: "lib/wbl/change_color.wbl",
    triple_right_triangle: "lib/wbl/triple_right_triangle.wbl",
    function_null_call: "lib/wbl/function_null_call.wbl",
    function_parameter_call: "lib/wbl/function_parameter_call.wbl",
    function_parameters_call: "lib/wbl/function_parameters_call.wbl",
    icosahedron: "lib/wbl/icosahedron.wbl",
    soccer_ball: "lib/wbl/soccer_ball.wbl",
    fast_icosido: "lib/wbl/fast_icosido.wbl",
    triangle_size: "lib/wbl/triangle_size.wbl",
    starburst: "lib/wbl/starburst.wbl",
    dragon_curve: "lib/wbl/dragon_curve.wbl",
    michelles: "lib/wbl/michelles_triangles.wbl",
};

}());
