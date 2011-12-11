/* Jison generated parser */
var grammar = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"file":3,"weblogo_schema":4,"EOF":5,"statements":6,"statement":7,"variable_declaration":8,"command":9,"FORWARD":10,"value":11,"RIGHT":12,"LEFT":13,"BACK":14,"CLEARALL":15,"CLEARDRAWING":16,"DEMO":17,"GETHEADING":18,"PENUP":19,"PENDOWN":20,"SET":21,"accessor":22,"SETHEADING":23,"SETPOS":24,"TESTCARD":25,"TESTHEADING":26,"REPEAT":27,"{":28,"}":29,"IDENTIFIER":30,"=":31,"ACCESSOR":32,"identifier":33,"string":34,"STRING_LIT":35,"number":36,"NUMBER":37,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",10:"FORWARD",12:"RIGHT",13:"LEFT",14:"BACK",15:"CLEARALL",16:"CLEARDRAWING",17:"DEMO",18:"GETHEADING",19:"PENUP",20:"PENDOWN",21:"SET",23:"SETHEADING",24:"SETPOS",25:"TESTCARD",26:"TESTHEADING",27:"REPEAT",28:"{",29:"}",30:"IDENTIFIER",31:"=",32:"ACCESSOR",35:"STRING_LIT",37:"NUMBER"},
productions_: [0,[3,2],[4,1],[6,2],[6,1],[7,1],[7,1],[9,2],[9,2],[9,2],[9,2],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,3],[9,2],[9,3],[9,1],[9,1],[9,5],[8,3],[22,1],[33,1],[34,1],[36,1],[11,1],[11,1],[11,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:return $$[$0-1];
break;
case 3:this.$ = $$[$0]; $$[$0].unshift($$[$0-1]);
break;
case 4:this.$ = [$$[$0]];
break;
case 7:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0-1];
    this.$['args'] = [$$[$0]];
break;
case 8:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0-1];
    this.$['args'] = [$$[$0]];
break;
case 9:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0-1];
    this.$['args'] = [$$[$0]];
break;
case 10:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0-1];
    this.$['args'] = [$$[$0]];
break;
case 11:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0];
    this.$['args'] = [];
break;
case 12:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0];
    this.$['args'] = [];
break;
case 13:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0];
    this.$['args'] = [];
break;
case 14:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0];
    this.$['args'] = [];
break;
case 15:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0];
    this.$['args'] = [];
break;
case 16:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0];
    this.$['args'] = [];
break;
case 17:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0-2];
    this.$['args'] = [$$[$0-1], $$[$0]];
break;
case 18:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0-1];
    this.$['args'] = [$$[$0]];
break;
case 19:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0-2];
    this.$['args'] = [$$[$0-1], $$[$0]];
break;
case 20:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0];
    this.$['args'] = [];
break;
case 21:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0];
    this.$['args'] = [];
break;
case 22:this.$ = {}; 
    this.$['type'] = 'keyword'; 
    this.$['command'] = $$[$0-4];
    this.$['args'] = [$$[$0-3], $$[$0-1]];
break;
case 23:this.$ = {};
    this.$['type'] = 'assign';
    this.$['args'] = [$$[$0-2], $$[$0]];
break;
case 24:this.$ = {};
    this.$['type'] = 'accessor';
    this.$['value'] = $$[$0];
break;
case 25:this.$ = yytext;
break;
case 26:this.$ = yytext;
break;
case 27:this.$ = Number(yytext);
break;
case 28:this.$ = {};
    this.$['type'] = 'identifier';
    this.$['value'] = $$[$0];
break;
case 29:this.$ = {};
    this.$['type'] = 'number';
    this.$['value'] = $$[$0];
