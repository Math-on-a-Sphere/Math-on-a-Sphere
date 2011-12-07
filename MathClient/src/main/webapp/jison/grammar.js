/* Jison generated parser */
var grammar = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"file":3,"weblogo_schema":4,"EOF":5,"commands":6,"command":7,"FORWARD":8,"value":9,"RIGHT":10,"LEFT":11,"BACK":12,"CLEARALL":13,"CLEARDRAWING":14,"DEMO":15,"GETHEADING":16,"PENUP":17,"PENDOWN":18,"SET":19,"accessor":20,"SETHEADING":21,"SETPOS":22,"TESTCARD":23,"TESTHEADING":24,"REPEAT":25,"{":26,"}":27,"ACCESSOR":28,"string":29,"IDENTIFIER":30,"number":31,"NUMBER":32,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"FORWARD",10:"RIGHT",11:"LEFT",12:"BACK",13:"CLEARALL",14:"CLEARDRAWING",15:"DEMO",16:"GETHEADING",17:"PENUP",18:"PENDOWN",19:"SET",21:"SETHEADING",22:"SETPOS",23:"TESTCARD",24:"TESTHEADING",25:"REPEAT",26:"{",27:"}",28:"ACCESSOR",30:"IDENTIFIER",32:"NUMBER"},
productions_: [0,[3,2],[4,1],[6,2],[6,1],[7,2],[7,2],[7,2],[7,2],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,3],[7,2],[7,3],[7,1],[7,1],[7,5],[20,1],[29,1],[31,1],[9,1],[9,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:return $$[$0-1];
break;
case 3:this.$ = $$[$0]; $$[$0].unshift($$[$0-1]);
break;
case 4:this.$ = [$$[$0]];
break;
case 5:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0-1];
    this.$['args'] = [$$[$0]];
break;
case 6:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0-1];
    this.$['args'] = [$$[$0]];
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
    this.$['command'] = $$[$0];
    this.$['args'] = [];
break;
case 10:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0];
    this.$['args'] = [];
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
    this.$['command'] = $$[$0-2];
    this.$['args'] = [$$[$0-1], $$[$0]];
break;
case 16:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0-1];
    this.$['args'] = [$$[$0]];
break;
case 17:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0-2];
    this.$['args'] = [$$[$0-1], $$[$0]];
break;
case 18:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0];
    this.$['args'] = [];
break;
case 19:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0];
    this.$['args'] = [];
break;
case 20:this.$ = {}; 
    this.$['type'] = 'keyword'; 
    this.$['command'] = $$[$0-4];
    this.$['args'] = [$$[$0-3], $$[$0-1]];
break;
case 21:this.$ = {};
    this.$['type'] = 'accessor';
    this.$['value'] = $$[$0];
break;
case 22:this.$ = yytext;
break;
case 23:this.$ = Number(yytext);
break;
case 24:this.$ = {};
    this.$['type'] = 'string';
    this.$['value'] = $$[$0];
