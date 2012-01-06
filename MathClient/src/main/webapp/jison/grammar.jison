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
"["                                return '['
"]"                                return ']'
","                                return ','
"PI"                               return 'PI'
"true"                             return 'TRUE'
"false"                            return 'FALSE'
("set")                            return 'SET'
("color"|"pen-size")               return 'ACCESSOR'
("repeat"|"REPEAT")                return 'REPEAT'
("function")                       return 'FUNCTION'
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
| func
;

func
: exp exp
  {$$ = {};
    $$['type'] = 'func';
    $$['id'] = $1;
    $$['args'] = $2;}
| SET accessor value 
  {$$ = {}; 
    $$['type'] = 'set'; 
    $$['args'] = [$2, $3];}
| REPEAT value block
  {$$ = {}; 
    $$['type'] = 'repeat'; 
    $$['args'] = [$2, $3];}
;

exp
: value
 {$$ = {};
   $$['type'] = $1['type'];
   $$['value'] = [$1['value']];}
| '(' ')'
  {$$ = {};
    $$['type'] = 'list';
    $$['value'] = [];}
| '(' JSONArray ')'
  {$$ = $2;}
;


accessor
: ACCESSOR
  {$$ = {};
    $$['type'] = 'accessor';
    $$['value'] = $1;}
;


assignment
: identifier '=' value
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


JSONString
: STRING_LIT
  {$$ = yytext;}
;

JSONNumber
: NUMBER
  {$$ = Number(yytext);}
;

JSONBooleanLiteral
: TRUE
  {$$ = true;}
| FALSE
  {$$ = false;}
;

JSONValue
: value
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
: JSONString ':' JSONValue
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
  {$$ = [];}
| '[' JSONElementList ']'
  {$$ = {};
    $$['type'] = 'list';
    $$['value'] = $2;}
;

JSONElementList
: JSONValue
  {$$ = [$1];}
| JSONValue ',' JSONElementList
  {$$ = $3; 
    $3.unshift($1);}
;

