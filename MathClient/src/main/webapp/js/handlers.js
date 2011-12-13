(function() {

org.weblogo.keywordHandlers = {};
org.weblogo.nodeHandlers = {};

org.weblogo.keywordHandlers.repeat = function(node, program, compiler) {
    ++org.weblogo.compilerdepth;
    var index = org.weblogo.compilerdepth;
    var repeatN = compiler([node.args[0]], "");
    program += "for (var index"+index+" = 0; index"+index+" < "+repeatN+"; ++index"+index+") {\n";
    program += compiler(node.args[1], "") + "}\n";
    return program;
}

org.weblogo.nodeHandlers.keyword = function(node, program, compiler) {
    return org.weblogo.keywordHandlers[node.command](node, program, compiler);
}

org.weblogo.nodeHandlers.command = function(node, program, compiler) {
    var commandString = node.command;
    for (var j = 0; j < node.args.length; ++j) {
        var arg = node.args[j];
        if(arg.type === "identifier") {
            commandString += " \"+" + compiler([arg],"")+"+\"";
        }
        else if(arg.type === "string") {
            commandString += " " + compiler([arg],"").replace(/\"/g,"");
        }
        else {
            commandString += " " + compiler([arg],"");
        }
    }

    program += "org.weblogo.outputStream.push(\""+commandString+"\");\n"
    return program;
}

org.weblogo.nodeHandlers.list = function(node, program, compiler) {
    if (!node.args) { program += "";}
    else {
        for (var j = 0; j < node.args.length-1; ++j) {
            program += compiler(node.args[j], "")+", ";
        }
        program += compiler(node.args[node.args.length], "");
    }
}

org.weblogo.nodeHandlers.functioncall = function(node, program, compiler) {
    var argumentlist = compiler(node.args[0], "");
    program += "org.weblogo.program.declared."+node.value+"("+argumentlist+");";
}

org.weblogo.nodeHandlers.userfunction = function(node, program, compiler) {
    var params = compiler(node.args[1], "");
    var block = compiler(node.args[2], "");
    program += "org.weblogo.program.declared."+node.args[0]+" = function("+params+") {\n";
    program += block + "}\n";
    return program;
}

org.weblogo.nodeHandlers.assign = function(node, program, compiler) {
    var defaultVal = compiler([node.args[1]], "");
    if(node.args[1].type === "string") {
        return program += "org.weblogo.program.declared."+node.args[0]+" = \""+defaultVal+"\";\n";
    }
    else {
        return program += "org.weblogo.program.declared."+node.args[0]+" = "+defaultVal+";\n";
    }
}
org.weblogo.nodeHandlers.identifier = function(node, program, compiler) {
    
    program += "org.weblogo.program.declared."+node.value;
    return program;
}
org.weblogo.nodeHandlers.accessor = function(node, program, compiler) {
    program += node.value;
    return program;
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
