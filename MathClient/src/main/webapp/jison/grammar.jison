/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b     return 'NUMBER'
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
[a-zA-Z]+([a-zA-Z_]*)?\b return 'IDENTIFIER'
<<EOF>>                  return 'EOF'
.                        return 'INVALID'
/lex

%%
file
    : weblogo_schema EOF
      {return $1}
    ;

weblogo_schema
    : FORWARD NUMBER
      {$$ = [$1, Number(yytext)];}
    | RIGHT NUMBER
      {$$ = [$1, Number(yytext)];}
    ;



