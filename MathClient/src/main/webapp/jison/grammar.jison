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
","                                       return ','
"PI"                                      return 'PI'
"E"                                       return 'E'
"true"                                    return 'TRUE'
"false"                                   return 'FALSE'
("clearall"|"clearAll"|"ca")(\(\))?[\b\s]     return 'CLEARALL'
("cleardrawing"|"clearDrawing"|"cd")(\(\))?[\b\s]  return 'CLEARDRAWING'
("penup()"|"penup")[\b\s]                return 'PENUP'
("pu()"|"pu")[\b\s]                      return 'PENUP'
("pendown()"|"pendown")[\b\s]            return 'PENDOWN'
("pd()"|"pd")[\b\s]                      return 'PENDOWN'
("getheading()"|"getheading")[\b\s]      return 'GETHEADING'
("gethead()"|"gethead")[\b\s]            return 'GETHEADING'
("gh()"|"gh")[\b\s]                      return 'GETHEADING'
("getposition()"|"getposition")[\b\s]    return 'GETPOSITION'
("getpos()"|"getpos")[\b\s]              return 'GETPOSITION'
("gp()"|"gp")[\b\s]                      return 'GETPOSITION'
("getspeed()"|"getspeed")[\b\s]          return 'GETSPEED'
("help()"|"help")[\b\s]                  return 'HELP'
("demo()"|"demo")[\b\s]                  return 'DEMO'
("testcard()"|"testcard")[\b\s]          return 'TESTCARD'
("testheading()"|"testheading")[\b\s]    return 'TESTHEADING'
("set ")\b                           return 'SET'
("if"|"IF")                          return 'IF'
("else"|"ELSE")                      return 'ELSE'
("repeat"|"REPEAT")\b                return 'REPEAT'
("function")\b                       return 'FUNCTION'
\"(?:{esc}["bfnrt/{esc}]|{esc}"u"[a-fA-F0-9]{4}|[^"{esc}])*\"  yytext = yytext.substr(1,yyleng-2); return 'STRING';
(({int}{frac}?)|({int}?{frac})){exp}?\b  return 'NUMBER';
[a-zA-Z]+([\w.0-9]*)\b        return 'IDENTIFIER'
"("                                       return '('
")"                                       return ')'
"{"                                       return '{'
"}"                                       return '}'
"["                                       return '['
"]"                                       return ']'
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
: weblogo EOF
  {return $1;}
;

weblogo
: block
  {$$ = {};
   $$['type'] = 'weblogo';
   $$['handler'] = 'skip';
   $$['value'] = $1;}
| statements
  {$$ = {};
   $$['type'] = 'weblogo';
   $$['handler'] = 'skip';
   $$['value'] = $1;}
;

block
: '{' statements '}'
  {$$ = {};
    $$['type'] = 'block';
    $$['handler'] = 'block';
    $$['value'] = $2;}
;

statements
: statement statements
  {$$ = $2; 
    $2.unshift($1);}
| statement
  {$$ = [$1];}
;


statement
: assignment
  {$$ = {};
    $$['type'] = 'statement';
    $$['handler'] = 'statement';
    $$['value'] = $1;}
| function
  {$$ = {};
    $$['type'] = 'statement';
    $$['handler'] = 'statement';
    $$['value'] = $1;}
| repeat_stmt
  {$$ = {};
   $$['type'] = 'repeat';
   $$['handler'] = 'statement';
   $$['value'] = $1;}
| if_stmt
  {$$ = {};
   $$['type'] = 'if';
   $$['handler'] = 'statement';
   $$['value'] = $1;}
;

assignment
: identifier '=' expr
  {$$ = {};
    $$['type'] = 'assignment';
    $$['handler'] = 'var_assign';
    $$['id'] = $1;
    $$['value'] = $3;}
| identifier '=' FUNCTION '(' ')' block
  {$$ = {};
    $$['type'] = 'assignment';
    $$['handler'] = 'fun_assign';
    $$['id'] = $1;
    $$['args'] = {};
    $$['args']['type'] = 'dummy';
    $$['args']['handler'] = 'list';
    $$['args']['value'] = [];
    $$['block'] = $6;}   
| identifier '=' FUNCTION param_list block
  {$$ = {};
    $$['type'] = 'assignment';
    $$['handler'] = 'fun_assign';
    $$['id'] = $1;
    $$['args'] = $4;
    $$['block'] = $5;}   
;


function
: builtin_null
  {$$ = {};
   $$['type'] = 'function';
   $$['handler'] = 'skip';
   $$['value'] = $1;}
| identifier arguments
  {$$ = {}; 
    $$['type'] = 'function';
    $$['handler'] = 'func';
    $$['id'] = $1;
    $$['args'] = $2;}
| '(' function ')' arguments
  {$$ = {};
    $$['type'] = 'function';
    $$['handler'] = 'func';
    $$['id'] = $1;
    $$['args'] = $2;}
| set_stmt
  {$$ = {};
   $$['type'] = 'function';
   $$['handler'] = 'skip';
   $$['value'] = $1;}
;

repeat_stmt
: REPEAT expr block
  {$$ = {}; 
    $$['type'] = 'repeat_stmt'; 
    $$['handler'] = 'repeat_stmt'; 
    $$['args'] = [$2, $3];}
;

if_stmt
: IF logic_expr block
  {$$ = {};
    $$['type'] = 'if_stmt';
    $$['handler'] = 'if_stmt';
    $$['condition'] = $2;
    $$['block'] = $3;}
| IF logic_expr block ELSE block
  {$$ = {};
    $$['type'] = 'if_stmt';
    $$['handler'] = 'ifelse_stmt';
    $$['condition'] = $2;
    $$['block'] = [$3, $5];}
;

set_stmt
: SET value expr
  {$$ = {}; 
    $$['type'] = 'set_stmt'; 
    $$['handler'] = 'set_stmt'; 
    $$['args'] = [$2, $3];}
;



builtin_null
: CLEARALL 
  {$$ = {};
    $$['type'] = 'builtin_null';
    $$['handler'] = 'builtin';
    $$['id'] = 'clearall';
    $$['args'] = [];}
| CLEARDRAWING
  {$$ = {};
    $$['type'] = 'builtin_null';
    $$['handler'] = 'builtin';
    $$['id'] = 'cleardrawing';
    $$['args'] = [];}
| PENUP
  {$$ = {};
    $$['type'] = 'builtin_null';
    $$['handler'] = 'builtin';
    $$['id'] = 'penup';
    $$['args'] = [];}
| PENDOWN
  {$$ = {};
    $$['type'] = 'builtin_null';
    $$['handler'] = 'builtin';
    $$['id'] = 'pendown';
    $$['args'] = [];}
| GETHEADING
  {$$ = {};
    $$['type'] = 'builtin_null';
    $$['handler'] = 'builtin';
    $$['id'] = 'getheading';
    $$['args'] = [];}
| GETPOSITION
  {$$ = {};
    $$['type'] = 'builtin_null';
    $$['handler'] = 'builtin';
    $$['id'] = 'getposition';
    $$['args'] = [];}
| GETSPEED
  {$$ = {};
    $$['type'] = 'builtin_null';
    $$['handler'] = 'builtin';
    $$['id'] = 'getspeed';
    $$['args'] = [];}
| HELP
  {$$ = {};
    $$['type'] = 'builtin_null';
    $$['handler'] = 'builtin';
    $$['id'] = 'help';
    $$['args'] = [];}
| DEMO
  {$$ = {};
    $$['type'] = 'builtin_null';
    $$['handler'] = 'builtin';
    $$['id'] = 'demo';
    $$['args'] = [];}
| TESTCARD
  {$$ = {};
    $$['type'] = 'builtin_null';
    $$['handler'] = 'builtin';
    $$['id'] = 'testcard';
    $$['args'] = [];}
| TESTHEADING
  {$$ = {};
    $$['type'] = 'builtin_null';
    $$['handler'] = 'builtin';
    $$['id'] = 'testheading';
    $$['args'] = [];}
;

expr
: re
  {$$ = {};
   $$['type'] = 'expr';
   $$['handler'] = 'expr';
   $$['value'] = $1;}
| '-' re %prec UMINUS
  {$$ = {};
   $$['type'] = 'expr';
   $$['handler'] = 'uminus';
   $$['value'] = $2;}
| logic_expr
  {$$ = {};
   $$['type'] = 'expr';
   $$['handler'] = 'expr';
   $$['value'] = $1;}

;

arguments
: '(' expr ')'
  {$$ = {};
    $$['type'] = 'arguments';
    $$['handler'] = 'skip';
    $$['value'] = [$2];}
| value
  {$$ = {};
   $$['type'] = 'arguments';
   $$['handler'] = 'skip';
   $$['value'] = [$1];}
| JSONArray
  {$$ = {};
   $$['type'] = 'arguments';
   $$['handler'] = 'skip';
   $$['value'] = $1;}
;


re
: re '+' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '+';
   $$['args'] = [$1,$3];}
