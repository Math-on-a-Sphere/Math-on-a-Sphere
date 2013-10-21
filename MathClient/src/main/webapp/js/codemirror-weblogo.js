CodeMirror.defineMode("weblogo", function () {
    var builtin_null = /(clearall|ca|cleardrawing|ca|penup|pu|pendown|pd|getheading|gh|getposition|gp|getspeed|help)$/;
    var builtin_arg = /(forward|fd|back|bk|left|lt|right|rt|setheading|sh|towards|distanceto|setposition|setpos|sp|setspeed|print)$/;
    var keyword = /(repeat|if|else|return|function|set|each|transform|true|false|PI|E)$/;
    return {
        token: function (stream) {
            var ch = stream.next();
            if (ch === "#" || ch === "/" && stream.eat("/")) {
                stream.skipToEnd();
                return "comment";
            }
            stream.backUp(1);
            stream.eatWhile(/\W/);
            if (stream.current().length > 0) {
                return null;
            }
            stream.eatWhile(/\w/);
            var cur = stream.current();
            if (builtin_null.test(cur) || builtin_arg.test(cur)) {
                return "builtin";
            }
            if (keyword.test(cur)) {
                return "keyword";
            }
            return null;
        }
    }
});