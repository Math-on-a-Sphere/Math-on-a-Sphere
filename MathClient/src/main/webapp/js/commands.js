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


/** Turtle commands definitions **/

org.weblogo.turtle.commands = {};
var commands = org.weblogo.turtle.commands;

commands.forward = function (distance) {
    return {
        type: "line",
        distance: Math.PI * distance / 180
    }
};
commands.forward.arguments = ["number"];

commands.fd = commands.forward;

commands.back = function (distance) {
    return {
        type: "line",
        distance: - Math.PI * distance / 180
    }
};
commands.back.arguments = ["number"];
commands.bk = commands.back;

commands.left = function (angle) {
    return {
        type: "turn",
        angle: Math.PI * angle / 180
    }
};
commands.left.arguments = ["number"];
commands.lt = commands.left;

commands.right = function (angle) {
    return {
        type: "turn",
        angle: - Math.PI * angle / 180
    }
};
commands.right.arguments = ["number"];
commands.rt = commands.right;

/** Turtle "accessors", to model those turtle aspects which are represented as "variables" **/

org.weblogo.turtle.accessors = {};
var accessors = org.weblogo.turtle.accessors;

accessors["pen-size"] = {
    property: "width"
}

accessors["color"] = {
    property: "colour",
    shadowProperty: "userColour",  
}



}());