| re '-' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '-';
   $$['args'] = [$1,$3];}
| re '*' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '*';
   $$['args'] = [$1,$3];}
| re '/' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '/';
   $$['args'] = [$1,$3];}
| '(' re ')'
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'group_op';
   $$['args'] = [$2];}
| '(' function ')'
  {$$ = $2;}
| value
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'skip';
   $$['value'] = $1;}
;

logic_expr
: '(' logic_expr ')'
  {$$ = $2;} 
| re '==' re
  {$$ = {};
   $$['type'] = 'logic_expr';
   $$['handler'] = 'op';
   $$['op'] = '==';
   $$['args'] = [$1,$3];}
| re '<' re
  {$$ = {};
   $$['type'] = 'logic_expr';
   $$['handler'] = 'op';
   $$['op'] = '<';
   $$['args'] = [$1,$3];}
| re '>' re
  {$$ = {};
   $$['type'] = 'logic_expr';
   $$['handler'] = 'op';
   $$['op'] = '>';
   $$['args'] = [$1,$3];}
;


param_list
: JSONArray
 {$$ = {};
  $$['type'] = 'param_list';
  $$['handler'] = 'skip';
  $$['value'] = $1;}
| '(' JSONArray ')'
 {$$ = {};
  $$['type'] = 'param_list';
  $$['handler'] = 'skip';
  $$['value'] = $2;}
