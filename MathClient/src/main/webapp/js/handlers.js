(function() {

org.weblogo.nodeHandlers = {};

org.weblogo.nodeHandlers.skip = function (node, program, compiler) {
    return compiler(node.value, "");
};

org.weblogo.nodeHandlers.statement = function (node, program, compiler) {
    node.value = compiler(node.value, "").value;
    if (node.type === "statement") {
        node.value += ";\n";
    } else {
        node.value += "\n";
    }
    return program += node.value;
};

org.weblogo.nodeHandlers.set_stmt = function (node, program, compiler) {
    //var prop = compiler(node.args[0], "").value.replace(/\"/g,""); // strip quotes
    //var val = compiler(node.args[1], "").replace(/\"/g, "\\\""); // escape quotes
    //var val = compiler(node.args[1], "").replace(/\"/g, ""); // strip quotes
    var prop = compiler(node.args[0], "").value;
    var val = compiler(node.args[1], "").value;
    // TODO: proper recognition of quoted values
    node.value = "org.weblogo.outputStream.push(\"set " + prop + " \"+" + val + ");\n";
    return program += node.value;
};

org.weblogo.nodeHandlers.value = function (node, program, compiler) {
    if (node.type === "string") {
        node.value = JSON.stringify(node.value);
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
    node.value = lh + "[" + index + "]"; 
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
    var index = ++org.weblogo.compilerdepth;
    var repeatN = compiler(node.args[0], "").value;
    node.value = "for (var index"+index+" = 0; index"+index+" < "+repeatN+"; ++index"+index+") ";
    node.value += compiler(node.args[1], "");
    return node;
};

org.weblogo.nodeHandlers.return_stmt = function (node, program, compiler) {
    node.value = "return " + compiler(node.arg).value;
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
    program += "}";
    return program;
};

org.weblogo.nodeHandlers.builtin = function (node, program, compiler) {
    node.value = "org.weblogo.invokeBuiltinFunction(\"" + node.id + "\")";
    return node;
};

org.weblogo.invokeBuiltinFunction = function (funcname, args) {
    var commandString = funcname + " " + fluid.makeArray(args).join(" ");
    org.weblogo.outputStream.push(commandString);
    var value = org.weblogo.program.executor.execute(commandString);
    if (value && value.type === "value") {
        return value.value;
    }
};

org.weblogo.compileArray = function (array, compiler) {
    return fluid.transform(array, function (arg) {
        return compiler(arg).value
    });
}

org.weblogo.nodeHandlers.func = function (node, program, compiler) {
    var funcname = compiler(node.id).value;
    var args = org.weblogo.compileArray(fluid.makeArray(node.args), compiler);
    if (org.weblogo.turtle.commands[funcname]) {
        // we undo one level of quoting here
        node.value = "org.weblogo.invokeBuiltinFunction(\"" + funcname + "\", " + args + ")";
    }
    else {
        node.value = funcname + "(" + args.join(", ") + ")";
    }
    return node;
};

org.weblogo.nodeHandlers.each = function (node, program, compiler) {
    var lvalue = compiler(node.id).value;
    var args = compiler(node.args).value;
    node.value = "fluid.each(" + lvalue + ", " + args + ")";
    return node;
};

org.weblogo.nodeHandlers.transform = function (node, program, compiler) {
    var lvalue = compiler(node.id).value;
    var args = compiler(node.args).value;
    node.value = "fluid.transform(" + lvalue + ", " + args + ")";
    return node;
};

org.weblogo.nodeHandlers.fun_assign = function (node, program, compiler) {
    var newscope = {};
    org.weblogo.program.scopes.unshift(newscope);
    
    var funcname = compiler(node.id).value;

    var params = org.weblogo.compileArray(node.args, compiler) 
    var paramString = params.join(", ");
    
    fluid.each(params, function (param) {
        newscope[param] = true;
    });

    var block = compiler(node.block, "");
    
    org.weblogo.program.scopes.shift();

    node.value = "var " + funcname + " = function("+paramString+")";
    node.value += block;
    return node;
};

org.weblogo.nodeHandlers.var_assign = function (node, program, compiler) {
    var rhs = compiler(node.value).value;
    var maybeVar = "";
    var isIdentifier = node.id.type === "identifier";
    var lhs = compiler(node.id).value;
    if (isIdentifier) {
        if (!fluid.find(org.weblogo.program.scopes, function (scope) {
            return scope[lhs];
        })) {
           maybeVar = "var ";
           org.weblogo.program.scopes[0][lhs] = true;
        }
    }

    node.value = maybeVar + lhs + " = " + rhs;
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
