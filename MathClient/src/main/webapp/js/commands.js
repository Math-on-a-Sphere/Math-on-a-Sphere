(function() {

var geom = org.weblogo.geom;

// An "executor" constructs an "execution object" which will persist whilst the
// execution is in process
org.weblogo.executors = {};

// Although line executors are asynchronous, they currently expect to run all
// turtles in lockstep (so speed setting is assumed to be shared)
org.weblogo.executors.line = function(config, command, tick) {
    var that = {};
    
    that.command = command;
    that.lastTick = that.firstTick = tick;
    that.lines = {};
    
    fluid.each(config.turtles, function(turtle) {
        var line = that.lines[turtle.id] = {};
        line.distance = command.distance;
        line.finalTick = tick + 1000 * Math.abs(command.distance) / turtle.speed;
        line.startPos = turtle.position;
        line.lastDistance = 0;
    });
    
    that.toTick = function(newTick) {
        var finished = fluid.transform(config.turtles, function(turtle) {
            var line = that.lines[turtle.id];
            var finished = false;
            var newDistance = line.distance * (newTick - that.lastTick) / (line.finalTick - that.lastTick);
            var sign = line.distance > 0? 1 : -1;
            if (sign * newDistance >= sign * line.distance) {
                newDistance = line.distance;
                finished = true;
            }
            var versor = geom.versor_from_parts(turtle.heading, newDistance);
            var newpos = geom.quat_conj(versor, line.startPos);
            if (turtle.drawing) {
                org.weblogo.raster.stroke_line({
                  config: config, 
                  start: sign === 1? turtle.position : newpos, 
                  end: sign === 1? newpos : turtle.position, 
                  distance: sign * (newDistance - line.lastDistance),
                  heading: turtle.heading, 
                  colour: turtle.colour, 
                  width: turtle.width});
            }
            turtle.position = newpos;
            line.lastDistance = newDistance;
            return finished;
        });
        return finished[0];
    };
    return that;
};

// turn executors are synchronous and so have no "toTick" method
org.weblogo.executors.turn = function(config, command) {
    fluid.each(config.turtles, function(turtle) {
        var versor = geom.versor_from_parts(turtle.position, command.angle);
        var newHeading = geom.quat_conj(versor, turtle.heading);
        turtle.heading = newHeading; 
    });
};

org.weblogo.executors.clearDrawing = function(config, command) {
    var colour = org.weblogo.colour.cssFromColour(config.backgroundColour);
    config.context.fillStyle = colour;
    config.context.fillRect(0, 0, config.width, config.height);
};

org.weblogo.executors.clearAll = function(config, command) {
    org.weblogo.executors.clearDrawing(config, command);
    // TODO: different modes for initial state
    config.turtles = [org.weblogo.turtle()]
};

org.weblogo.executors.penUp = function(config, command) {
    fluid.each(config.turtles, function(turtle) {
        turtle.drawing = false; 
    });
};

org.weblogo.executors.penDown = function(config, command) {
    fluid.each(config.turtles, function(turtle) {
        turtle.drawing = true; 
    });
};

org.weblogo.executors.setHeading = function(config, command) {
    fluid.each(config.turtles, function(turtle) {
        var pole = geom.polar_to_3(Math.PI/2, 0);
        turtle.heading = geom.axis_from_heading(turtle.position, pole); 
        var versor = geom.versor_from_parts(turtle.position, command.angle);
        var newHeading = geom.quat_conj(versor, turtle.heading);
        turtle.heading = newHeading; 
    });
}

org.weblogo.executors.getHeading = function(config, command) {
    var output;
    fluid.each(config.turtles, function(turtle) {
        var pole = geom.polar_to_3(Math.PI/2, 0);
        var ang = geom.rad2deg(Math.acos(geom.dot_3(turtle.heading, pole)));
        var cross = geom.cross_3(turtle.heading, turtle.position);
        var heading = 0;
        if (cross[2] > 0) {
            heading = 90 - ang;
        }
        else {
            heading = 90 + ang;
        }
        output = {
            type: "info",
            message: heading
        };
    });
    return output;
};

org.weblogo.executors.position = function(config, command) {
    fluid.each(config.turtles, function(turtle) {
        var oldv = turtle.position;
        //var oldpos = geom.polar_from_3(oldv);
        //var theta1 = geom.rad2deg(oldpos[0]);
        //var phi1 = geom.rad2deg(oldpos[1]);
        //var dTheta = command.theta - theta1;
        //var dPhi = command.phi - phi1;
        //var y = Math.sin(dLon) * Math.cos(lat2);
        //var y = Math.sin(dPhi) * Math.cos(command.theta);
        //var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
        //var x = Math.cos(theta1)*Math.sin(command.theta) - Math.sin(theta1)*Math.cos(command.theta)*Math.cos(dPhi);
        //var brng = Math.atan2(y, x);

        turtle.position = geom.polar_to_3(command.theta,command.phi); 
        turtle.heading = geom.axis_from_heading(oldv, turtle.position); 
    });
};

org.weblogo.executors.set = function(config, command) {
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
    fluid.each(config.turtles, function(turtle) {
        turtle[property] = parsed;
    });
};

/** Turtle commands definitions **/

org.weblogo.turtle.commands = {};
var commands = org.weblogo.turtle.commands;

commands.forward = function (distance) {
    return {
        type: "line",
        distance: Math.PI * distance / 180
    }
};
commands.forward.args = ["number"];

commands.fd = commands.forward;

commands.back = function (distance) {
    return {
        type: "line",
        distance: - Math.PI * distance / 180
    }
};
commands.back.args = ["number"];
commands.bk = commands.back;

commands.left = function (angle) {
    return {
        type: "turn",
        angle: Math.PI * angle / 180
    }
};
commands.left.args = ["number"];
commands.lt = commands.left;

commands.right = function (angle) {
    return {
        type: "turn",
        angle: - Math.PI * angle / 180
    }
};
commands.right.args = ["number"];
commands.rt = commands.right;

commands.getheading = function () {
    return {
        type: "getHeading"
    }
};
commands.getheading.args = [];
commands.sp = commands.getheading;

commands.setheading = function (angle) {
    return {
        type: "setHeading",
        angle: - Math.PI * angle / 180
    }
};
commands.setheading.args = ["number"];
commands.sp = commands.setheading;

commands.setpos = function (t, p) {
    return {
        type: "position",
        theta: Math.PI * t / 180,
        phi: Math.PI * p /180
    }
};
commands.setpos.args = ["number","number"];
commands.sp = commands.setpos;

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
commands["pen-up"] = commands.penup;

commands.pendown = function () {
    return {
        type: "penDown"
    }  
};
commands.pendown.args = [];
commands["pen-down"] = commands.pendown;

commands.cd = function() {
    return {
        type: "clearDrawing"
    }
};
commands.cd.args = [];
commands["clear-drawing"] = commands.cd;

commands.ca = function() {
    return {
        type: "clearAll"
    }
};
commands.ca.args = [];
commands["clear-all"] = commands.ca;

// actual value type will be parsed by the accessor
commands.set.args = ["string", "string"];

var scaleLens = function(scale) {
    return {
        write: function(value) {
            return value / scale;
        },
        read: function(value) {
            return value * scale;
        }
    }  
};
/** Turtle "accessors", to model those turtle aspects which are represented as "variables" **/

org.weblogo.turtle.accessors = {};
var accessors = org.weblogo.turtle.accessors;

accessors["pen-size"] = {
    property: "width",
    type: "number",
    rejector: function(value) {
        if (value > 90) {
            return "Cannot set pen size to greater than a quarter circle"  
        }
        else if (value < 0) {
            return "Pen size must be positive"
        }
    },
    lens: scaleLens(180 / Math.PI)
};

accessors["color"] = {
    property: "colour",
    type: "number|string",
    rejector: function(value) {
        var cnames = org.weblogo.netLogoColourNames;
        if (typeof(value) === "string" && !cnames[value]) {
            return value + " is not a valid colour name: you can use " + cnames.join(", ")
        }
    }
};

}());
