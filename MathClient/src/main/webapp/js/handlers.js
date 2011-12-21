(function() {

org.weblogo.keywordHandlers = {};
org.weblogo.nodeHandlers = {};


org.weblogo.nodeHandlers.keyword = function(node, program, compiler) {
    return org.weblogo.keywordHandlers[node.command](node, program, compiler);
}


org.weblogo.nodeHandlers.list = function(node, program, compiler) {
    if (!node.args) { return program += "";}
    else {
        for (var j = 0; j < node.args.length-1; ++j) {
            program += compiler(node.args[j], "")+", ";
        }
        return program += compiler(node.args[node.args.length], "");
    }
}


org.weblogo.nodeHandlers.repeat = function(node, program, compiler) {
    ++org.weblogo.compilerdepth;
    var index = org.weblogo.compilerdepth;
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
    var val = compiler(node.args[1], "");
    if(node.args[1].type === 'identifier') {
        val = "\"+"+val+"+\"";
    }
    commandString += " "+compiler(node.args[0], "")+" "+val;
    program += "org.weblogo.outputStream.push(\""+commandString+"\");\n"
    return program;
}
org.weblogo.nodeHandlers.func = function(node, program, compiler) {
    var id = compiler(node.args[0], "");
    var arglist = compiler(node.args[1], "");

    if(!org.weblogo.turtle.commands[node.args[0].value]) {
        return program += id+"("+arglist+");\n";
    }
    else {
        return program += "org.weblogo.outputStream.push(\""+id+" "+arglist+"\");\n"        
    }
}
org.weblogo.nodeHandlers.fun_assign = function(node, program, compiler) {
    var params = "";
    if(node.args.length > 0){
        params = compiler(node.args, "");
    }
    var block = compiler(node.value, "");
    program += "org.weblogo.program.declared."+node.id+" = function("+params+")";
    program += block;
    return program;
}
org.weblogo.nodeHandlers.var_assign = function (node, program, compiler) {
    var defaultVal = compiler(node.value, "");
    if(node.value.type === "string") {
        return program += "org.weblogo.program.declared."+node.id+" = \""+defaultVal+"\";\n";
    }
    else {
        return program += "org.weblogo.program.declared."+node.id+" = "+defaultVal+";\n";
    }
}
org.weblogo.nodeHandlers.accessor = function(node, program, compiler) {
    program += node.value;
    return program;
}
org.weblogo.nodeHandlers.identifier = function(node, program, compiler) {
    if(!org.weblogo.turtle.commands[node.value]) {
        return program += "org.weblogo.program.declared."+node.value;
    }
    else {
        return program += node.value;
    }
}
org.weblogo.nodeHandlers.string = function(node, program, compiler) {
    program += node.value;
    return program;
}
org.weblogo.nodeHandlers.number = function(node, program, compiler) {
    program += node.value;
    return program;
}

}());
