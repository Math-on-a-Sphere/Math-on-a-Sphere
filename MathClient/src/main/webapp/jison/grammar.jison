/* lexical grammar */
%lex
digit                       [0-9]
esc                         "\\"
int                         "-"?(?:[0-9]|[1-9][0-9]+)
exp                         (?:[eE][-+]?[0-9]+)
frac                        (?:\.[0-9]+)

%%
\s+                   /* skip whitespace */
"*"                      return '*'
"/"                      return '/'
"-"                      return '-'
"+"                      return '+'
"^"                      return '^'
"!"                      return '!'
"%"                      return '%'
"("                      return '('
")"                      return ')'
"PI"                     return 'PI'
("TO"|"to")\b            return 'TO'
("ENDTO"|"endto")\b      return 'ENDTO'
("FORWARD"|"forward")\b  return 'FORWARD'
("RIGHT"|"right")\b      return 'RIGHT'
\"(?:{esc}["bfnrt/{esc}]|{esc}"u"[a-fA-F0-9]{4}|[^"{esc}])*\"  yytext = yytext.substr(1,yyleng-2); return 'STRING_LIT';
{int}{frac}?{exp}?\b                                           return 'NUMBER';
[a-zA-Z]+([a-zA-Z_]*)?\b return 'IDENTIFIER'
<<EOF>>                  return 'EOF'
.                        return 'INVALID'
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
        {$$ = {}; $$['command'] = $1; $$['args'] = [$2[1]];}
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


