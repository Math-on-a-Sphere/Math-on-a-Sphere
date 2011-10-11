(function() {

var s2 = Math.SQRT2;
var s3 = Math.sqrt(3);
var counter = 0;
var TOTAL_FRAMES = 100;

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

org.weblogo.executors.testCard = function(config, command, tick) {
    var executor = org.weblogo.executor(config);
    function quickExec(commandString) {
        var parsed = org.weblogo.stubParser(commandString);
        var now = Date.now();
        execution = executor.execute(parsed.command, now);
        return execution;
    }

    var commands = makeTestCommands();
    var index = 0;
    var execution;
    function hopalong() {
        while (!execution && index < commands.length) {
            execution = quickExec(commands[index]);
            ++index;
        }
    }
    hopalong();
    var that = {};
    that.toTick = function(newTick) {
        var finished = execution.toTick(newTick);
        if (finished) {
            execution = null;
            hopalong();
            return index === commands.length;
        }
    };
    return that;
};

org.weblogo.client = function(container, options) {
    var that = {};
    that.locate = org.weblogo.binder(container, org.weblogo.selectors).locate;
    that.receiveBlob = function(blob) {
        that.locate("frameSize").text(blob.size);
    };
    
    that.error = function(error) {
        that.terminal.error(error.message);
        that.commandDone();
    };
    
    that.commandStart = function() {
        that.busy = true;
        that.frameNo = 0;
        that.initTime = Date.now();
        that.lastFrame = that.initTime;
    };
    
    that.commandDone = function() {
        that.busy = false;
        // damnable thing behaves badly in synchronous case
        window.setTimeout(that.terminal.enable, 1);
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
        //webGLStart();
        //counter++;
        if (that.drawListener) {
            that.drawListener();
        }
    };
    
    that.element = that.locate("canvas")[0];
        
    that.config = org.weblogo.makeConfig(that.element);
    that.executor = org.weblogo.renderingExecutor(
            org.weblogo.executor(that.config), that, 33);
        
    that.config.context.font = "50px Arial";
    
    that.locate("commands").terminal(function(command, terminal) {
        that.executor.execute(command);
        that.terminal.disable();
    }, {
        greetings: "WebLogo Command Interpreter © Math on a Sphere, 2011-",
        width: 500,
        height: 400,
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
        that.executor.execute(hash.substring(1));
        that.terminal.disable();
    }
    
    return that;
}

}());
