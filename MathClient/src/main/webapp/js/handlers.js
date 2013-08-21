(function() {

org.weblogo.nodeHandlers = {};

org.weblogo.nodeHandlers.skip = function (node, program, compiler) {
    return compiler(node.value, "");
};

org.weblogo.nodeHandlers.statement = function (node, program, compiler) {
    node.value = compiler(node.value, "").value;
    if (node.type === "statement") {
        node.value += ";\n";
    }
    return program += node.value;
};

org.weblogo.nodeHandlers.value = function (node, program, compiler) {
    if (node.type === "string") {
        node.value = "\""+node.value+"\"";
    }
    return node;
};

org.weblogo.nodeHandlers.uminus = function (node, program, compiler) {
    node.value = -compiler(node.value, "").value;
    return node;
};

org.weblogo.nodeHandlers.power = function (node, program, compiler) {
    node.value = Math.pow(compiler(node.args[0], "").value, compiler(node.args[1],"").value);
    return node;
};

org.weblogo.nodeHandlers.group_op = function (node, program, compiler) {
    node.value = "(" + compiler(node.args[0], "").value + ")";
    return node;
};

org.weblogo.nodeHandlers.op = function (node, program, compiler) {
    node.value = "(" + compiler(node.args[0], "").value + node.op + compiler(node.args[1], "").value + ")";
    return node;
};

org.weblogo.nodeHandlers.index_op = function (node, program, compiler) {
    var index = compiler(node.args[1]).value;
    var lh = compiler(node.args[0]).value;
    node.value = lh + "[" + (typeof(index) === "number" ? index : "\"" + index + "\"" ) + "]"; 
    return node;
};


org.weblogo.nodeHandlers.list = function (node, program, compiler) {
    var params = node.value;
    var array = [];
    for (var j = 0; j < params.length; j++) {
        array[j] = compiler(params[j]).value;
    }
    node.value = "[" + array.join(", ") + "]";
    return node;
};

org.weblogo.nodeHandlers.expr = function (node, program, compiler) {
    return compiler(node.value, "");
};

org.weblogo.nodeHandlers.repeat_stmt = function (node, program, compiler) {
    var index = ++compiler.depth;
    var repeatN = compiler(node.args[0], "").value;
    node.value = "for (var index"+index+" = 0; index"+index+" < "+repeatN+"; ++index"+index+") ";
    node.value += compiler(node.args[1], "");
    return node;
};

org.weblogo.nodeHandlers.if_stmt = function (node, program, compiler) {
    node.value= "if (" + compiler(node.condition, "").value + ") " + compiler(node.block, "");
    return node;
};

org.weblogo.nodeHandlers.ifelse_stmt = function (node, program, compiler) {
    node.value= "if (" + compiler(node.condition, "").value + ") " + compiler(node.block[0], "");
    node.value += "else "+ compiler(node.block[1], "");
    return node;
};

org.weblogo.nodeHandlers.block = function (node, program, compiler) {
    program += "{\n";
    for(var j = 0; j < node.value.length; ++j){
        program += compiler(node.value[j], "");
    }
    program += "}\n";
    return program;
};

org.weblogo.nodeHandlers.set_stmt = function (node, program, compiler) {
    //var prop = compiler(node.args[0], "").value.replace(/\"/g,""); // strip quotes
    //var val = compiler(node.args[1], "").replace(/\"/g, "\\\""); // escape quotes
    //var val = compiler(node.args[1], "").replace(/\"/g, ""); // strip quotes
    var prop = compiler(node.args[0], "").value;
    var val = compiler(node.args[1], "").value;
    // TODO: proper recognition of quoted values
    node.value = "org.weblogo.outputStream.push(\"set " + prop + " \"+" + val + ");\n";
    return node;
};

org.weblogo.nodeHandlers.builtin = function (node, program, compiler) {
    node.value = "org.weblogo.outputStream.push(\"" + node.id + "\");\n";
    return node;
};

org.weblogo.invokeFunction = function (funcname, args) {
    org.weblogo.outputStream.push(funcname + " " + args.join(" "));
};

org.weblogo.nodeHandlers.func = function (node, program, compiler) {
    var funcname = compiler(node.id).value;
    var arglist = compiler(node.args).value;
    var args = fluid.makeArray(arglist);
    if (org.weblogo.turtle.commands[funcname]) {
        // we undo one level of quoting here
        node.value = "org.weblogo.invokeFunction(\"" + funcname + "\", [" + args.join(", ") + "]);\n";
    }
    else {
        node.value = funcname + "(" + args.join(", ") + ")";
    }
    return node;
};

org.weblogo.nodeHandlers.fun_assign = function (node, program, compiler) {
    var newscope = {};
    compiler.scopes.unshift(newscope);
    
    var funcname = compiler(node.id).value;

    var args = node.args;
    var params = fluid.transform(args, function (arg) {
        return compiler(arg).value
    });
    var paramString = params.join(", ");
    
    fluid.each(params, function (param) {
        newscope[param] = true;
    });

    var block = compiler(node.block, "");
    
    compiler.scopes.shift();

    node.value = "var " + funcname + " = function("+paramString+")";
    node.value += block;
    return node;
};

org.weblogo.nodeHandlers.var_assign = function (node, program, compiler) {
    var defaultVal = compiler(node.value).value;
    var varName = "";
    var id = compiler(node.id).value;
    if (!fluid.find(compiler.scopes, function (scope) {
        return scope[id];
    })) {
       varName = "var ";
       compiler.scopes[0][id] = true;
    }
    varName += id;

    node.value = varName + " = " + defaultVal;
    return node;
};

org.weblogo.nodeHandlers.JSONObject = function (node, program, compiler) {
    var values = fluid.transform(node.value, function (element) {
        var ck = compiler(element.key);
        var cv = compiler(element.value);
        return ck.value + " : " + cv.value;
    });
    node.value = "{" + values.join(", ") + "}";;
    return node;
};


}());
