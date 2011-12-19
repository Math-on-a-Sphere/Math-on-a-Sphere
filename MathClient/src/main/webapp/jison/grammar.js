/* Jison generated parser */
var grammar = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"file":3,"weblogo_schema":4,"EOF":5,"block":6,"nodes":7,"{":8,"}":9,"node":10,"assignment":11,"func":12,"exp":13,"command":14,"value":15,"(":16,")":17,"SET":18,"accessor":19,"REPEAT":20,"ACCESSOR":21,"identifier":22,"=":23,"FUNCTION":24,"IDENTIFIER":25,"string":26,"STRING_LIT":27,"number":28,"NUMBER":29,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"{",9:"}",16:"(",17:")",18:"SET",20:"REPEAT",21:"ACCESSOR",23:"=",24:"FUNCTION",25:"IDENTIFIER",27:"STRING_LIT",29:"NUMBER"},
productions_: [0,[3,2],[4,1],[4,1],[6,3],[7,2],[7,1],[10,1],[10,1],[12,2],[12,1],[13,1],[13,2],[14,3],[14,3],[19,1],[11,3],[11,6],[22,1],[26,1],[28,1],[15,1],[15,1],[15,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:return $$[$0-1];
break;
case 4:this.$ = {};
    this.$['type'] = 'block';
    this.$['value'] = $$[$0-1];
break;
case 5:this.$ = $$[$0]; 
    $$[$0].unshift($$[$0-1]);
break;
case 6:this.$ = [$$[$0]];
break;
case 9:this.$ = {};
    this.$['type'] = 'func';
    this.$['args'] = [$$[$0-1], $$[$0]];
break;
case 10:this.$ = {};
    this.$['type'] = 'specialCommand';
    this.$['value'] = $$[$0];
break;
case 12:this.$ = {};
    this.$['type'] = 'list';
break;
case 13:this.$ = {}; 
    this.$['type'] = 'command'; 
    this.$['command'] = $$[$0-2];
    this.$['args'] = [$$[$0-1], $$[$0]];
break;
case 14:this.$ = {}; 
    this.$['type'] = 'keyword'; 
    this.$['command'] = $$[$0-2];
    this.$['args'] = [$$[$0-1], $$[$0]];
break;
case 15:this.$ = {};
    this.$['type'] = 'accessor';
    this.$['value'] = $$[$0];
break;
case 16:this.$ = {};
    this.$['type'] = 'var_assign';
    this.$['id'] = $$[$0-2];
    this.$['value'] = $$[$0];
break;
case 17:this.$ = {};
    this.$['type'] = 'fun_assign';
    this.$['id'] = $$[$0-5];
    this.$['args'] = [];
    this.$['value'] = $$[$0];
break;
case 18:this.$ = yytext;
break;
case 19:this.$ = yytext;
break;
case 20:this.$ = Number(yytext);
break;
case 21:this.$ = {};
    this.$['type'] = 'identifier';
    this.$['value'] = $$[$0];
break;
case 22:this.$ = {};
    this.$['type'] = 'number';
    this.$['value'] = $$[$0];
break;
case 23:this.$ = {};
    this.$['type'] = 'string';
    this.$['value'] = $$[$0];
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:[1,5],10:6,11:7,12:8,13:10,14:11,15:13,16:[1,14],18:[1,15],20:[1,16],22:9,25:[1,12],26:18,27:[1,20],28:17,29:[1,19]},{1:[3]},{5:[1,21]},{5:[2,2]},{5:[2,3]},{7:22,10:6,11:7,12:8,13:10,14:11,15:13,16:[1,14],18:[1,15],20:[1,16],22:9,25:[1,12],26:18,27:[1,20],28:17,29:[1,19]},{5:[2,6],7:23,9:[2,6],10:6,11:7,12:8,13:10,14:11,15:13,16:[1,14],18:[1,15],20:[1,16],22:9,25:[1,12],26:18,27:[1,20],28:17,29:[1,19]},{5:[2,7],9:[2,7],16:[2,7],18:[2,7],20:[2,7],25:[2,7],27:[2,7],29:[2,7]},{5:[2,8],9:[2,8],16:[2,8],18:[2,8],20:[2,8],25:[2,8],27:[2,8],29:[2,8]},{16:[2,21],23:[1,24],25:[2,21],27:[2,21],29:[2,21]},{13:25,15:13,16:[1,14],22:26,25:[1,12],26:18,27:[1,20],28:17,29:[1,19]},{5:[2,10],9:[2,10],16:[2,10],18:[2,10],20:[2,10],25:[2,10],27:[2,10],29:[2,10]},{5:[2,18],8:[2,18],9:[2,18],16:[2,18],18:[2,18],20:[2,18],23:[2,18],25:[2,18],27:[2,18],29:[2,18]},{5:[2,11],9:[2,11],16:[2,11],18:[2,11],20:[2,11],25:[2,11],27:[2,11],29:[2,11]},{17:[1,27]},{19:28,21:[1,29]},{15:30,22:26,25:[1,12],26:18,27:[1,20],28:17,29:[1,19]},{5:[2,22],8:[2,22],9:[2,22],16:[2,22],18:[2,22],20:[2,22],25:[2,22],27:[2,22],29:[2,22]},{5:[2,23],8:[2,23],9:[2,23],16:[2,23],18:[2,23],20:[2,23],25:[2,23],27:[2,23],29:[2,23]},{5:[2,20],8:[2,20],9:[2,20],16:[2,20],18:[2,20],20:[2,20],25:[2,20],27:[2,20],29:[2,20]},{5:[2,19],8:[2,19],9:[2,19],16:[2,19],18:[2,19],20:[2,19],25:[2,19],27:[2,19],29:[2,19]},{1:[2,1]},{9:[1,31]},{5:[2,5],9:[2,5]},{15:32,22:26,24:[1,33],25:[1,12],26:18,27:[1,20],28:17,29:[1,19]},{5:[2,9],9:[2,9],16:[2,9],18:[2,9],20:[2,9],25:[2,9],27:[2,9],29:[2,9]},{5:[2,21],8:[2,21],9:[2,21],16:[2,21],18:[2,21],20:[2,21],25:[2,21],27:[2,21],29:[2,21]},{5:[2,12],9:[2,12],16:[2,12],18:[2,12],20:[2,12],25:[2,12],27:[2,12],29:[2,12]},{15:34,22:26,25:[1,12],26:18,27:[1,20],28:17,29:[1,19]},{25:[2,15],27:[2,15],29:[2,15]},{6:35,8:[1,5]},{5:[2,4],9:[2,4],16:[2,4],18:[2,4],20:[2,4],25:[2,4],27:[2,4],29:[2,4]},{5:[2,16],9:[2,16],16:[2,16],18:[2,16],20:[2,16],25:[2,16],27:[2,16],29:[2,16]},{16:[1,36]},{5:[2,13],9:[2,13],16:[2,13],18:[2,13],20:[2,13],25:[2,13],27:[2,13],29:[2,13]},{5:[2,14],9:[2,14],16:[2,14],18:[2,14],20:[2,14],25:[2,14],27:[2,14],29:[2,14]},{17:[1,37]},{6:38,8:[1,5]},{5:[2,17],9:[2,17],16:[2,17],18:[2,17],20:[2,17],25:[2,17],27:[2,17],29:[2,17]}],
defaultActions: {3:[2,2],4:[2,3],21:[2,1]},
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
case 10:return 16
break;
case 11:return 17
break;
case 12:return 8
break;
case 13:return 9
break;
case 14:return 'PI'
break;
case 15:return 18
break;
case 16:return 21
break;
case 17:return 20
break;
case 18:return 24
break;
case 19:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 27;
break;
case 20:return 29;
break;
case 21:return 25
break;
case 22:return 23
break;
case 23:return 5
break;
case 24:return 'INVALID'
break;
}
};
lexer.rules = [/^\s+/,/^\/\/[^\n]*/,/^#[^\n]*/,/^\*/,/^\//,/^-/,/^\+/,/^\^/,/^!/,/^%/,/^\(/,/^\)/,/^\{/,/^\}/,/^PI\b/,/^(set)/,/^(color|pen-size)/,/^(repeat|REPEAT)/,/^(function)/,/^"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,/^-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,/^[a-zA-Z]+([a-zA-Z_]*)?\b/,/^=/,/^$/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],"inclusive":true}};return lexer;})()
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