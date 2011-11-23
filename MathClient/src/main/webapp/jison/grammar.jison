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

\"(?:{esc}["bfnrt/{esc}]|{esc}"u"[a-fA-F0-9]{4}|[^"{esc}])*\"  yytext = yytext.substr(1,yyleng-2); return 'STRING_LIT';
{int}{frac}?{exp}?\b               return 'NUMBER';
[a-zA-Z]+([a-zA-Z_]*)?\b           return 'IDENTIFIER'
<<EOF>>                            return 'EOF'
.                                  return 'INVALID'
/lex

%%
file
: weblogo_schema EOF
{return $1;}
;

weblogo_schema
: commands
;

commands
: command commands
  {$$ = $2; $2.unshift($1);}
| command
  {$$ = [$1];}
;

command
: FORWARD value
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [$2[1]];}
| RIGHT value
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [$2[1]];}
| LEFT value
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [$2[1]];}
| BACK value
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [$2[1]];}
| CLEARALL
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [];}
| CLEARDRAWING
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [];}
| DEMO
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [];}
| GETHEADING
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [];}
| PENUP
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [];}
| PENDOWN
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [];}
| SET ACCESSOR value
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [$2, $3[1]];}
| SETHEADING value
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [$2[1]];}
| SETPOS value value
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [$2[1], $3[1]];}
| TESTCARD
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [];}
| TESTHEADING
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [];}
;

string
: IDENTIFIER
{$$ = yytext;}
;

number
: NUMBER
{$$ = Number(yytext);}
;

value
: string
{$$ = ['string', $1];}
| number
{$$ = ['number', $1];}
;


