(function() {

org.weblogo.keywordHandlers = {};
org.weblogo.nodeHandlers = {};


org.weblogo.nodeHandlers.keyword = function(node, program, compiler) {
    return org.weblogo.keywordHandlers[node.command](node, program, compiler);
}


org.weblogo.nodeHandlers.list = function(node, program, compiler) {
    if (node.value.length == 0) { return program += "";}
    else {
        for (var j = 0; j < node.value.length-1; ++j) {
            program += compiler(node.value[j], "")+", ";
        }
        return program += compiler(node.value[j], "");
    }
}
org.weblogo.nodeHandlers.repeat = function(node, program, compiler) {
    var index = ++compiler.depth;
    var repeatN = compiler(node.args[0], "");
    program += "for (var index"+index+" = 0; index"+index+" < "+repeatN+"; ++index"+index+") ";
    program += compiler(node.args[1], "");
    return program;
}
org.weblogo.nodeHandlers.block = function(node, program, compiler) {
    program += "{\n";
    for(var j = 0; j < node.value.length; ++j){
        program += compiler(node.value[j], "");
    }
    program += "}\n";
    return program;
}
org.weblogo.nodeHandlers.set = function(node, program, compiler) {
    var commandString = "set";
    compiler.escapeQuote = true;
    var val = compiler(node.args[1], "");
    commandString += " "+compiler(node.args[0], "")+" "+val;
    program += "org.weblogo.outputStream.push(\""+commandString+"\");\n"
    compiler.escapeQuote = false;
    return program;
}
org.weblogo.nodeHandlers.func = function(node, program, compiler) {

    var id = compiler(node.id, "");

    if(!org.weblogo.turtle.commands[node.id.value]) {
        compiler.addQuote = true;
        program += id+"("+compiler(node.args, "")+");\n";
        compiler.addQuote = false;
        return program;
    }
    else {
        compiler.escapeQuote = true;
        var arglist = compiler(node.args, "");
        compiler.escapeQuote = false;
        return program += "org.weblogo.outputStream.push(\""+id+" "+arglist+"\");\n"        
    }
}
org.weblogo.nodeHandlers.fun_assign = function(node, program, compiler) {
    var previousParent = compiler.parent;
    compiler.parent = "function"
    compiler.scope.push(node.id);
    var params = "";

    params = compiler(node.args,"");
    for(var j = 0; j < node.args.value.length; j++) {
        if(node.args.value[j].type === "identifier") {
            compiler.scope.push(node.args.value[j].value);
        }
    }
    

    compiler.parent = "function";
    var block = compiler(node.block, "");

    if(node.args.value.length > 0){
        for(var j = 0; j < node.args.value.length; j++) {
            if(node.args.value[j].type === "identifier") {
                compiler.scope.pop();
            }
        }
    }
    compiler.parent = previousParent;
    program += "org.weblogo.program.declared."+node.id+" = function("+params+")";
    program += block;
    return program;
}
org.weblogo.nodeHandlers.var_assign = function (node, program, compiler) {
    var defaultVal = compiler(node.value, "");
    var varName = "";

    if(compiler.scope[node.id] === undefined) {
        if(compiler.parent === "function") {
            varName = "var ";
        }
        else {
            varName = "org.weblogo.program.declared.";
        }
        compiler.scope.push(node.id);
    }
    varName += node.id;

    // handle quotation for a string literal assignment
    if(node.value.type === "string") {
        return program += varName+" = \""+defaultVal+"\";\n";
    }
    else {
        return program += varName+" = "+defaultVal+";\n";
    }
}
org.weblogo.nodeHandlers.accessor = function(node, program, compiler) {
    program += node.value;
    return program;
}
org.weblogo.nodeHandlers.identifier = function(node, program, compiler) {    
    if(!org.weblogo.turtle.commands[node.value] &&
       compiler.parent === "global") {
            program += "org.weblogo.program.declared."+node.value;
    }
    else {
        program += node.value;
    }
    if(compiler.escapeQuote) {
        program = "\"+"+program+"+\"";
    }
    return program;
}
org.weblogo.nodeHandlers.string = function(node, program, compiler) {
    if(compiler.addQuote) {
        return program += "\""+node.value+"\"";
    }
    return program += node.value;
}
org.weblogo.nodeHandlers.number = function(node, program, compiler) {
    program += node.value;
    return program;
}

}());
