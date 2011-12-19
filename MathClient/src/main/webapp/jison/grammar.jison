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
    $$['args'] = [$1, $2];}
| command
  {$$ = {};
    $$['type'] = 'specialCommand';
    $$['value'] = $1;}
;

exp
: value
| '(' ')'
  {$$ = {};
    $$['type'] = 'list';}
;


command
: SET accessor value 
  {$$ = {}; 
    $$['type'] = 'command'; 
    $$['command'] = $1;
    $$['args'] = [$2, $3];}
| REPEAT value block
  {$$ = {}; 
    $$['type'] = 'keyword'; 
    $$['command'] = $1;
    $$['args'] = [$2, $3];}
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
    $$['args'] = [];
    $$['value'] = $6;}   
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


