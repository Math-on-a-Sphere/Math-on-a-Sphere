var org = org || {};
org.weblogo = {};

(function() {

org.weblogo.mult = function(m, v) {
    return [
       m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] + v[2],
       m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] + v[2],
       m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] + v[2],
    ];
};

org.weblogo.add = function(a, b) {
    return [ a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

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
    serverStatus: ".flc-math-serverStatus"
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

org.weblogo.stub = function(container, options) {
  
    var period = 1500;
    var radius = 50;
  
    var that = {};
    that.locate = org.weblogo.binder(container, org.weblogo.selectors).locate;
    that.receiveBlob = function(blob) {
        that.locate("frameSize").text(blob.size);
    };
    
    that.draw = function() {
        var now = Date.now();
        var phase = (now - that.initTime) / period;
        var x = radius * Math.cos(phase);
        var y = radius * Math.sin(phase);
        var shift = org.weblogo.mult(org.weblogo.colshift, [x, y, 0]);
        shift = org.weblogo.add(shift, [128, 128, 128]);
        var colour = "rgb(" + Math.round(shift[0]) + "," + Math.round(shift[1]) + "," + Math.round(shift[2]) + ")";
        
        that.context.fillStyle = colour;
        that.context.fillRect(0, 0, that.width, that.height);
       
        that.context.fillStyle = "white";

        that.context.fillText("Frame time: " + (now - that.initTime)/1000 + "s", 0, that.height / 2);
       
        var url = that.element.toDataURL("image/png");
        org.weblogo.postImage("Frame Time: " + now - that.initTime, url, "server/postreceive", that);
        
        that.locate("frameSize").text(url.length);
        
        ++that.frameNo;
        that.locate("frameNumber").text(that.frameNo);
        var rate = 1000.0 / (now - that.lastFrame);
        that.locate("frameRate").text(rate.toFixed(2));
        that.locate("dataRate").text((url.length * rate / 1000).toFixed(1));
        that.lastFrame = now;
    }
    
    that.start = function() {
        that.initTime = Date.now();
        that.lastFrame = that.initTime;
        that.element = that.locate("canvas")[0];
        that.context = that.element.getContext('2d');
        
        that.context.font = "50px Arial";
        
        that.width = that.element.width;
        that.height = that.element.height;
        that.intervalID = window.setInterval(that.draw, 33);
        that.frameNo = 0;
    };
    
    that.stop = function() {
        if (that.intervalID) {
            window.clearInterval(that.intervalID);
            delete that.intervalID;
        }
    }
    
    that.locate("start").click(that.start);
    that.locate("stop").click(that.stop);
    
    return that;
}

}());