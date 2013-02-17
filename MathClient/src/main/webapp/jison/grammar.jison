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
([^\.]{int}{frac}){exp}?\b     return 'NUMBER';
{int}\b                   return 'INT';
[a-zA-Z]+([\w]*)\b        return 'IDENTIFIER'
"("                                       return '('
")"                                       return ')'
"{"                                       return '{'
"}"                                       return '}'
":"                                       return ':'
"["                                       return '['
"]"                                       return ']'
"."                                       return '.'
"=="                               return '=='
"<"                                return '<'
">"                                return '>'
"="                                return '='
<<EOF>>                            return 'EOF'
.                                  return "unlexable_token"
/lex




/* operator associations and precedence */
%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS
%left '.'
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
| function_call
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

function_call
: builtin_null
  {$$ = {};
   $$['type'] = 'function';
   $$['handler'] = 'skip';
   $$['value'] = $1;}
| indexable arguments
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
: IF expr block
  {$$ = {};
    $$['type'] = 'if_stmt';
    $$['handler'] = 'if_stmt';
    $$['condition'] = $2;
    $$['block'] = $3;}
| IF expr block ELSE block
  {$$ = {};
    $$['type'] = 'if_stmt';
    $$['handler'] = 'ifelse_stmt';
    $$['condition'] = $2;
    $$['block'] = [$3, $5];}
;

set_stmt
: SET identifier expr
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
| '-' re %prec UMINUS
  {$$ = {};
   $$['type'] = 'expr';
   $$['handler'] = 'uminus';
   $$['value'] = $2;}
;

arguments
: re
;

index
:INT   
  {$$ = {};
  $$.type = "number";
  $$.handler = "value";
  $$.value = Number(yytext);}
|identifier
|boolean
;


indexable
: lhindex
| value
| identifier
;

lhindex
: indexable '.' index
  {$$ = {};
   $$.handler = "index_op";
   $$.args = [$1, $3];}
;

re
: re '+' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '+';
   $$['args'] = [$1, $3];}
| re '-' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '-';
   $$['args'] = [$1, $3];}
| re '*' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '*';
   $$['args'] = [$1, $3];}
| re '/' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '/';
   $$['args'] = [$1, $3];}
| indexable
| re '==' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '==';
   $$['args'] = [$1, $3];}
| re '<' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '<';
   $$['args'] = [$1, $3];}
| re '>' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '>';
   $$['args'] = [$1, $3];}
| '(' expr ')'
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'group_op';
   $$['args'] = [$2];}
| '(' function_call ')'
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'skip';
   $$['value'] = $2;}
;

value
: '(' ')'
  {$$ = {};
    $$['type'] = 'value';
    $$['handler'] = 'list';
    $$['value'] = [];}
| number
| JSONObject
| JSONArray
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
    $$['type'] = 'boolean';
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
    $$ = [$1];}
| JSONMember ',' JSONMemberList
  {$$ = [$1]; $$ = $$.concat($3);}
;

JSONMember
: string ':' expr
  {$$ = {key: $1, value: $3};}
| identifier ':' expr
  {$$ = {key: $1, value: $3};}
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
