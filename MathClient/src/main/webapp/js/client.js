(function () {

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

org.weblogo.binder = function (container, selectors) {
    return {
        locate: function (selName) {
            return $(selectors[selName], container); 
        }
    }
};

org.weblogo.postImage = function (time, dataURL, postURL, that) {
    var image64 = dataURL.replace(/data:image\/png;base64,/, '');
    console.log(image64.length);
    try {
    var xhr = new XMLHttpRequest();
        xhr.loadend = function (pe) {
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

org.weblogo.makeConfig = function (element, events, options) {
    var that = {
        element: element,
        events: events,
        context: element.getContext('2d'),
    
        width: element.width,
        height: element.height,
        backgroundColour: "black",
        masterSpeed: 1.0,
        interactive: true,
        turtles: []
    };
    $.extend(true, that, org.weblogo.defaultConfigOptions, options);
    return that;
};

org.weblogo.turtle.commands.demo = function () {
    return {type: "demo"}
};
org.weblogo.turtle.commands.demo.args = [];

org.weblogo.executors.demo = function (config, command, tick) {
    var period = 1500;
    var radius = 50;
    
    var that = {
        initTime: tick
    };
    that.toTick = function (now) {
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

org.weblogo.compilerdriver = function (inputStream, config, immediate) {
    org.weblogo.outputStream = [];
    org.weblogo.config = config;
    org.weblogo.compilerdepth = 0;
    org.weblogo.program = {};
    org.weblogo.program.executor = immediate? org.weblogo.nullExecutor : org.weblogo.quickStringExecutor(org.weblogo.executor(config));
    org.weblogo.program.program = {};
    org.weblogo.program.scopes = [{}];

    org.weblogo.program.program = org.weblogo.importReserve();
    org.weblogo.program.program += org.weblogo.compiler(inputStream, "");
    
    config.interactive = false;
    eval(org.weblogo.program.program);
    config.interactive = true;
}

org.weblogo.compiler = function (inputStream, program) {
    if (fluid.isPrimitive(inputStream) || !inputStream.length) {
        inputStream = [inputStream];
    }
    for (var i = 0; i < inputStream.length; ++i) {
        var node = inputStream[i];
        if (fluid.isPrimitive(node)) {
            program = {value: node}
        }
        else {
            var handler = org.weblogo.nodeHandlers[node.handler];
            program = handler(node, program, org.weblogo.compiler);
        }
    }
    return program;
}

org.weblogo.turtle.commands["repeat"] = function () {
    return {type: "repeat"}
};
org.weblogo.turtle.commands["repeat"].args = ["number", "string"];

org.weblogo.executors.repeat = function (config, command, tick) {
    var repeat = command.args[0];
    var commands = command.args[1];
    for(var i = 0; i < repeat; ++i) {
        org.weblogo.blockExecutor(commands);
    }
};



org.weblogo.loadAutoSave = function () {
    try {
        return localStorage.getItem("org.weblogo.autoSave") || "";
    }
    catch (e) {
        return "";
    }
};

org.weblogo.saveAutoSave = function (text) {
    try {
        localStorage.setItem("org.weblogo.autoSave", text);
    }
    catch (e) {}
};

org.weblogo.client = function (container, options) {
    var that = {};
    that.locate = org.weblogo.binder(container, org.weblogo.selectors).locate;
    that.receiveBlob = function (blob) {
        that.locate("frameSize").text(blob.size);
    };
    that.initFrame = function () {
        that.frameNo = 0;
        that.initTime = Date.now();
        that.lastFrame = that.initTime;
    };
    that.events = {
        onFileLoaded: fluid.makeEventFirer(),
        onInfo: fluid.makeEventFirer(),
        onError: fluid.makeEventFirer(),
        onDraw: fluid.makeEventFirer()
    };
    
    that.events.onInfo.addListener(function (info) {
        that.terminal.echo(info.message);
        that.commandDone();
    });

    that.events.onError.addListener(function (error) {
        that.terminal.error(error.message);
        that.commandDone();
    });
    
    that.events.onFileLoaded.addListener(function () {
        if (that.queueAutoRun) {
            that.queueAutoRun = false;
            $("#compile-button").click();
        }
    });

    
    that.commandStart = function () {
        that.busy = true;
        that.initFrame();
        that.locate("stop").prop("disabled", false);
    };
    
    that.commandDone = function () {
        that.busy = false;
        that.locate("stop").prop("disabled", true);
        window.setTimeout(function () {
            fluid.log("Idle at " + Date.now() + " lag " + (Date.now() - that.initTime) + "ms");
        });
        // damnable thing behaves badly in synchronous case
        if (that.wasEnabled) {
            window.setTimeout(that.terminal.enable, 1);
        }
        that.wasDisabled = false;
    };
    
    that.draw = function (execution) {
        var url = "1";
        if (that.serverUrl) {
            url = that.element.toDataURL("image/png");
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
        
    that.config = org.weblogo.makeConfig(that.element, that.events);

    that.executor = org.weblogo.renderingExecutor(
            org.weblogo.executor(that.config), that, 33);
    
    that.execute = function (command) {
        that.executor.execute(command);
        that.wasEnabled = that.terminal.enabled();
        if (that.wasEnabled) {
            that.terminal.disable();
        }
    };
        
    that.config.context.font = "50px Arial";
    
    
    that.locate("commands").terminal(function (command, terminal) {
        command += "\n";
        var parsetree = grammar.parse(command);
        org.weblogo.compilerdriver(parsetree, that.config, true);
        var executor = org.weblogo.blockExecutor(org.weblogo.outputStream, true);
        that.execute(executor);
    }, {
        greetings: "WebLogo Command Interpreter © Math on a Sphere, 2011-",
        enabled: false,
        width: 600,
        height: 100,
        prompt: "weblogo>",
        onInit: function (terminal) {
            that.terminal = terminal;
        }
    });
    
    that.initFrame();

    that.locate("start").click(that.start);
    that.locate("stop").click(that.executor.stop).prop("disabled", true);
    var connect = that.locate("connect");
    var disconnect = that.locate("disconnect");
    connect.click(function () {
        that.serverUrl = that.locate("serverUrl").val();
        disconnect.prop("disabled", false);
        connect.prop("disabled", true);
    });
    disconnect.click(function () {
        that.serverUrl = null;
        connect.prop("disabled", false);
        disconnect.prop("disabled", true);
    }).prop("disabled", true);
    
    return that;
}

org.weblogo.init = function () {
    var client = org.weblogo.client("body");
    var countbacks = 0;
    var startfunc = function () {
        org.weblogo.executors.clearAll(client.config);
        client.draw();
        var hash = window.location.hash;
        if (hash) {
            if (hash.charAt(1) === "!") {
                var preload = hash.substring(2);
                client.queueAutoRun = true;
                var select = $("#preload-commands");
                select.val(preload);
                select.selectmenu("refresh");
            } else {
                client.execute(hash.substring(1));
            }
        }
    };
    var backfunc = function () {
        ++countbacks;
        if (countbacks == 2) {
            startfunc();
        }
    }
    org.weblogo.testTurtle.webGLStart(".flc-aux-canvas", client, backfunc);
    var preview = org.weblogo.preview.webGLStart("#webgl-canvas", ".flc-canvas", client, backfunc);
    client.canvas2d = preview.canvas2d;
    
   // org.weblogo.complex.webGLStart(".flc-aux-canvas", client);
    
    client.drawListener = preview.updateTexture;
    var code = $("#code");
    var myCodeMirror = client.codeMirror = CodeMirror.fromTextArea(code[0], {
        lineNumbers: "true",
        mode: "weblogo",
    });
    
    var saved = org.weblogo.loadAutoSave(); 
    myCodeMirror.setValue(saved);
    
    setInterval(function () {
        var history = myCodeMirror.historySize();
        if (history.undo + history.redo > 0) {
            org.weblogo.saveAutoSave(myCodeMirror.getValue());
        };
    }, 2000);

    $("#compile-button").click(function () {
        try {
            var code = "ca()\n" + myCodeMirror.getValue();
            var parsetree = grammar.parse(code);
            org.weblogo.compilerdriver(parsetree, client.config);
            var executor = org.weblogo.blockExecutor(org.weblogo.outputStream);
            client.execute(executor);
        }
        catch (e) {
            client.events.onError.fire({message: e});
        }
    });
        
    var commands = client.locate("commands");
    $(document).click(function (event) {
        if (commands.has(event.target).length === 0 && event.target !== commands[0]) {
            client.terminal.focus(false);
        }
    });

    $("#reset-position-button").click(function () {
        org.weblogo.preview.resetPosition();
    });
    $("#show2d-button").click(function () {
        var canvas = $("#hiddenCanvas")[0];
       
        if (canvas.style.display === 'none') {
            canvas.style.display = 'block';
        } else {
            canvas.style.display = 'none';
        }

    });

    var handleSelect = function () {
        console.log("click");
        var menu = $("#preload-commands")[0];
        var selected = menu.options[menu.selectedIndex].value;
        if (selected === "noselection") { selected = "blank"; }
        if (selected === "my_design") {
            var saved = org.weblogo.loadAutoSave();
            myCodeMirror.setValue(saved);
            myCodeMirror.clearHistory();
        }
        else {
            org.weblogo.preload.loadSelected(selected, myCodeMirror, client);
        }
    };
     
    var preload = $("#preload-commands");
    var menu = preload.selectmenu({style:"popup", width: 200, maxHeight: 600, select: handleSelect});

};



// **************** Test Cases **************** //


org.weblogo.turtle.commands.rununittests = function () {
    return {type: "rununittests"}
}
org.weblogo.turtle.commands.rununittests.args = [];

org.weblogo.turtle.commands["testheading"] = function () {
    return {type: "testHeading"}
}
org.weblogo.turtle.commands["testheading"].args = [];

org.weblogo.turtle.commands["testcard"] = function () {
    return {type: "testCard"}
}
org.weblogo.turtle.commands["testcard"].args = [];



function makeTestCardCommands() {
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

org.weblogo.executors.testCard = org.weblogo.blockExecutor(makeTestCardCommands());

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

org.weblogo.executors.rununittests = function () {
    testCase1();
    testCase2();
}

function testCase1() {
    var testCase = '\
ca() \
x = 100 \
y = x/2 \
forward y';

    org.weblogo.compilerdriver(grammar.parse(testCase));
   
    var passCase = [];
    passCase.push("ca ");
    passCase.push("forward 50");
    for (i=0;i<passCase.length-1;i++) {
        if(org.weblogo.outputStream[i] != passCase[i]) {
            throw new Error("Test1 Failed at element "+i);
        }
    }
    if (passCase.length != org.weblogo.outputStream.length) {
        throw new Error("Test1 Failed at length check.");
    }        
    console.info("passed.");
}
function testCase2() {
    var testCase = '\
ca() \
x = 100 \
fun = function () { \
forward x \
} \
fun()';

    org.weblogo.compilerdriver(grammar.parse(testCase));
   
    var passCase = [];
    passCase.push("ca ");
    passCase.push("forward 100");

    for (i=0;i<passCase.length-1;i++) {
        if(org.weblogo.outputStream[i] != passCase[i]) {
            throw new Error("Test2 Failed at element "+i);
        }
    }
    if (passCase.length != org.weblogo.outputStream.length) {
        throw new Error("Test2 Failed at length check.");
    }        
    console.info("passed.");
}





}());