break;
case 30:this.$ = {};
    this.$['type'] = 'string';
    this.$['value'] = $$[$0];
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:5,9:6,10:[1,8],12:[1,9],13:[1,10],14:[1,11],15:[1,12],16:[1,13],17:[1,14],18:[1,15],19:[1,16],20:[1,17],21:[1,18],23:[1,19],24:[1,20],25:[1,21],26:[1,22],27:[1,23],30:[1,7]},{1:[3]},{5:[1,24]},{5:[2,2]},{5:[2,4],6:25,7:4,8:5,9:6,10:[1,8],12:[1,9],13:[1,10],14:[1,11],15:[1,12],16:[1,13],17:[1,14],18:[1,15],19:[1,16],20:[1,17],21:[1,18],23:[1,19],24:[1,20],25:[1,21],26:[1,22],27:[1,23],29:[2,4],30:[1,7]},{5:[2,5],10:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[2,5],17:[2,5],18:[2,5],19:[2,5],20:[2,5],21:[2,5],23:[2,5],24:[2,5],25:[2,5],26:[2,5],27:[2,5],29:[2,5],30:[2,5]},{5:[2,6],10:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[2,6],17:[2,6],18:[2,6],19:[2,6],20:[2,6],21:[2,6],23:[2,6],24:[2,6],25:[2,6],26:[2,6],27:[2,6],29:[2,6],30:[2,6]},{31:[1,26]},{11:27,30:[1,31],33:28,34:30,35:[1,33],36:29,37:[1,32]},{11:34,30:[1,31],33:28,34:30,35:[1,33],36:29,37:[1,32]},{11:35,30:[1,31],33:28,34:30,35:[1,33],36:29,37:[1,32]},{11:36,30:[1,31],33:28,34:30,35:[1,33],36:29,37:[1,32]},{5:[2,11],10:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],17:[2,11],18:[2,11],19:[2,11],20:[2,11],21:[2,11],23:[2,11],24:[2,11],25:[2,11],26:[2,11],27:[2,11],29:[2,11],30:[2,11]},{5:[2,12],10:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],17:[2,12],18:[2,12],19:[2,12],20:[2,12],21:[2,12],23:[2,12],24:[2,12],25:[2,12],26:[2,12],27:[2,12],29:[2,12],30:[2,12]},{5:[2,13],10:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],17:[2,13],18:[2,13],19:[2,13],20:[2,13],21:[2,13],23:[2,13],24:[2,13],25:[2,13],26:[2,13],27:[2,13],29:[2,13],30:[2,13]},{5:[2,14],10:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],17:[2,14],18:[2,14],19:[2,14],20:[2,14],21:[2,14],23:[2,14],24:[2,14],25:[2,14],26:[2,14],27:[2,14],29:[2,14],30:[2,14]},{5:[2,15],10:[2,15],12:[2,15],13:[2,15],14:[2,15],15:[2,15],16:[2,15],17:[2,15],18:[2,15],19:[2,15],20:[2,15],21:[2,15],23:[2,15],24:[2,15],25:[2,15],26:[2,15],27:[2,15],29:[2,15],30:[2,15]},{5:[2,16],10:[2,16],12:[2,16],13:[2,16],14:[2,16],15:[2,16],16:[2,16],17:[2,16],18:[2,16],19:[2,16],20:[2,16],21:[2,16],23:[2,16],24:[2,16],25:[2,16],26:[2,16],27:[2,16],29:[2,16],30:[2,16]},{22:37,32:[1,38]},{11:39,30:[1,31],33:28,34:30,35:[1,33],36:29,37:[1,32]},{11:40,30:[1,31],33:28,34:30,35:[1,33],36:29,37:[1,32]},{5:[2,20],10:[2,20],12:[2,20],13:[2,20],14:[2,20],15:[2,20],16:[2,20],17:[2,20],18:[2,20],19:[2,20],20:[2,20],21:[2,20],23:[2,20],24:[2,20],25:[2,20],26:[2,20],27:[2,20],29:[2,20],30:[2,20]},{5:[2,21],10:[2,21],12:[2,21],13:[2,21],14:[2,21],15:[2,21],16:[2,21],17:[2,21],18:[2,21],19:[2,21],20:[2,21],21:[2,21],23:[2,21],24:[2,21],25:[2,21],26:[2,21],27:[2,21],29:[2,21],30:[2,21]},{11:41,30:[1,31],33:28,34:30,35:[1,33],36:29,37:[1,32]},{1:[2,1]},{5:[2,3],29:[2,3]},{11:42,30:[1,31],33:28,34:30,35:[1,33],36:29,37:[1,32]},{5:[2,7],10:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[2,7],17:[2,7],18:[2,7],19:[2,7],20:[2,7],21:[2,7],23:[2,7],24:[2,7],25:[2,7],26:[2,7],27:[2,7],29:[2,7],30:[2,7]},{5:[2,28],10:[2,28],12:[2,28],13:[2,28],14:[2,28],15:[2,28],16:[2,28],17:[2,28],18:[2,28],19:[2,28],20:[2,28],21:[2,28],23:[2,28],24:[2,28],25:[2,28],26:[2,28],27:[2,28],28:[2,28],29:[2,28],30:[2,28],35:[2,28],37:[2,28]},{5:[2,29],10:[2,29],12:[2,29],13:[2,29],14:[2,29],15:[2,29],16:[2,29],17:[2,29],18:[2,29],19:[2,29],20:[2,29],21:[2,29],23:[2,29],24:[2,29],25:[2,29],26:[2,29],27:[2,29],28:[2,29],29:[2,29],30:[2,29],35:[2,29],37:[2,29]},{5:[2,30],10:[2,30],12:[2,30],13:[2,30],14:[2,30],15:[2,30],16:[2,30],17:[2,30],18:[2,30],19:[2,30],20:[2,30],21:[2,30],23:[2,30],24:[2,30],25:[2,30],26:[2,30],27:[2,30],28:[2,30],29:[2,30],30:[2,30],35:[2,30],37:[2,30]},{5:[2,25],10:[2,25],12:[2,25],13:[2,25],14:[2,25],15:[2,25],16:[2,25],17:[2,25],18:[2,25],19:[2,25],20:[2,25],21:[2,25],23:[2,25],24:[2,25],25:[2,25],26:[2,25],27:[2,25],28:[2,25],29:[2,25],30:[2,25],35:[2,25],37:[2,25]},{5:[2,27],10:[2,27],12:[2,27],13:[2,27],14:[2,27],15:[2,27],16:[2,27],17:[2,27],18:[2,27],19:[2,27],20:[2,27],21:[2,27],23:[2,27],24:[2,27],25:[2,27],26:[2,27],27:[2,27],28:[2,27],29:[2,27],30:[2,27],35:[2,27],37:[2,27]},{5:[2,26],10:[2,26],12:[2,26],13:[2,26],14:[2,26],15:[2,26],16:[2,26],17:[2,26],18:[2,26],19:[2,26],20:[2,26],21:[2,26],23:[2,26],24:[2,26],25:[2,26],26:[2,26],27:[2,26],28:[2,26],29:[2,26],30:[2,26],35:[2,26],37:[2,26]},{5:[2,8],10:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[2,8],17:[2,8],18:[2,8],19:[2,8],20:[2,8],21:[2,8],23:[2,8],24:[2,8],25:[2,8],26:[2,8],27:[2,8],29:[2,8],30:[2,8]},{5:[2,9],10:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[2,9],17:[2,9],18:[2,9],19:[2,9],20:[2,9],21:[2,9],23:[2,9],24:[2,9],25:[2,9],26:[2,9],27:[2,9],29:[2,9],30:[2,9]},{5:[2,10],10:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[2,10],17:[2,10],18:[2,10],19:[2,10],20:[2,10],21:[2,10],23:[2,10],24:[2,10],25:[2,10],26:[2,10],27:[2,10],29:[2,10],30:[2,10]},{11:43,30:[1,31],33:28,34:30,35:[1,33],36:29,37:[1,32]},{30:[2,24],35:[2,24],37:[2,24]},{5:[2,18],10:[2,18],12:[2,18],13:[2,18],14:[2,18],15:[2,18],16:[2,18],17:[2,18],18:[2,18],19:[2,18],20:[2,18],21:[2,18],23:[2,18],24:[2,18],25:[2,18],26:[2,18],27:[2,18],29:[2,18],30:[2,18]},{11:44,30:[1,31],33:28,34:30,35:[1,33],36:29,37:[1,32]},{28:[1,45]},{5:[2,23],10:[2,23],12:[2,23],13:[2,23],14:[2,23],15:[2,23],16:[2,23],17:[2,23],18:[2,23],19:[2,23],20:[2,23],21:[2,23],23:[2,23],24:[2,23],25:[2,23],26:[2,23],27:[2,23],29:[2,23],30:[2,23]},{5:[2,17],10:[2,17],12:[2,17],13:[2,17],14:[2,17],15:[2,17],16:[2,17],17:[2,17],18:[2,17],19:[2,17],20:[2,17],21:[2,17],23:[2,17],24:[2,17],25:[2,17],26:[2,17],27:[2,17],29:[2,17],30:[2,17]},{5:[2,19],10:[2,19],12:[2,19],13:[2,19],14:[2,19],15:[2,19],16:[2,19],17:[2,19],18:[2,19],19:[2,19],20:[2,19],21:[2,19],23:[2,19],24:[2,19],25:[2,19],26:[2,19],27:[2,19],29:[2,19],30:[2,19]},{6:46,7:4,8:5,9:6,10:[1,8],12:[1,9],13:[1,10],14:[1,11],15:[1,12],16:[1,13],17:[1,14],18:[1,15],19:[1,16],20:[1,17],21:[1,18],23:[1,19],24:[1,20],25:[1,21],26:[1,22],27:[1,23],30:[1,7]},{29:[1,47]},{5:[2,22],10:[2,22],12:[2,22],13:[2,22],14:[2,22],15:[2,22],16:[2,22],17:[2,22],18:[2,22],19:[2,22],20:[2,22],21:[2,22],23:[2,22],24:[2,22],25:[2,22],26:[2,22],27:[2,22],29:[2,22],30:[2,22]}],
defaultActions: {3:[2,2],24:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:/* skip comment */
break;
case 2:/* skip comment */
break;
case 3:return '*'
break;
case 4:return '/'
break;
case 5:return '-'
break;
case 6:return '+'
break;
case 7:return '^'
break;
case 8:return '!'
break;
case 9:return '%'
break;
case 10:return '('
break;
case 11:return ')'
break;
case 12:return 28
break;
case 13:return 29
break;
case 14:return 'PI'
break;
case 15:return 10
break;
case 16:return 12
break;
case 17:return 13
break;
case 18:return 14
break;
case 19:return 15
break;
case 20:return 16
break;
case 21:return 17
break;
case 22:return 18
break;
case 23:return 19
break;
case 24:return 20
break;
case 25:return 21
break;
case 26:return 23
break;
case 27:return 24
break;
case 28:return 25
break;
case 29:return 26
break;
case 30:return 32
break;
case 31:return 27
break;
case 32:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 35;
break;
case 33:return 37;
break;
case 34:return 30
break;
case 35:return 31
break;
case 36:return 5
break;
case 37:return 'INVALID'
break;
}
};
lexer.rules = [/^\s+/,/^\/\/[^\n]*/,/^#[^\n]*/,/^\*/,/^\//,/^-/,/^\+/,/^\^/,/^!/,/^%/,/^\(/,/^\)/,/^\{/,/^\}/,/^PI\b/,/^(FORWARD|forward|fd)\b/,/^(RIGHT|right|rt)\b/,/^(LEFT|left|lt)\b/,/^(back|bk|BACK)\b/,/^(ca|clear-all)\b/,/^(cd|clear-drawing)\b/,/^(demo)\b/,/^(getheading)/,/^(penup|pen-up)/,/^(pendown|pen-down)/,/^(set)/,/^(setheading)/,/^(setpos|sp)/,/^(test-card)/,/^(test-heading)/,/^(color|pen-size)/,/^(repeat|REPEAT)/,/^"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,/^-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,/^[a-zA-Z]+([a-zA-Z_]*)?\b/,/^=/,/^$/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = grammar;
exports.parse = function () { return grammar.parse.apply(grammar, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}