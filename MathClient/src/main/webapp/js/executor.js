(function () {

org.weblogo.executor = function (config) {
    var that = {};
    
    that.execute = function (command, tick) {
        var executor = typeof(command) === "function" ? command: org.weblogo.executors[command.type];
        return executor(config, command, tick);
    };
    
    return that;
};

org.weblogo.nullExecutor = {
    execute: function (commandString) {
        return null;
    }  
};

org.weblogo.quickStringExecutor = function (executor) {
    return {
        execute: function (commandString) {
            var parsed = org.weblogo.stubParser(commandString);
            if (parsed.type === "error") {
                return parsed;
            }
            else {
                var execution = executor.execute(parsed.command, 0);
                if (execution && (execution.type === "error" || execution.type === "value")) {
                    return execution;
                }
                if (execution && execution.toTick) {
                    execution.toTick(1e8);
                }
            }
        }
    };
};

org.weblogo.renderValue = function (value) {
    if (typeof(value) === "number") {
        return value.toFixed(6);
    } else if (fluid.isPrimitive(value)) {
        return JSON.stringify(value);
    } else if (fluid.isArrayable(value)) {
        var values = fluid.transform(value, org.weblogo.renderValue);
        return "[" + values.join(", ") + "]";
    } else {
        var values = [];
        var values = fluid.transform(value, function (value, key) {
            values.push(key + ": " + org.weblogo.renderValue(value));
        });
        return "{" + values.join(",\n") + "}";
    }
}

org.weblogo.blockExecutor = function (commands, terminal) {
    return function (config, command, tick) {
        var executor = org.weblogo.executor(config);
        function quickExec(commandString) {
            var parsed = org.weblogo.stubParser(commandString);
            if (parsed && parsed.type === "error") {
                return parsed;
            }
            var now = Date.now();
            execution = executor.execute(parsed.command, now);
            return execution;
        }
    
        var index = 0;
        var execution;
        function hopalong() {
            var messages = [];
            while (!execution && index < commands.length) {
                execution = quickExec(commands[index]);
                if (execution) {
                    if (execution.type === "value") {
                        execution = terminal ? {type: "info", message: org.weblogo.renderValue(execution.value)} 
                            : {toTick: function () { return true; }};
                    }
                    if (execution.type === "info") {
                        config.events.onInfo.fire(execution);
                        if (!terminal) {
                            messages.push(execution);
                        }
                        execution = null;
                    }
                    else if (execution.type === "error") {
                        config.events.onError.fire(execution);
                        execution = null;
                    }
                }
                ++index;
            }
            return messages;
        }
        var messages = hopalong();
        var that = {};
        that.messages = messages;
        that.toTick = function (newTick) {
            var finished = !execution || execution.toTick(newTick);
            if (finished) {
                execution = null;
                this.messages = hopalong();
                return index === commands.length && !execution;
            }
        };
        return that;
    };  
};

org.weblogo.renderingExecutor = function (executor, client, tickInterval) {
    var events = client.events;
    var that = {};
    
    that.tick = function () {
        var now = Date.now();
        var finished;
        try {
            var finished = that.execution.toTick(now);
            client.draw();
        }
        catch (e) {
            finished = true;
            events.onError.fire({message: "Error during rendering: " + e});
            console.log(e.stack);
        }
        if (finished) {
            that.stop();
        }
    };
      
    that.execute = function (command) {
        var executable;
        if (typeof(command) === "string") {
            var parsed = org.weblogo.stubParser(command);
            if (parsed.type === "error") {
                events.onError.fire(parsed);
            }
            else {
                executable = parsed.command;
            }
        }
        else { // it is a raw executor
            executable = command;
        }
           
        if (executable) {
            that.execution = executor.execute(executable, Date.now());
            if (that.execution && that.execution.type === "error") {
                events.onError.fire(that.execution);
                delete that.execution;
            }
            else {
                client.commandStart(that.execution);
                if(that.execution && that.execution.messages.length > 0) {
                    events.onInfo.fire(that.execution.messages[0]);
                }
                if (that.execution && that.execution.toTick) {
                    that.intervalID = window.setInterval(that.tick, tickInterval);
                }
                else {
                    client.draw();
                    that.stop();
                }
            }
        }
        return that.execution;
    };
    that.stop = function () {
        client.commandDone(that.execution);
        delete that.execution;
        if (that.intervalID) {
            window.clearInterval(that.intervalID);
            delete that.intervalID;
        }
    };
    return that;
};


org.weblogo.parseToType = function (value, type) {
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

org.weblogo.blockParser = function (commandString) {
    var commandObject = grammar.parse(commandString);
    var index = 0;
    var command = commandObject.command;
    var cs = org.weblogo.turtle.commands;
    var record = cs[command](commandObject.commands);

    if (!record) {
        return {
            type: "error",
            message: "command " + command + " not recognized: you can use " + 
                fluid.keys(cs).sort().join(", ")
        };
    }

    var args = [];
    var togo = {
        type: "command"
    }
    
    togo.command = record;
    return togo;
};

/** Parser for the "stub language" which operates simple commands in a flat list **/
org.weblogo.stubParser = function (commandString) {
    var tokens = commandString.match(/"[^"]+"|\S+/g);
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
 
