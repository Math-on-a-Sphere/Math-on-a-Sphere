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
"("                                return '('
")"                                return ')'
"{"                                return '{'
"}"                                return '}'
"["                                return '['
"]"                                return ']'
","                                return ','
"PI"                               return 'PI'
"E"                                return 'E'
"true"                             return 'TRUE'
"false"                            return 'FALSE'
("clearall()"|"clearall")          return 'CLEARALL'
("ca()"|"ca")                      return 'CLEARALL'
("cleardrawing()"|"cleardrawing")  return 'CLEARDRAWING'
("cd()"|"cd")                      return 'CLEARDRAWING'
("penup()"|"penup")                return 'PENUP'
("pu"()|"pu")                      return 'PENUP'
("pendown()"|"pendown")            return 'PENDOWN'
("pd()"|"pd")                      return 'PENDOWN'
("getheading()"|"getheading")      return 'GETHEADING'
("gethead()"|"gethead")            return 'GETHEADING'
("gh()"|"gh")                      return 'GETHEADING'
("getposition()"|"getposition")    return 'GETPOSITION'
("getpos()"|"getpos")              return 'GETPOSITION'
("gp()"|"gp")                      return 'GETPOSITION'
("help()"|"help")                  return 'HELP'
("demo()"|"demo")                  return 'DEMO'
("testcard()"|"testcard")          return 'TESTCARD'
("testheading()"|"testheading")    return 'TESTHEADING'
("set ")                           return 'SET'
("color"|"pen-size")               return 'ACCESSOR'
("repeat"|"REPEAT")                return 'REPEAT'
("function")                       return 'FUNCTION'
\"(?:{esc}["bfnrt/{esc}]|{esc}"u"[a-fA-F0-9]{4}|[^"{esc}])*\"  yytext = yytext.substr(1,yyleng-2); return 'STRING_LIT';
{int}{frac}?{exp}?\b               return 'NUMBER';
[a-zA-Z]+([a-zA-Z0-9_-]*)?\b          return 'IDENTIFIER'
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
%right e
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
| func
;

func
: re re
  {$$ = {};
    $$['type'] = 'func';
    $$['id'] = $1;
    $$['args'] = $2;}
| SET accessor e
  {$$ = {}; 
    $$['type'] = 'set'; 
    $$['args'] = [$2, $3];}
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
| re '^' re
  {$$ = {};
   $$['type'] = 'power';
   $$['args'] = [$1,$3];}
| '(' re ')'
  {$$ = {};
    $$['type'] = 'group_op';
    $$['value'] = $2;}
| value
;



accessor
: ACCESSOR
  {$$ = {};
    $$['type'] = 'accessor';
    $$['value'] = $1;}
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
  {$$ = [];}
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