break;
case 25:this.$ = {};
    this.$['type'] = 'number';
    this.$['value'] = $$[$0];
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:[1,5],10:[1,6],11:[1,7],12:[1,8],13:[1,9],14:[1,10],15:[1,11],16:[1,12],17:[1,13],18:[1,14],19:[1,15],21:[1,16],22:[1,17],23:[1,18],24:[1,19],25:[1,20]},{1:[3]},{5:[1,21]},{5:[2,2]},{5:[2,4],6:22,7:4,8:[1,5],10:[1,6],11:[1,7],12:[1,8],13:[1,9],14:[1,10],15:[1,11],16:[1,12],17:[1,13],18:[1,14],19:[1,15],21:[1,16],22:[1,17],23:[1,18],24:[1,19],25:[1,20],27:[2,4]},{9:23,29:24,30:[1,26],31:25,32:[1,27]},{9:28,29:24,30:[1,26],31:25,32:[1,27]},{9:29,29:24,30:[1,26],31:25,32:[1,27]},{9:30,29:24,30:[1,26],31:25,32:[1,27]},{5:[2,9],8:[2,9],10:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[2,9],17:[2,9],18:[2,9],19:[2,9],21:[2,9],22:[2,9],23:[2,9],24:[2,9],25:[2,9],27:[2,9]},{5:[2,10],8:[2,10],10:[2,10],11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[2,10],17:[2,10],18:[2,10],19:[2,10],21:[2,10],22:[2,10],23:[2,10],24:[2,10],25:[2,10],27:[2,10]},{5:[2,11],8:[2,11],10:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],17:[2,11],18:[2,11],19:[2,11],21:[2,11],22:[2,11],23:[2,11],24:[2,11],25:[2,11],27:[2,11]},{5:[2,12],8:[2,12],10:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],17:[2,12],18:[2,12],19:[2,12],21:[2,12],22:[2,12],23:[2,12],24:[2,12],25:[2,12],27:[2,12]},{5:[2,13],8:[2,13],10:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],17:[2,13],18:[2,13],19:[2,13],21:[2,13],22:[2,13],23:[2,13],24:[2,13],25:[2,13],27:[2,13]},{5:[2,14],8:[2,14],10:[2,14],11:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],17:[2,14],18:[2,14],19:[2,14],21:[2,14],22:[2,14],23:[2,14],24:[2,14],25:[2,14],27:[2,14]},{20:31,28:[1,32]},{9:33,29:24,30:[1,26],31:25,32:[1,27]},{9:34,29:24,30:[1,26],31:25,32:[1,27]},{5:[2,18],8:[2,18],10:[2,18],11:[2,18],12:[2,18],13:[2,18],14:[2,18],15:[2,18],16:[2,18],17:[2,18],18:[2,18],19:[2,18],21:[2,18],22:[2,18],23:[2,18],24:[2,18],25:[2,18],27:[2,18]},{5:[2,19],8:[2,19],10:[2,19],11:[2,19],12:[2,19],13:[2,19],14:[2,19],15:[2,19],16:[2,19],17:[2,19],18:[2,19],19:[2,19],21:[2,19],22:[2,19],23:[2,19],24:[2,19],25:[2,19],27:[2,19]},{9:35,29:24,30:[1,26],31:25,32:[1,27]},{1:[2,1]},{5:[2,3],27:[2,3]},{5:[2,5],8:[2,5],10:[2,5],11:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[2,5],17:[2,5],18:[2,5],19:[2,5],21:[2,5],22:[2,5],23:[2,5],24:[2,5],25:[2,5],27:[2,5]},{5:[2,24],8:[2,24],10:[2,24],11:[2,24],12:[2,24],13:[2,24],14:[2,24],15:[2,24],16:[2,24],17:[2,24],18:[2,24],19:[2,24],21:[2,24],22:[2,24],23:[2,24],24:[2,24],25:[2,24],26:[2,24],27:[2,24],30:[2,24],32:[2,24]},{5:[2,25],8:[2,25],10:[2,25],11:[2,25],12:[2,25],13:[2,25],14:[2,25],15:[2,25],16:[2,25],17:[2,25],18:[2,25],19:[2,25],21:[2,25],22:[2,25],23:[2,25],24:[2,25],25:[2,25],26:[2,25],27:[2,25],30:[2,25],32:[2,25]},{5:[2,22],8:[2,22],10:[2,22],11:[2,22],12:[2,22],13:[2,22],14:[2,22],15:[2,22],16:[2,22],17:[2,22],18:[2,22],19:[2,22],21:[2,22],22:[2,22],23:[2,22],24:[2,22],25:[2,22],26:[2,22],27:[2,22],30:[2,22],32:[2,22]},{5:[2,23],8:[2,23],10:[2,23],11:[2,23],12:[2,23],13:[2,23],14:[2,23],15:[2,23],16:[2,23],17:[2,23],18:[2,23],19:[2,23],21:[2,23],22:[2,23],23:[2,23],24:[2,23],25:[2,23],26:[2,23],27:[2,23],30:[2,23],32:[2,23]},{5:[2,6],8:[2,6],10:[2,6],11:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[2,6],17:[2,6],18:[2,6],19:[2,6],21:[2,6],22:[2,6],23:[2,6],24:[2,6],25:[2,6],27:[2,6]},{5:[2,7],8:[2,7],10:[2,7],11:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[2,7],17:[2,7],18:[2,7],19:[2,7],21:[2,7],22:[2,7],23:[2,7],24:[2,7],25:[2,7],27:[2,7]},{5:[2,8],8:[2,8],10:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[2,8],17:[2,8],18:[2,8],19:[2,8],21:[2,8],22:[2,8],23:[2,8],24:[2,8],25:[2,8],27:[2,8]},{9:36,29:24,30:[1,26],31:25,32:[1,27]},{30:[2,21],32:[2,21]},{5:[2,16],8:[2,16],10:[2,16],11:[2,16],12:[2,16],13:[2,16],14:[2,16],15:[2,16],16:[2,16],17:[2,16],18:[2,16],19:[2,16],21:[2,16],22:[2,16],23:[2,16],24:[2,16],25:[2,16],27:[2,16]},{9:37,29:24,30:[1,26],31:25,32:[1,27]},{26:[1,38]},{5:[2,15],8:[2,15],10:[2,15],11:[2,15],12:[2,15],13:[2,15],14:[2,15],15:[2,15],16:[2,15],17:[2,15],18:[2,15],19:[2,15],21:[2,15],22:[2,15],23:[2,15],24:[2,15],25:[2,15],27:[2,15]},{5:[2,17],8:[2,17],10:[2,17],11:[2,17],12:[2,17],13:[2,17],14:[2,17],15:[2,17],16:[2,17],17:[2,17],18:[2,17],19:[2,17],21:[2,17],22:[2,17],23:[2,17],24:[2,17],25:[2,17],27:[2,17]},{6:39,7:4,8:[1,5],10:[1,6],11:[1,7],12:[1,8],13:[1,9],14:[1,10],15:[1,11],16:[1,12],17:[1,13],18:[1,14],19:[1,15],21:[1,16],22:[1,17],23:[1,18],24:[1,19],25:[1,20]},{27:[1,40]},{5:[2,20],8:[2,20],10:[2,20],11:[2,20],12:[2,20],13:[2,20],14:[2,20],15:[2,20],16:[2,20],17:[2,20],18:[2,20],19:[2,20],21:[2,20],22:[2,20],23:[2,20],24:[2,20],25:[2,20],27:[2,20]}],
defaultActions: {3:[2,2],21:[2,1]},
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
case 12:return 26
break;
case 13:return 27
break;
case 14:return 'PI'
break;
case 15:return 8
break;
case 16:return 10
break;
case 17:return 11
break;
case 18:return 12
break;
case 19:return 13
break;
case 20:return 14
break;
case 21:return 15
break;
case 22:return 16
break;
case 23:return 17
break;
case 24:return 18
break;
case 25:return 19
break;
case 26:return 21
break;
case 27:return 22
break;
case 28:return 23
break;
case 29:return 24
break;
case 30:return 28
break;
case 31:return 25
break;
case 32:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 'STRING_LIT';
break;
case 33:return 32;
break;
case 34:return 30
break;
case 35:return 5
break;
case 36:return 'INVALID'
break;
}
};
lexer.rules = [/^\s+/,/^\/\/[^\n]*/,/^#[^\n]*/,/^\*/,/^\//,/^-/,/^\+/,/^\^/,/^!/,/^%/,/^\(/,/^\)/,/^\{/,/^\}/,/^PI\b/,/^(FORWARD|forward|fd)\b/,/^(RIGHT|right|rt)\b/,/^(LEFT|left|lt)\b/,/^(back|bk|BACK)\b/,/^(ca|clear-all)\b/,/^(cd|clear-drawing)\b/,/^(demo)\b/,/^(getheading)/,/^(penup|pen-up)/,/^(pendown|pen-down)/,/^(set)/,/^(setheading)/,/^(setpos|sp)/,/^(test-card)/,/^(test-heading)/,/^(color|pen-size)/,/^(repeat|REPEAT)/,/^"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,/^-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,/^[a-zA-Z]+([a-zA-Z_]*)?\b/,/^$/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],"inclusive":true}};return lexer;})()
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