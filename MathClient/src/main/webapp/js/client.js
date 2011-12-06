(function() {

var s2 = Math.SQRT2;
var s3 = Math.sqrt(3);

org.weblogo.colshift = [
   [0,    -1/s2, 1/s3],
   [-1/s2, 1/2,  1/s3],
   [1/s2,  1/2,  1/s3]
];

org.weblogo.selectors = {
    canvas: ".flc-canvas",
    start: ".flc-math-start",
    stop: ".flc-math-stop",
    frameNumber: ".flc-math-frameNumber",
    frameRate: ".flc-math-frameRate",
    frameSize: ".flc-math-frameSize",
    dataRate: ".flc-math-dataRate",
    serverStatus: ".flc-math-serverStatus",
    connect: ".flc-math-connect",
    disconnect: ".flc-math-disconnect",
    serverUrl: ".flc-math-serverUrl",
    block: ".code",
    commands: ".flc-math-commands",
    errors: ".flc-math-errors"
};

org.weblogo.binder = function(container, selectors) {
    return {
        locate: function(selName) {
            return $(selectors[selName], container); 
        }
    }
};

org.weblogo.postImage = function(time, dataURL, postURL, that) {
    var image64 = dataURL.replace(/data:image\/png;base64,/, '');
    console.log(image64.length);
    try {
    var xhr = new XMLHttpRequest();
        xhr.loadend = function(pe) {
            that.locate("serverStatus").text(pe);
        }
        xhr.open("POST", postURL);
        xhr.send("Frame time: " + time + "\n"+image64+"\n");
    }
    catch(e) {
      
    }
    //var bb = new BlobBuilder();
    //bb.append(image64);
    //var blob = bb.getBlob('image/png');
};

org.weblogo.defaultConfigOptions = {
    rasterStep: Math.PI / 100
};

org.weblogo.makeConfig = function(element, options) {
    var that = {
        element: element,
        context: element.getContext('2d'),
    
        width: element.width,
        height: element.height,
        backgroundColour: "black",
        turtles: []
    };
    $.extend(true, that, org.weblogo.defaultConfigOptions, options);
    return that;
};


org.weblogo.turtle.commands.demo = function() {
    return {type: "demo"}
}
org.weblogo.turtle.commands.demo.args = [];

org.weblogo.executors.demo = function(config, command, tick) {
    var period = 1500;
    var radius = 50;
    
    var that = {
        initTime: tick
    };
    that.toTick = function(now) {
        var geom = org.weblogo.geom;
        var phase = (now - that.initTime) / period;
        var x = radius * Math.cos(phase);
        var y = radius * Math.sin(phase);
        var shift = geom.mult_33(org.weblogo.colshift, [x, y, 0]);
        shift = geom.add_3(shift, [128, 128, 128]);
        var colour = org.weblogo.colour.cssFromRGB(shift);
        
        var context = config.context;
        
        context.fillStyle = colour;
        context.fillRect(0, 0, config.width, config.height);
       
        context.fillStyle = "white";

        context.fillText("Frame time: " + (now - that.initTime)/1000 + "s", 0, config.height / 2);
        return false;
    };
    return that;
};


function compiler(inputStream) {
    var jsTranspile = "var outputStream = [];\nvar input = "+inputStream+";";

    if(!inputStream.length) {
        inputStream = [inputStream];
    }
    
    jsTranspile += '\n\
    for (var i = 0; i < input.length; ++i) {\n\
        var commandString;\n\
        \n\
        if (input[i].type === "keyword") {\n\
            commandString = input[i].command;\n\
\n\
            if(commandString === "repeat") {\n\
                commandString = "";\n\
                var repeat = compiler(input[i].args[0]);\n\
                for (var j = 0; j < repeat; ++j) {\n\
                    var repeatCommands = compiler(input[i].args[1]);\n\
                    outputStream = outputStream.concat(repeatCommands);\n\
                }\n\
            }\n\
            else {\n\
                for (var j = 0; j < input[i].args.length; ++j) {\n\
                    var arg = input[i].args[j];\n\
                    commandString += " " + compiler(arg);\n\
                }\n\
                outputStream.push(commandString);\n\
            }\n\
        }\n\
\n\
        else if (input[i].type === "number" \n\
                 | input[i].type === "string"\n\
                 | input[i].type === "accessor") {\n\
            return input[i].value;\n\
        }\n\
    }';

    return eval(jsTranspile);
}

org.weblogo.programToCommands = function(program) {
    var parsetree = grammar.parse(program);
    var linear = compiler(parsetree);
    return linear;
} 

org.weblogo.turtle.commands["repeat"] = function() {
    return {type: "repeat"}
}
org.weblogo.turtle.commands["repeat"].args = ["number", "string"];

org.weblogo.executors.repeat = function(config, command, tick) {
    var repeat = command.args[0];
    var commands = command.args[1];
    for(var i = 0; i < repeat; ++i)
    {
        org.weblogo.blockExecutor(commands);
    }
}


org.weblogo.turtle.commands["test-heading"] = function() {
    return {type: "testHeading"}
}
org.weblogo.turtle.commands["test-heading"].args = [];



org.weblogo.turtle.commands["test-card"] = function() {
    return {type: "testCard"}
}
org.weblogo.turtle.commands["test-card"].args = [];

function makeTestCommands() {
    var togo = [];
    for (var i = 0; i < 10; ++ i) {
        togo.push("set color " + (10*i + 5));
        togo.push("set pen-size " + (20 - 2*i));
        togo.push("left 40");
        togo.push("forward 360");
        togo.push("right 80");
        togo.push("forward 360");
        togo.push("left 40");
    }

    return togo;
};

org.weblogo.executors.testCard = org.weblogo.blockExecutor(makeTestCommands());

org.weblogo.turtle.commands["test-heading"] = function() {
    return {type: "testHeading"}
}
org.weblogo.turtle.commands["test-heading"].args = [];

function makeTestHeadingCommands() {
    var togo = [];
    for (var i = 0; i < 20; ++ i) {
        togo.push("set color " + (10*i + 5));
        togo.push("setheading 45");
        togo.push("forward 370");
    }
    return togo;
};

org.weblogo.executors.testHeading = org.weblogo.blockExecutor(makeTestHeadingCommands()); 

org.weblogo.client = function(container, options) {
    var that = {};
    that.locate = org.weblogo.binder(container, org.weblogo.selectors).locate;
    that.receiveBlob = function(blob) {
        that.locate("frameSize").text(blob.size);
    };
    that.events = {
        onInfo: fluid.makeEventFirer(),
        onError: fluid.makeEventFirer(),
        onDraw: fluid.makeEventFirer()
    };
    
    that.events.onInfo.addListener(function(info) {
        that.terminal.echo(info.message);
        that.commandDone();
    });

    that.events.onError.addListener(function(error) {
        that.terminal.error(error.message);
        that.commandDone();
    });

    
    that.commandStart = function() {
        that.busy = true;
        that.frameNo = 0;
        that.initTime = Date.now();
        that.lastFrame = that.initTime;
    };
    
    that.commandDone = function() {
        that.busy = false;
        // damnable thing behaves badly in synchronous case
        if (that.wasEnabled) {
            window.setTimeout(that.terminal.enable, 1);
        }
        that.wasDisabled = false;
    };
    
    that.draw = function(execution) {
        var url = that.element.toDataURL("image/png");
        if (that.serverUrl) {
            org.weblogo.postImage("Frame Time: " + now - that.initTime, url, that.serverUrl, that);
        }
        
        that.locate("frameSize").text(url.length);
        
        ++that.frameNo;
        that.locate("frameNumber").text(that.frameNo);
        var now = Date.now();
        var rate = 1000.0 / (now - that.lastFrame);
        that.locate("frameRate").text(rate.toFixed(2));
        that.locate("dataRate").text((url.length * rate / 1000).toFixed(1));
        that.lastFrame = now;
        
        that.events.onDraw.fire();
    };
    
    that.element = that.locate("canvas")[0];
        
    that.config = org.weblogo.makeConfig(that.element);
    that.executor = org.weblogo.renderingExecutor(
            org.weblogo.executor(that.config), that, 33);
    
    that.execute = function(command) {
        that.executor.execute(command);
        that.wasEnabled = that.terminal.enabled();
        if (that.wasEnabled) {
            that.terminal.disable();
        }
    };
        
    that.config.context.font = "50px Arial";
    
    
    that.locate("commands").terminal(function(command, terminal) {
        that.execute(command);
    }, {
        greetings: "WebLogo Command Interpreter © Math on a Sphere, 2011-",
        enabled: false,
        width: 500,
        height: 100,
        prompt: "weblogo>",
        onInit: function(terminal) {
            that.terminal = terminal;
        }
    });
      

    that.locate("start").click(that.start);
    that.locate("stop").click(that.executor.stop);
    var connect = that.locate("connect");
    var disconnect = that.locate("disconnect");
    connect.click(function() {
        that.serverUrl = that.locate("serverUrl").val();
        disconnect.prop("disabled", false);
        connect.prop("disabled", true);
    });
    disconnect.click(function() {
        that.serverUrl = null;
        connect.prop("disabled", false);
        disconnect.prop("disabled", true);
    }).prop("disabled", true);
    org.weblogo.executors.clearAll(that.config);
    
    var hash = window.location.hash;
    if (hash) {
        that.execute(hash.substring(1));
    }
    
    return that;
}

org.weblogo.init = function() {
    var client = org.weblogo.client("body");
    var preview = org.weblogo.preview.webGLStart("#webgl-canvas", ".flc-canvas", client);
    client.drawListener = preview.updateTexture;
    var code = $("#code");

    var myCodeMirror = CodeMirror.fromTextArea(code[0], {
        lineNumbers: "true",
        mode: "javascript"
    });

    $("#compile-button").click(function () {
        var code = myCodeMirror.getValue();
        var parsetree = grammar.parse(code);
        var commands = compiler(parsetree);
        var executor = org.weblogo.blockExecutor(commands);
        client.execute(executor);
        });
        
    var commands = client.locate("commands");
    $(document).click(function (event) {
        if (commands.has(event.target).length === 0 && event.target !== commands[0]) {
            client.terminal.focus(false);
        }
    });
};

}());
