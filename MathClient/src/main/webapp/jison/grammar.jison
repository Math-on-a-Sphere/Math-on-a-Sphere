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
"*"                                       return '*'
"%"                                       return '%'
"/"                                       return '/'
"-"                                       return '-'
"+"                                       return '+'
"^"                                       return '^'
","                                       return ','
"PI"                                      return 'PI'
"E"                                       return 'E'
"true"                                    return 'TRUE'
"false"                                   return 'FALSE'
("forward"|"fd"|"back"|"bk"|"left"|"lt"|"right"|"rt"|"setheading"|"sh"|"towards"|"distanceto"|"setposition"|"setpos"|"sp")\b     return "BUILTIN_ARG"
("clearall"|"ca"|"cleardrawing"|"ca"|"penup"|"pu"|"pendown"|"pd"|"getheading"|"gh"|"getposition"|"gp"|"getspeed"|"help"|"demo"|"testcard")\b    return "BUILTIN_NULL"
("set ")\b                           return 'SET'
("if"|"IF")                          return 'IF'
("else"|"ELSE")                      return 'ELSE'
("repeat"|"REPEAT")\b                return 'REPEAT'
"function"\b                         return 'FUNCTION'
"each"\b                             return 'EACH'
"transform"\b                        return 'TRANSFORM'

\"(?:{esc}["bfnrt/{esc}]|{esc}"u"[a-fA-F0-9]{4}|[^"{esc}])*\"  yytext = yytext.substr(1,yyleng-2); return 'STRING';
{int}\b                  return 'INT';
{int}{frac}?{exp}?\b     return 'NUMBER';
[a-zA-Z]+([\w]*)\b       return 'IDENTIFIER'
"("                                return '('
")"                                return ')'
"{"                                return '{'
"}"                                return '}'
":"                                return ':'
"["                                return '['
"]"                                return ']'
"."                                return '.'
"=="                               return '=='
"<"                                return '<'
">"                                return '>'
"="                                return '='
<<EOF>>                            return 'EOF'
.                                  return "unlexable_token"
/lex



/* operator associations and precedence */
%left '+' '-'
%left '*' '/' '%'
%left '^'
%left UMINUS
%left '.' '['
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
| set_stmt
;

set_stmt
: SET identifier expr
  {$$ = {}; 
    $$['type'] = 'set_stmt'; 
    $$['handler'] = 'set_stmt'; 
    $$['args'] = [$2, $3];}
;

lvalue
: identifier
| lvalue '.' index
  {$$ = {};
   $$.handler = "index_op";
   $$.args = [$1, $3];}
| lvalue '[' expr ']'
  {$$ = {};
   $$.handler = "index_op";
   $$.args = [$1, $3];}
;

assignment
: lvalue '=' expr
  {$$ = {};
    $$['type'] = 'assignment';
    $$['handler'] = 'var_assign';
    $$['id'] = $1;
    $$['value'] = $3;}
| lvalue '=' FUNCTION '(' ')' block
  {$$ = {};
    $$['type'] = 'assignment';
    $$['handler'] = 'fun_assign';
    $$['id'] = $1;
    $$['args'] = [];
    $$['block'] = $6;}
| lvalue '=' FUNCTION '(' param_list ')' block
  {$$ = {};
    $$['type'] = 'assignment';
    $$['handler'] = 'fun_assign';
    $$['id'] = $1;
    $$['args'] = $5;
    $$['block'] = $7;}   
;

param_list
: identifier
 {$$ = [$1];}
| identifier ',' param_list
  {$$ = $3; 
    $3.unshift($1);}
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


function_call
: BUILTIN_NULL
  {$$ = {
    "handler": "builtin",
    "id": $1
    };}
| BUILTIN_NULL '(' ')' 
  {$$ = {
    "handler": "builtin",
    "id": $1
    };}
| BUILTIN_ARG expr
  {$$ = {    
    "handler": "func",      
    "id": $1,      
    "args": $2
    };}
| lvalue '(' arguments ')'
  {$$ = {}; 
    $$['type'] = 'function';
    $$['handler'] = 'func';
    $$['id'] = $1;
    $$['args'] = $3;}
| lvalue '.' EACH '(' arguments ')'
  {$$ = {
      "handler": "each",
      "id": $1,
      "args": $5
  };}
;

arguments
:
| ElementList
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

expr
: re
| complex_value
| '-' re %prec UMINUS
  {$$ = {};
   $$['type'] = 'expr';
   $$['handler'] = 'uminus';
   $$['value'] = $2;}
;

index
:INT   
  {$$ = {
    type: "number",
    handler: "value",
    value: Number(yytext)};}
|identifier
  {$$ = {
    type: "string",
    handler: "value",
    value: $1.value};}
;

complex_value
: JSONObject
| JSONArray 
;


number_type
: NUMBER
| INT
;

number
: number_type
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

simple_value
: number
| string
;

re
: simple_value
| lvalue
| re '+' re
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
| re '%' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '%';
   $$['args'] = [$1, $3];}
| re '/' re
  {$$ = {};
   $$['type'] = 're';
   $$['handler'] = 'op';
   $$['op'] = '/';
   $$['args'] = [$1, $3];}
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
| '[' ElementList ']'
  {$$ = {};
    $$['type'] = 'JSONArray';
    $$['handler'] = 'list';
    $$['value'] = $2;}
;

ElementList
: expr
  {$$ = [$1];}
| expr ',' ElementList
  {$$ = $3; 
    $3.unshift($1);}
;
