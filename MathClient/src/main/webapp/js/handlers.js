(function() {

org.weblogo.nodeHandlers = {};

org.weblogo.nodeHandlers.skip = function(node, program, compiler) {
    return compiler(node.value, "");
}
org.weblogo.nodeHandlers.statement = function(node, program, compiler) {
    node.value = compiler(node.value, "").value;
    if(node.type === "statement") {
        node.value += ";\n";
    }
    return program += node.value;
}
org.weblogo.nodeHandlers.value = function(node, program, compiler) {
    if(node.type === "string") {
        node.value = "\""+node.value+"\"";
    }
    return node;
}
org.weblogo.nodeHandlers.uminus = function(node, program, compiler) {
    node.value = -compiler(node.value, "").value;
    return node;
}
org.weblogo.nodeHandlers.power = function(node, program, compiler) {
    node.value = Math.pow(compiler(node.args[0], "").value, compiler(node.args[1],"").value);
    return node;
}
org.weblogo.nodeHandlers.group_op = function(node, program, compiler) {
    node.value = "("+compiler(node.args[0], "").value+")";
    return node;
}
org.weblogo.nodeHandlers.op = function(node, program, compiler) {
    node.value = "("+compiler(node.args[0], "").value+node.op+compiler(node.args[1], "").value+")";
    return node;
}

org.weblogo.nodeHandlers.list = function(node, program, compiler) {
    var params = node.value;
    var array = [];
    for (var j = 0; j < params.length; j++) {
        array[j] = compiler(params[j].value, "");
    }
    return array;
}
org.weblogo.nodeHandlers.expr = function(node, program, compiler) {
    return compiler(node.value, "");
}
org.weblogo.nodeHandlers.repeat_stmt = function(node, program, compiler) {
    var index = ++compiler.depth;
    var repeatN = compiler(node.args[0], "").value;
    node.value = "for (var index"+index+" = 0; index"+index+" < "+repeatN+"; ++index"+index+") ";
    node.value += compiler(node.args[1], "");
    return node;
}
org.weblogo.nodeHandlers.if_stmt = function(node, program, compiler) {
    node.value= "if ("+compiler(node.condition, "").value+") "+compiler(node.block, "");
    return node;
}
org.weblogo.nodeHandlers.block = function(node, program, compiler) {
    program += "{\n";
    for(var j = 0; j < node.value.length; ++j){
        program += compiler(node.value[j], "");
    }
    program += "}\n";
    return program;
}
org.weblogo.nodeHandlers.set_stmt = function(node, program, compiler) {
    //var prop = compiler(node.args[0], "").value.replace(/\"/g,""); // strip quotes
    //var val = compiler(node.args[1], "").replace(/\"/g, "\\\""); // escape quotes
    //var val = compiler(node.args[1], "").replace(/\"/g, ""); // strip quotes
    var prop = compiler(node.args[0], "").value;
    var val = compiler(node.args[1], "").value;
    var commandString = "\"+"+prop+"+\" \"+"+val+"+\"";

    node.value = "org.weblogo.outputStream.push(\"set "+commandString+"\");\n";
    return node;
}
org.weblogo.nodeHandlers.builtin = function(node, program, compiler) {
    node.value = "org.weblogo.outputStream.push(\""+node.id+"\");\n";
    return node;
}
org.weblogo.nodeHandlers.func = function(node, program, compiler) {
    var id = compiler(node.id, "").value;
    var arglist = compiler(node.args, "");
    if(!arglist.length) {
        arglist = [arglist];
    }

    // user defined function
    if(!org.weblogo.turtle.commands[id]) {
        node.value = id+"(";
        for(var i = 0; i < arglist.length; i++) {
            if(i == arglist.length-1) {
                node.value += arglist[i].value+")";
                break;
            }
            node.value += arglist[i].value+",";
        }
        return node;
    }
    // built in function
    else {
        var argString = "";
        for(var i = 0; i < arglist.length; i++) {
            argString += "\"+"+arglist[i].value+"+\" ";
        }

        //arglist = arglist.replace(","," ");
        if (argString === "") {
            argString = "\"\"";
        }

        node.value = "org.weblogo.outputStream.push(\""+id+" "+argString+"\");\n";
        return node;
    }
}
org.weblogo.nodeHandlers.fun_assign = function(node, program, compiler) {
    var localcount = compiler.localscope.length+1;
    var id = compiler(node.id, "").value;
    compiler.scope = compiler.scope.concat(compiler.localscope, id);
    compiler.localscope = [];

    var params = compiler(node.args,"");
    var paramString = "";


    for(var j = 0; j < params.length; j++) {
        compiler.localscope.push(params[j].value);
        if(j == params.length-1){
            paramString += params[j].value;
            break;
        }
        paramString += params[j].value+",";
    }

    var block = compiler(node.block, "");

    compiler.localscope = [];
    compiler.localscope = [compiler.scope.pop(localcount)];


    node.value = "var "+id+" = function("+paramString+")";
    node.value += block;
    return node;
}
org.weblogo.nodeHandlers.var_assign = function (node, program, compiler) {
    var defaultVal = compiler(node.value, "").value;
    var varName = "";
    var id = compiler(node.id, "").value;
    if(compiler.localscope.indexOf(id) == -1) {
        if(compiler.scope.indexOf(id) == -1) {
            varName = "var ";
            compiler.localscope.push(id);
        }
    }
    varName += id;

    node.value = varName+" = "+defaultVal;
    return node
}
org.weblogo.nodeHandlers.JSONObject = function(node, program, compiler) {
    output = {
        type: "string"
    };
    node.value = "org.weblogo.outputStream.push(\"print \\\"JSONObject not yet supported\\\"\");\n";
    return node;
}

}());
