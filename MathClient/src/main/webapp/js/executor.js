(function() {

org.weblogo.executor = function(config) {
    var that = {};
    
    that.execute = function(command, tick) {
        var executor = org.weblogo.executors[command.type];
        return executor(config, command, tick);
    };
    
    return that;
};

org.weblogo.quickStringExecutor = function(executor) {
    return {
        execute: function(commandString) {
            var parsed = org.weblogo.stubParser(commandString);
            if (parsed.type === "error") {
                return parsed;
            }
            else {
                var execution = executor.execute(parsed.command, 0);
                if (execution && execution.toTick) {
                    execution.toTick(1e8);
                }
            }
        }
    };
};

org.weblogo.renderingExecutor = function(executor, events, tickInterval) {
    var that = {};
    
    that.tick = function() {
        var now = Date.now();
        var finished = that.execution.toTick(now);
        events.draw();
        if (finished) {
            that.stop();
        }
    };
      
    that.execute = function(commandString) {
        var parsed = org.weblogo.stubParser(commandString);
        if (parsed.type === "error") {
            events.error(parsed);
        }
        else {
            that.execution = executor.execute(parsed.command, Date.now());
            events.commandStart(that.execution);
            if (that.execution && that.execution.toTick) {
                that.intervalID = window.setInterval(that.tick, tickInterval);
            }
            else {
                events.draw(that.execution);
                that.stop();
           }
        }  
    };
    that.stop = function() {        
        events.commandDone(that.execution);
        delete that.execution;
        if (that.intervalID) {
            window.clearInterval(that.intervalID);
            delete that.intervalID;
        }
    };
    return that;
};


/** Parser for the "stub language" which operates simple commands in a flat list **/

org.weblogo.stubParser = function(commandString) {
    var tokens = commandString.match(/\w+|"[^"]+"/g);
    var command = tokens[0];
    var record = org.weblogo.turtle.commands[command];
    if (!record) {
        return {
            type: "error",
            message: "command " + command + " not recognized"
        };
    }
    if (tokens.length != record.arguments.length + 1) {
        return {
            type: "error",
            message: "too many arguments for command " + command + " - " + record.arguments.length + " expected"
        }  
    }
    var args = [];
    var togo = {
        type: "command",
    }
    for (var i = 0; i < record.arguments.length; ++ i) {
        var parseType = record.arguments[i];
        if (parseType === "number") { // others someday!
            args[i] = parseFloat(tokens[i + 1]);
        }
    }
    togo.command = record.apply(null, args);
    return togo;
};

}());