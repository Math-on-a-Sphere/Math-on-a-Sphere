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
                if (execution && execution.type === "error") {
                    return execution;
                }
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
        var finished;
        try {
            var finished = that.execution.toTick(now);
            events.draw();
        }
        catch (e) {
            finished = true;
            events.error({message: "Error during rendering: " + e});
        }
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
            if (that.execution && that.execution.type === "error") {
                events.error(that.execution);
                delete that.execution;
            }
            else {
                events.commandStart(that.execution);
                if (that.execution && that.execution.toTick) {
                    that.intervalID = window.setInterval(that.tick, tickInterval);
                }
                else {
                    events.draw(that.execution);
                    that.stop();
                }
            }
        }
        return that.execution;
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


org.weblogo.parseToType = function(value, type) {
  // The only types we support right now are "number" and "number|string"
  // This ridiculous junk will be cleared away when we have JISON
    var typeList = type.split("|");
    var togo, failure;
    var parsed = false;
    for (var i = 0; i < typeList.length; ++ i) {
        var type = typeList[i];
        if (type === "number") {
            var togo = parseFloat(value);
            if (isNaN(togo)) {
                failure = "Could not parse " + value + " as a number";
            }
            else {
                parsed = true;
            }
        }
        else if (type === "string") {
            if (!parsed) {
                togo = value;
                failure = null;
            }
        }
    }
    return failure? {type: "error", message: failure} : togo;
};

/** Parser for the "stub language" which operates simple commands in a flat list **/

org.weblogo.stubParser = function(commandString) {
    var tokens = commandString.match(/\S+|"[^"]+"/g);
    var command = tokens[0];
    var cs = org.weblogo.turtle.commands;
    var record = cs[command];
    if (!record) {
        return {
            type: "error",
            message: "command " + command + " not recognized: you can use " + 
                fluid.keys(cs).sort().join(", ")
        };
    }
    if (tokens.length != record.args.length + 1) {
        return {
            type: "error",
            message: "incorrect number of args for command " + command + " - " + record.args.length + " expected"
        }  
    }
    var args = [];
    var togo = {
        type: "command",
    }
    for (var i = 0; i < record.args.length; ++ i) {
        var parseType = record.args[i];
        var parsed = org.weblogo.parseToType(tokens[i + 1], parseType);
        if (parsed.type === "error") {
            return parsed;
        }
        else {
            args[i] = parsed;
        }
    }
    togo.command = record.apply(null, args);
    return togo;
};

}());
