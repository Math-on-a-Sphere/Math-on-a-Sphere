(function () {

var geom = org.weblogo.geom;

org.weblogo.storeFrame = function (config) {
    config.frame = config.context.getImageData(0, 0, config.width, config.height);
};

org.weblogo.restoreFrame = function (config) {
    config.context.putImageData(config.frame, 0, 0);
};

org.weblogo.updateTurtle = function (config, turtle) {
    if (turtle.showing && config.interactive) {
        org.weblogo.testTurtle.drawAt(config, turtle.position, turtle.heading)
    }
};

var updateTurtle = org.weblogo.updateTurtle;

var updateTurtleF = function (config, turtle) {
    if (config.interactive) {
        org.weblogo.restoreFrame(config);
        updateTurtle(config, turtle);
    }
};

// An "executor" constructs an "execution object" which will persist whilst the
// execution is in process
org.weblogo.executors = {};

// Although line executors are asynchronous, they currently expect to run all
// turtles in lockstep (so speed setting is assumed to be shared)
org.weblogo.executors.line = function (config, command, tick) {
    var that = {};
    that.firstTick = tick;
    that.lines = {};
    
    fluid.each(config.turtles, function (turtle) {
        var line = that.lines[turtle.id] = {};
        line.distance = command.distance;
        line.finalTick = tick + 1000 * Math.abs(command.distance) / (turtle.speed * config.masterSpeed);
        line.startPos = turtle.position;
        line.lastDistance = 0;
    });
    
    that.toTick = function (newTick) {
        var finished = fluid.transform(config.turtles, function (turtle) {
            if (config.interactive) {
                org.weblogo.restoreFrame(config);
            }
            var line = that.lines[turtle.id];
            var finished = false;
            var newDistance = line.distance * (newTick - that.firstTick) / (line.finalTick - that.firstTick);
            if (newTick >= line.finalTick) {
                newDistance = line.distance;
                finished = true;
            }
            var versor = geom.versor_from_parts(turtle.heading, newDistance);
            var newpos = geom.quat_conj(versor, line.startPos);
            if (turtle.drawing && config.interactive) {
                var sign = geom.sign(line.distance);
                org.weblogo.raster.stroke_line({
                  config: config, 
                  start: sign === 1? turtle.position : newpos, 
                  end: sign === 1? newpos : turtle.position, 
                  distance: sign * (newDistance - line.lastDistance),
                  heading: turtle.heading, 
                  colour: turtle.colour, 
                  width: turtle.width});
                  org.weblogo.storeFrame(config);
            }
            // normalise final position to avoid overflow due to continuous chaining
            turtle.position = org.weblogo.geom.norm_3(newpos);
            updateTurtle(config, turtle);
                      
            line.lastDistance = newDistance;
            return finished;
        });
        
        return finished[0];
    };
    return that;
};

org.weblogo.executors.turn = function (config, command, tick) {
    var that = {};
    that.firstTick = tick;
    that.turns = {};
    fluid.each(config.turtles, function (turtle) {
        var turn = that.turns[turtle.id] = {};
        turn.angle = command.angle;
        turn.finalTick = tick + 1000 * Math.abs(command.angle) / (turtle.turnSpeed * config.masterSpeed);
        turn.startPos = turtle.heading;
        turn.lastAngle = 0;
    });
  
    that.toTick = function (newTick) {
        var finished = fluid.transform(config.turtles, function (turtle) {
            var turn = that.turns[turtle.id];
            var finished = false;
            var newAngle = turn.angle * (newTick - that.firstTick) / (turn.finalTick - that.firstTick);
            if (newTick > turn.finalTick) {
                newAngle = turn.angle;
                finished = true;
            }
            turtle.heading = geom.point_by_angle(turn.startPos, turtle.position, newAngle);
            updateTurtleF(config, turtle);
            return finished;
        });
        return finished[0];
    };
    return that;
};

org.weblogo.executors.clearDrawing = function (config, command) {
    var colour = org.weblogo.colour.cssFromColour(config.backgroundColour);
    config.context.fillStyle = colour;
    config.context.fillRect(0, 0, config.width, config.height);
    org.weblogo.storeFrame(config);
};

org.weblogo.executors.clearAll = function (config, command) {
    org.weblogo.executors.clearDrawing(config, command);
    // TODO: different modes for initial state
    config.turtles = [org.weblogo.turtle()];
    org.weblogo.updateTurtle(config, config.turtles[0]);
};

org.weblogo.executors.penUp = function (config, command) {
    fluid.each(config.turtles, function (turtle) {
        turtle.drawing = false; 
    });
};

org.weblogo.executors.penDown = function (config, command) {
    fluid.each(config.turtles, function (turtle) {
        turtle.drawing = true; 
    });
};

org.weblogo.executors.setSpeed = function (config, command) {
    config.masterSpeed = command.speed;
//    fluid.each(config.turtles, function (turtle) {
//        turtle.speed = command.speed;
//    });
}

org.weblogo.executors.getSpeed = function (config, command) {
    return {
        type: "value",
        value: config.masterSpeed
    };
//    var output;
//    fluid.each(config.turtles, function (turtle) {
//        output = {
//            type: "info",
//            message: turtle.speed
//        };
//    });
//    return output;
};

org.weblogo.executors.setRotationAxis = function (config, command) {
    fluid.each(config.turtles, function (turtle) {
        turtle.heading = geom.polar_to_3(command.theta, command.phi);
        updateTurtleF(config, turtle);
    });
};

org.weblogo.executors.towards = function (config, command) {
    fluid.each(config.turtles, function (turtle) {
        var target = geom.polar_to_3(command.theta, command.phi); 
        var heading = geom.axis_from_heading(turtle.position, target);
        turtle.heading = heading;
        updateTurtleF(config, turtle);
    });
};

org.weblogo.executors.distanceTo = function (config, command) {
    var output;
    fluid.each(config.turtles, function (turtle) {
        var target = geom.polar_to_3(command.theta, command.phi);
        var distance = Math.acos(geom.dot_3(turtle.position, target));
        var distancedeg = geom.rad2deg(distance);
        output = {
            type: "value",
            value: distancedeg
        };
    });
    return output;
};

var pole = geom.polar_to_3(Math.PI/2, 0);

org.weblogo.executors.setHeading = function (config, command) {
    fluid.each(config.turtles, function (turtle) {
        var poleAxis = geom.axis_from_heading(turtle.position, pole);
        var newAxis = geom.point_by_angle(poleAxis, turtle.position, command.angle); 
        turtle.heading = newAxis; 
        updateTurtleF(config, turtle);
    });
};

org.weblogo.executors.getHeading = function (config, command) {
    var output;
    fluid.each(config.turtles, function (turtle) {
        var poleAxis = geom.axis_from_heading(turtle.position, pole);
        var cross = geom.cross_3(turtle.heading, poleAxis);
        var sin = geom.dot_3(cross, turtle.position);
        var angle = Math.atan2(sin, geom.dot_3(turtle.heading, poleAxis));
        var heading = geom.rad2deg(angle);
        output = {
            type: "value",
            value: heading
        };
    });
    return output;
};

org.weblogo.executors.setPosition = function (config, command, tick) {
    var angle;
    fluid.each(config.turtles, function (turtle) {
        var newPos = geom.polar_to_3(command.theta, command.phi);
        turtle.heading = geom.axis_from_heading(turtle.position, newPos);
        // TODO: this command model will not work for multiple turtles
        angle = Math.acos(geom.safe_dot_3(turtle.position, newPos));
    });
    return org.weblogo.executors.line(config, {distance: angle}, tick);
};

org.weblogo.executors.getPosition = function (config, command) {
    var output;
    fluid.each(config.turtles, function (turtle) {
        var pos = geom.polar_from_3(turtle.position);
        var a = geom.rad2deg(pos[0]);
        var b = geom.rad2deg(pos[1]);
        output = {
            type: "value",
            value: [a, b]
        };
    });
    return output;
};

org.weblogo.executors.print = function (config, command) {
    var output;
    fluid.each(config.turtles, function (turtle) {
        output = {
            type: "info",
            message: command.message
        };
    });
    return output;
};


org.weblogo.executors.help = function (config, command) {
    var commandlist = "commands: ";

    $.each(org.weblogo.turtle.commands, function (el){
        commandlist += el + ", ";
    });

    output = {
        type: "info",
        message: commandlist
    };
    return output;
}

org.weblogo.executors.set = function (config, command) {
    var as = org.weblogo.turtle.accessors;
    var accessor = as[command.variable];
    if (!accessor) {
        return {
            type: "error",
            message: "No variable name " + command.variable + " is defined for turtle: you can use " + 
                fluid.keys(as).join(", ")
        };
    }
    var parsed = org.weblogo.parseToType(command.value, accessor.type);
    if (parsed.type === "error") {
        return parsed;
    }
    if (accessor.rejector) {
        var error = accessor.rejector(parsed);
        if (error) {
            return {
                type: "error",
                message: error
            }
        }
    }
    if (accessor.lens) {
        parsed = accessor.lens.write(parsed);
    }
    var property = accessor.property || command.variable;
    fluid.each(config.turtles, function (turtle) {
        turtle[property] = parsed;
        if (accessor.updator) {
            accessor.updator(config, turtle, parsed, command);
        }  
    });
};

/** Turtle commands definitions **/

org.weblogo.turtle.commands = {};
var commands = org.weblogo.turtle.commands;

commands.forward = function (distance) {
    return {
        type: "line",
        distance: geom.deg2rad(distance)
    }
};
commands.forward.args = ["number"];

commands.fd = commands.forward;

commands.back = function (distance) {
    return {
        type: "line",
        distance: -geom.deg2rad(distance)
    }
};
commands.back.args = ["number"];
commands.bk = commands.back;

commands.left = function (angle) {
    return {
        type: "turn",
        angle: geom.deg2rad(angle)
    }
};
commands.left.args = ["number"];
commands.lt = commands.left;

commands.right = function (angle) {
    return {
        type: "turn",
        angle: -geom.deg2rad(angle)
    }
};
commands.right.args = ["number"];
commands.rt = commands.right;

commands.getspeed = function () {
    return {
        type: "getSpeed"
    }
};
commands.getspeed.args = [];

commands.setspeed = function (speed) {
    return {
        type: "setSpeed",
        speed: speed
    }
};
commands.setspeed.args = ["number"];


commands.getheading = function () {
    return {
        type: "getHeading"
    }
};
commands.getheading.args = [];

commands.setheading = function (angle) {
    return {
        type: "setHeading",
        angle: -geom.deg2rad(angle)
    }
};
commands.setheading.args = ["number"];
commands.sh = commands.setheading;

commands.setrotationaxis = function (t, p) {
    return {
        type: "setRotationAxis",
        theta: geom.deg2rad(t),
        phi:   geom.deg2rad(p)      
    }
};
commands.setrotationaxis.args = ["number","number"];
commands.sra = commands.setrotationaxis;

commands.towards = function (t, p) {
    return {
        type: "towards",
        theta: geom.deg2rad(t),
        phi:   geom.deg2rad(p),
    }
};
commands.towards.args = ["number", "number"];

commands.distanceto = function (t, p) {
    return {
        type: "distanceTo",
        theta: geom.deg2rad(t),
        phi:   geom.deg2rad(p),
    }
};
commands.distanceto.args = ["number", "number"];

commands.setpos = function (t, p) {
    return {
        type: "setPosition",
        theta: geom.deg2rad(t),
        phi:   geom.deg2rad(p),
    }
};
commands.setpos.args = ["number","number"];
commands.sp = commands.setpos;
commands.setposition = commands.setpos;

commands.getposition = function () {
    return {
        type: "getPosition"
    }
};
commands.getposition.args = [];

commands.print = function (msg) {
    return {
        type: "print",
        message: msg
    }
};
commands.print.args = ["string"];

commands.help = function () {
    return {
        type: "help"
    }
};
commands.help.args = [];


commands.set = function (variable, value) {
    return {
        type: "set",
        variable: variable,
        value: value
    }  
};

commands.penup = function () {
    return {
        type: "penUp"
    }  
};
commands.penup.args = [];
commands.pu = commands.penup;

commands.pendown = function () {
    return {
        type: "penDown"
    }  
};
commands.pendown.args = [];
commands.pd = commands.pendown;

commands.cleardrawing = function () {
    return {
        type: "clearDrawing"
    }
};
commands.cleardrawing.args = [];

commands.clearall = function () {
    return {
        type: "clearAll"
    }
};
commands.clearall.args = [];
commands.ca = commands.clearall;

// actual value type will be parsed by the accessor
commands.set.args = ["string", "string"];

var scaleLens = function (scale) {
    return {
        write: function (value) {
            return value / scale;
        },
        read: function (value) {
            return value * scale;
        }
    }  
};

var showingLens = {
    write: function (value) {
        return (value === 1 || value === "on")? true: false;
    },
    read: function (value) {
        return value? "on" : "off";
    }
};

/** Turtle "accessors", to model those turtle aspects which are represented as "variables" **/

org.weblogo.turtle.accessors = {};
var accessors = org.weblogo.turtle.accessors;

accessors["pensize"] = {
    property: "width",
    type: "number|identifier",
    rejector: function (value) {
        if (value > 90) {
            return "Cannot set pen size to greater than a quarter circle"  
        }
        else if (value < 0) {
            return "Pen size must be positive"
        }
    },
    lens: scaleLens(180 / Math.PI)
};
accessors["ps"] = accessors["pensize"];

accessors["color"] = {
    property: "colour",
    type: "number|string",
    rejector: function (value) {
        var cnames = org.weblogo.netLogoColourNames;
        if (typeof(value) === "string" && !cnames[value]) {
            return value + " is not a valid colour name: you can use " + Object.keys(cnames).join(', ');
        }
    }
};

accessors["showing"] = {
    property: "showing",
    type: "number|string",
    lens: showingLens,
    updator: updateTurtleF
};

}());
