/* lexical grammar */
%lex
digit                       [0-9]
esc                         "\\"
int                         "-"?(?:[0-9]|[1-9][0-9]+)
exp                         (?:[eE][-+]?[0-9]+)
frac                        (?:\.[0-9]+)

%%
\s+                                /* skip whitespace */
\/\/[^\n]*                         /* skip comment */
\#[^\n]*                           /* skip comment */
"*"                                return '*'
"/"                                return '/'
"-"                                return '-'
"+"                                return '+'
"^"                                return '^'
"!"                                return '!'
"%"                                return '%'
"("                                return '('
")"                                return ')'
"{"                                return '{'
"}"                                return '}'
"PI"                               return 'PI'
("FORWARD"|"forward"|"fd")\b       return 'FORWARD'
("RIGHT"|"right"|"rt")\b           return 'RIGHT'
("LEFT"|"left"|"lt")\b             return 'LEFT'
("back"|"bk"|"BACK")\b             return 'BACK'
("ca"|"clear-all")\b               return 'CLEARALL'
("cd"|"clear-drawing")\b           return 'CLEARDRAWING'
("demo")\b                         return 'DEMO'
("getheading")                     return 'GETHEADING'
("penup"|"pen-up")                 return 'PENUP'
("pendown"|"pen-down")             return 'PENDOWN'
("set")                            return 'SET'
("setheading")                     return 'SETHEADING'
("setpos"|"sp")                    return 'SETPOS'
("test-card")                      return 'TESTCARD'
("test-heading")                   return 'TESTHEADING'
("color"|"pen-size")               return 'ACCESSOR'
("repeat"|"REPEAT")                return 'REPEAT'
\"(?:{esc}["bfnrt/{esc}]|{esc}"u"[a-fA-F0-9]{4}|[^"{esc}])*\"  yytext = yytext.substr(1,yyleng-2); return 'STRING_LIT';
{int}{frac}?{exp}?\b               return 'NUMBER';
[a-zA-Z]+([a-zA-Z_]*)?\b           return 'IDENTIFIER'
"="                                return '='
<<EOF>>                            return 'EOF'
.                                  return 'INVALID'
/lex

%%
file
: weblogo_schema EOF
{return $1;}
;

weblogo_schema
: statements
;

statements
: statement statements
  {$$ = $2; $2.unshift($1);}
| statement
  {$$ = [$1];}
;

statement
: variable_declaration
| command
;

command
: FORWARD value
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [$2];}
| RIGHT value
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [$2];}
| LEFT value
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [$2];}
| BACK value
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [$2];}
| CLEARALL
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [];}
| CLEARDRAWING
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [];}
| DEMO
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [];}
| GETHEADING
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [];}
| PENUP
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [];}
| PENDOWN
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [];}
| SET accessor value
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [$2, $3];}
| SETHEADING value
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [$2];}
| SETPOS value value
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [$2, $3];}
| TESTCARD
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [];}
| TESTHEADING
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [];}
| REPEAT value '{' statements '}'
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [$2, $4];}
;

variable_declaration
: IDENTIFIER '=' value
  {$$ = {};
    $$['type'] = 'assign';
    $$['args'] = [$1, $3];}
;

accessor
: ACCESSOR
  {$$ = {};
    $$['type'] = 'accessor';
    $$['value'] = $1;}
;

identifier
: IDENTIFIER
  {$$ = yytext;}
;

string
: STRING_LIT
  {$$ = yytext;}
;

number
: NUMBER
  {$$ = Number(yytext);}
;

value
: identifier
  {$$ = {};
    $$['type'] = 'identifier';
    $$['value'] = $1;}
| number
  {$$ = {};
    $$['type'] = 'number';
    $$['value'] = $1;}
| string
  {$$ = {};
    $$['type'] = 'string';
    $$['value'] = $1;}
;


