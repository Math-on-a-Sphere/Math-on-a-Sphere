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
\#[^\n]*                              /* skip comment */
"*"                                       return '*'
"/"                                       return '/'
"-"                                       return '-'
"+"                                       return '+'
"^"                                       return '^'
"("                                       return '('
")"                                       return ')'
"{"                                       return '{'
"}"                                       return '}'
"["                                       return '['
"]"                                       return ']'
","                                       return ','
"PI"                                      return 'PI'
"E"                                       return 'E'
"true"                                    return 'TRUE'
"false"                                   return 'FALSE'
("clearall"|"clearAll"|"ca")(\(\))?\b     return 'CLEARALL'
("cleardrawing"|"clearDrawing"|"cd")(\(\))?\b  return 'CLEARDRAWING'
("penup()"|"penup")\b                return 'PENUP'
("pu"()|"pu")\b                      return 'PENUP'
("pendown()"|"pendown")\b            return 'PENDOWN'
("pd()"|"pd")\b                      return 'PENDOWN'
("getheading()"|"getheading")\b      return 'GETHEADING'
("gethead()"|"gethead")\b            return 'GETHEADING'
("gh()"|"gh")\b                      return 'GETHEADING'
("getposition()"|"getposition")\b    return 'GETPOSITION'
("getpos()"|"getpos")\b              return 'GETPOSITION'
("gp()"|"gp")\b                      return 'GETPOSITION'
("getspeed()"|"getspeed")\b          return 'GETSPEED'
("help()"|"help")\b                  return 'HELP'
("demo()"|"demo")\b                  return 'DEMO'
("testcard()"|"testcard")\b          return 'TESTCARD'
("testheading()"|"testheading")\b    return 'TESTHEADING'
("set ")\b                           return 'SET'
("if"|"IF")                          return 'IF'
("repeat"|"REPEAT")\b                return 'REPEAT'
("function")\b                       return 'FUNCTION'
\"(?:{esc}["bfnrt/{esc}]|{esc}"u"[a-fA-F0-9]{4}|[^"{esc}])*\"  yytext = yytext.substr(1,yyleng-2); return 'STRING_LIT';
(({int}{frac}?)|({int}?{frac})){exp}?\b  return 'NUMBER';
[a-zA-Z]+([\w.]*)\b        return 'IDENTIFIER'
"=="                               return '=='
"<"                                return '<'
">"                                return '>'
"="                                return '='
<<EOF>>                            return 'EOF'
.                                  return 'INVALID'
/lex




/* operator associations and precedence */
%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS
%right '='
%right '=='
%right '<' '>'
%start program


%% /* language grammar */

program
: weblogo_schema EOF
  {return $1;}
;

weblogo_schema
: block
| nodes
;

block
: '{' nodes '}'
  {$$ = {};
    $$['type'] = 'block';
    $$['value'] = $2;}
;

nodes
: node nodes
  {$$ = $2; 
    $2.unshift($1);}
| node
  {$$ = [$1];}
;


node
: assignment
  {$$ = {};
    $$['type'] = 'node';
    $$['value'] = $1;}
| func
  {$$ = {};
    $$['type'] = 'node';
    $$['value'] = $1;}
;

func
: value rre
  {$$ = {};
    $$['type'] = 'func';
    $$['id'] = $1;
    $$['args'] = $2;}
| '(' func ')' rre
  {$$ = {};
    $$['type'] = 'func';
    $$['id'] = $1;
    $$['args'] = $2;}
| SET value e
  {$$ = {}; 
    $$['type'] = 'set'; 
    $$['args'] = [$2, $3];}
| IF e block
  {$$ = {};
    $$['type'] = 'ifstatement';
    $$['condition'] = $2;
    $$['block'] = $3;}
| REPEAT e block
  {$$ = {}; 
    $$['type'] = 'repeat'; 
    $$['args'] = [$2, $3];}
| CLEARALL 
  {$$ = {};
    $$['type'] = 'builtin';
    $$['id'] = 'clearall';
    $$['args'] = [];}
| CLEARDRAWING
  {$$ = {};
    $$['type'] = 'builtin';
    $$['id'] = 'cleardrawing';
    $$['args'] = [];}
| PENUP
  {$$ = {};
    $$['type'] = 'builtin';
    $$['id'] = 'penup';
    $$['args'] = [];}
| PENDOWN
  {$$ = {};
    $$['type'] = 'builtin';
    $$['id'] = 'pendown';
    $$['args'] = [];}
| GETHEADING
  {$$ = {};
    $$['type'] = 'builtin';
    $$['id'] = 'getheading';
    $$['args'] = [];}
| GETPOSITION
  {$$ = {};
    $$['type'] = 'builtin';
    $$['id'] = 'getposition';
    $$['args'] = [];}
| GETSPEED
  {$$ = {};
    $$['type'] = 'builtin';
    $$['id'] = 'getspeed';
    $$['args'] = [];}
| HELP
  {$$ = {};
    $$['type'] = 'builtin';
    $$['id'] = 'help';
    $$['args'] = [];}
| DEMO
  {$$ = {};
    $$['type'] = 'builtin';
    $$['id'] = 'demo';
    $$['args'] = [];}
| TESTCARD
  {$$ = {};
    $$['type'] = 'builtin';
    $$['id'] = 'testcard';
    $$['args'] = [];}
| TESTHEADING
  {$$ = {};
    $$['type'] = 'builtin';
    $$['id'] = 'testheading';
    $$['args'] = [];}
;

e
: re
| '-' re %prec UMINUS
  {$$ = {};
   $$['type'] = 'uminus';
   $$['value'] = $2;}
;

rre
: '(' re ')'
  {$$ = {};
    $$['type'] = 'group_op';
    $$['value'] = $2;}
| value
;


re
: re '+' re
  {$$ = {};
   $$['type'] = 'op';
   $$['op'] = $2;
   $$['args'] = [$1,$3];}
| re '-' re
  {$$ = {};
   $$['type'] = 'op';
   $$['op'] = $2;
   $$['args'] = [$1,$3];}
| re '*' re
  {$$ = {};
   $$['type'] = 'op';
   $$['op'] = $2;
   $$['args'] = [$1,$3];}
| re '/' re
  {$$ = {};
   $$['type'] = 'op';
   $$['op'] = $2;
   $$['args'] = [$1,$3];}
| re '==' re
  {$$ = {};
   $$['type'] = 'op';
   $$['op'] = $2;
   $$['args'] = [$1,$3];}
| re '<' re
  {$$ = {};
   $$['type'] = 'op';
   $$['op'] = $2;
   $$['args'] = [$1,$3];}
| re '>' re
  {$$ = {};
   $$['type'] = 'op';
   $$['op'] = $2;
   $$['args'] = [$1,$3];}
| '(' re ')'
  {$$ = {};
    $$['type'] = 'group_op';
    $$['value'] = $2;}
| value
| '(' func ')'
  {$$ = $2;}
;



assignment
: identifier '=' e
  {$$ = {};
    $$['type'] = 'var_assign';
    $$['id'] = $1;
    $$['value'] = $3;}
| identifier '=' FUNCTION '(' ')' block
  {$$ = {};
    $$['type'] = 'fun_assign';
    $$['id'] = $1;
    $$['args'] = {};
    $$['args']['type'] = 'list';
    $$['args']['value'] = [];
    $$['block'] = $6;}   
| identifier '=' FUNCTION '(' JSONArray ')' block
  {$$ = {};
    $$['type'] = 'fun_assign';
    $$['id'] = $1;
    $$['args'] = $5;
    $$['block'] = $7;}   
| identifier '=' FUNCTION JSONArray block
  {$$ = {};
    $$['type'] = 'fun_assign';
    $$['id'] = $1;
    $$['args'] = $4;
    $$['block'] = $5;}   
;


value
: '(' ')'
  {$$ = {};
    $$['type'] = 'list';
    $$['value'] = [];}
| identifier
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
| boolean
  {$$ = {};
    $$['type'] = 'boolean';
    $$['value'] = $1;}
| JSONObject
| JSONArray
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
| E
  {$$ = Math.E;}
| PI
  {$$ = Math.PI;}
;

boolean
: TRUE
  {$$ = true;}
| FALSE
  {$$ = false;}
;

JSONObject
: '{' '}'
  {$$ = {};}
| '{' JSONMemberList '}'
  {$$ = {};
    $$['type'] = 'JSONObject';
    $$['value'] = $2;}
;

JSONMember
: string ':' e
  {$$ = {};
    $$['type'] = 'JSONMenber';
    $$['value'] = [$1, $3];}
;

JSONMemberList
: JSONMember
  {$$ = {}; 
    $$['type'] = 'JSONMember';
    $$[$1[0]] = $1[1];}
| JSONMemberList ',' JSONMember
  {$$ = $1; $1[$3[0]] = $3[1];}
;

JSONArray
: '[' ']'
  {$$ = {};
    $$['type'] = 'list';
    $$['value'] = [];}
| '[' JSONElementList ']'
  {$$ = {};
    $$['type'] = 'list';
    $$['value'] = $2;}
;

JSONElementList
: e
  {$$ = [$1];}
| e ',' JSONElementList
  {$$ = $3; 
    $3.unshift($1);}
;