;


value
: '(' ')'
  {$$ = {};
    $$['type'] = 'value';
    $$['handler'] = 'list';
    $$['value'] = [];}
| identifier
  {$$ = {};
    $$['type'] = 'value';
    $$['handler'] = 'skip';
    $$['value'] = $1;}
| number
  {$$ = {};
    $$['type'] = 'value';
    $$['handler'] = 'skip';
    $$['value'] = $1;}
| string
  {$$ = {};
    $$['type'] = 'value';
    $$['handler'] = 'skip';
    $$['value'] = $1;}
| boolean
  {$$ = {};
    $$['type'] = 'value';
    $$['handler'] = 'skip';
    $$['value'] = $1;}
| JSONObject
  {$$ = {};
   $$['type'] = 'value';
   $$['handler'] = 'skip';
   $$['value'] = $1;}
;

identifier
: IDENTIFIER
  {$$ = {};
    $$['type'] = 'identifier';
    $$['handler'] = 'value';
    $$['value'] = yytext;}
;

string
: STRING
  {$$ = {};
    $$['type'] = 'string';
    $$['handler'] = 'value';
    $$['value'] = yytext;}
;

number
: NUMBER
  {$$ = {};
    $$['type'] = 'number';
    $$['handler'] = 'value';
    $$['value'] = Number(yytext);}
| E
  {$$ = {};
    $$['type'] = 'number';
    $$['handler'] = 'value';
    $$['value'] = Math.E;}
| PI
  {$$ = {};
    $$['type'] = 'number';
    $$['handler'] = 'value';
    $$['value'] = Math.PI;}
;

boolean
: TRUE
  {$$ = {};
    $$['type'] = 'boolean';
    $$['handler'] = 'value';
    $$['value'] = true;}
| FALSE
  {$$ = {};
    $$['type'] = 'boolen';
    $$['handler'] = 'value';
    $$['value'] = false;}
;



JSONObject
: '{' '}'
  {$$ = {};
    $$['type'] = 'JSONObject';
    $$['handler'] = 'JSONObject';
    $$['value'] = '{}';}
| '{' JSONMemberList '}'
  {$$ = {};
    $$['type'] = 'JSONObject';
    $$['handler'] = 'JSONObject';
    $$['value'] = $2;}
;

JSONMemberList
: JSONMember
  {$$ = {}; 
    $$['type'] = 'JSONMemberList';
    $$['handler'] = 'JSONMember';
    $$[$1[0]] = $1[1];}
| JSONMember ',' JSONMemberList
  {$$ = $1; $1[$3[0]] = $3[1];}
;

JSONMember
: string ':' expr
  {$$ = {};
    $$['type'] = 'JSONMenber';
    $$['handler'] = 'JSONMenber';
    $$['value'] = [$1, $3];}
;


JSONArray
: '[' ']'
  {$$ = {};
    $$['type'] = 'JSONArray';
    $$['handler'] = 'list';
    $$['value'] = [];}
| '[' JSONElementList ']'
  {$$ = {};
    $$['type'] = 'JSONArray';
    $$['handler'] = 'list';
    $$['value'] = $2;}
;

JSONElementList
: expr
  {$$ = [$1];}
| expr ',' JSONElementList
  {$$ = $3; 
    $3.unshift($1);}
;



