/* Jison generated parser */
var grammar = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"program":3,"weblogo_schema":4,"EOF":5,"block":6,"nodes":7,"{":8,"}":9,"node":10,"assignment":11,"func":12,"re":13,"SET":14,"accessor":15,"e":16,"REPEAT":17,"-":18,"+":19,"*":20,"/":21,"^":22,"(":23,")":24,"value":25,"ACCESSOR":26,"identifier":27,"=":28,"FUNCTION":29,"JSONArray":30,"number":31,"string":32,"boolean":33,"JSONObject":34,"IDENTIFIER":35,"STRING_LIT":36,"NUMBER":37,"E":38,"PI":39,"TRUE":40,"FALSE":41,"JSONMemberList":42,"JSONMember":43,"JSONString":44,":":45,",":46,"[":47,"]":48,"JSONElementList":49,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"{",9:"}",14:"SET",17:"REPEAT",18:"-",19:"+",20:"*",21:"/",22:"^",23:"(",24:")",26:"ACCESSOR",28:"=",29:"FUNCTION",35:"IDENTIFIER",36:"STRING_LIT",37:"NUMBER",38:"E",39:"PI",40:"TRUE",41:"FALSE",44:"JSONString",45:":",46:",",47:"[",48:"]"},
productions_: [0,[3,2],[4,1],[4,1],[6,3],[7,2],[7,1],[10,1],[10,1],[12,2],[12,3],[12,3],[16,1],[16,2],[13,3],[13,3],[13,3],[13,3],[13,3],[13,3],[13,1],[15,1],[11,3],[11,6],[11,7],[11,5],[25,2],[25,1],[25,1],[25,1],[25,1],[25,1],[25,1],[27,1],[32,1],[31,1],[31,1],[31,1],[33,1],[33,1],[34,2],[34,3],[43,3],[42,1],[42,3],[30,2],[30,3],[49,1],[49,3]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:return $$[$0-1];
break;
case 4:this.$ = {};
    this.$['type'] = 'block';
    this.$['value'] = $$[$0-1];
break;
case 5:this.$ = $$[$0]; 
    $$[$0].unshift($$[$0-1]);
break;
case 6:this.$ = [$$[$0]];
break;
case 9:this.$ = {};
    this.$['type'] = 'func';
    this.$['id'] = $$[$0-1];
    this.$['args'] = $$[$0];
break;
case 10:this.$ = {}; 
    this.$['type'] = 'set'; 
    this.$['args'] = [$$[$0-1], $$[$0]];
break;
case 11:this.$ = {}; 
    this.$['type'] = 'repeat'; 
    this.$['args'] = [$$[$0-1], $$[$0]];
break;
case 13:this.$ = {};
   this.$['type'] = 'uminus';
   this.$['value'] = $$[$0];
break;
case 14:this.$ = {};
   this.$['type'] = 'op';
   this.$['op'] = $$[$0-1];
   this.$['args'] = [$$[$0-2],$$[$0]];
break;
case 15:this.$ = {};
   this.$['type'] = 'op';
   this.$['op'] = $$[$0-1];
   this.$['args'] = [$$[$0-2],$$[$0]];
break;
case 16:this.$ = {};
   this.$['type'] = 'op';
   this.$['op'] = $$[$0-1];
   this.$['args'] = [$$[$0-2],$$[$0]];
break;
case 17:this.$ = {};
   this.$['type'] = 'op';
   this.$['op'] = $$[$0-1];
   this.$['args'] = [$$[$0-2],$$[$0]];
break;
case 18:this.$ = {};
   this.$['type'] = 'power';
   this.$['args'] = [$$[$0-2],$$[$0]];
break;
case 19:this.$ = {};
    this.$['type'] = 'group_op';
    this.$['value'] = $$[$0-1];
break;
case 21:this.$ = {};
    this.$['type'] = 'accessor';
    this.$['value'] = $$[$0];
break;
case 22:this.$ = {};
    this.$['type'] = 'var_assign';
    this.$['id'] = $$[$0-2];
    this.$['value'] = $$[$0];
break;
case 23:this.$ = {};
    this.$['type'] = 'fun_assign';
    this.$['id'] = $$[$0-5];
    this.$['args'] = {};
    this.$['args']['type'] = 'list';
    this.$['args']['value'] = [];
    this.$['block'] = $$[$0];
break;
case 24:this.$ = {};
    this.$['type'] = 'fun_assign';
    this.$['id'] = $$[$0-6];
    this.$['args'] = $$[$0-2];
    this.$['block'] = $$[$0];
break;
case 25:this.$ = {};
    this.$['type'] = 'fun_assign';
    this.$['id'] = $$[$0-4];
    this.$['args'] = $$[$0-1];
    this.$['block'] = $$[$0];
break;
case 26:this.$ = {};
    this.$['type'] = 'list';
    this.$['value'] = [];
break;
case 27:this.$ = {};
    this.$['type'] = 'identifier';
    this.$['value'] = $$[$0];
break;
case 28:this.$ = {};
    this.$['type'] = 'number';
    this.$['value'] = $$[$0];
break;
case 29:this.$ = {};
    this.$['type'] = 'string';
    this.$['value'] = $$[$0];
break;
case 30:this.$ = {};
    this.$['type'] = 'boolean';
    this.$['value'] = $$[$0];
break;
case 33:this.$ = yytext;
break;
case 34:this.$ = yytext;
break;
case 35:this.$ = Number(yytext);
break;
case 36:this.$ = Math.E;
break;
case 37:this.$ = Math.PI;
break;
case 38:this.$ = true;
break;
case 39:this.$ = false;
break;
case 40:this.$ = {};
break;
case 41:this.$ = {};
    this.$['type'] = 'JSONObject';
    this.$['value'] = $$[$0-1];
break;
case 42:this.$ = {};
    this.$['type'] = 'JSONMenber';
    this.$['value'] = [$$[$0-2], $$[$0]];
break;
case 43:this.$ = {}; 
    this.$['type'] = 'JSONMember';
    this.$[$$[$0][0]] = $$[$0][1];
break;
case 44:this.$ = $$[$0-2]; $$[$0-2][$$[$0][0]] = $$[$0][1];
break;
case 45:this.$ = [];
break;
case 46:this.$ = {};
    this.$['type'] = 'list';
    this.$['value'] = $$[$0-1];
break;
case 47:this.$ = [$$[$0]];
break;
case 48:this.$ = $$[$0]; 
    $$[$0].unshift($$[$0-2]);
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:[1,5],10:6,11:7,12:8,13:10,14:[1,11],17:[1,12],23:[1,14],25:15,27:9,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{1:[3]},{5:[1,28]},{5:[2,2]},{5:[2,3]},{7:29,8:[1,34],9:[1,30],10:6,11:7,12:8,13:10,14:[1,11],17:[1,12],23:[1,14],25:15,27:9,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],42:31,43:32,44:[1,33],47:[1,27]},{5:[2,6],7:35,8:[1,34],9:[2,6],10:6,11:7,12:8,13:10,14:[1,11],17:[1,12],23:[1,14],25:15,27:9,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{5:[2,7],8:[2,7],9:[2,7],14:[2,7],17:[2,7],23:[2,7],35:[2,7],36:[2,7],37:[2,7],38:[2,7],39:[2,7],40:[2,7],41:[2,7],47:[2,7]},{5:[2,8],8:[2,8],9:[2,8],14:[2,8],17:[2,8],23:[2,8],35:[2,8],36:[2,8],37:[2,8],38:[2,8],39:[2,8],40:[2,8],41:[2,8],47:[2,8]},{8:[2,27],18:[2,27],19:[2,27],20:[2,27],21:[2,27],22:[2,27],23:[2,27],28:[1,36],35:[2,27],36:[2,27],37:[2,27],38:[2,27],39:[2,27],40:[2,27],41:[2,27],47:[2,27]},{8:[1,34],13:37,18:[1,39],19:[1,38],20:[1,40],21:[1,41],22:[1,42],23:[1,14],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{15:44,26:[1,45]},{8:[1,34],13:47,16:46,18:[1,48],23:[1,14],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{5:[2,33],8:[2,33],9:[2,33],14:[2,33],17:[2,33],18:[2,33],19:[2,33],20:[2,33],21:[2,33],22:[2,33],23:[2,33],24:[2,33],28:[2,33],35:[2,33],36:[2,33],37:[2,33],38:[2,33],39:[2,33],40:[2,33],41:[2,33],46:[2,33],47:[2,33],48:[2,33]},{8:[1,34],13:49,23:[1,14],24:[1,50],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{5:[2,20],8:[2,20],9:[2,20],14:[2,20],17:[2,20],18:[2,20],19:[2,20],20:[2,20],21:[2,20],22:[2,20],23:[2,20],24:[2,20],35:[2,20],36:[2,20],37:[2,20],38:[2,20],39:[2,20],40:[2,20],41:[2,20],46:[2,20],47:[2,20],48:[2,20]},{5:[2,28],8:[2,28],9:[2,28],14:[2,28],17:[2,28],18:[2,28],19:[2,28],20:[2,28],21:[2,28],22:[2,28],23:[2,28],24:[2,28],35:[2,28],36:[2,28],37:[2,28],38:[2,28],39:[2,28],40:[2,28],41:[2,28],46:[2,28],47:[2,28],48:[2,28]},{5:[2,29],8:[2,29],9:[2,29],14:[2,29],17:[2,29],18:[2,29],19:[2,29],20:[2,29],21:[2,29],22:[2,29],23:[2,29],24:[2,29],35:[2,29],36:[2,29],37:[2,29],38:[2,29],39:[2,29],40:[2,29],41:[2,29],46:[2,29],47:[2,29],48:[2,29]},{5:[2,30],8:[2,30],9:[2,30],14:[2,30],17:[2,30],18:[2,30],19:[2,30],20:[2,30],21:[2,30],22:[2,30],23:[2,30],24:[2,30],35:[2,30],36:[2,30],37:[2,30],38:[2,30],39:[2,30],40:[2,30],41:[2,30],46:[2,30],47:[2,30],48:[2,30]},{5:[2,31],8:[2,31],9:[2,31],14:[2,31],17:[2,31],18:[2,31],19:[2,31],20:[2,31],21:[2,31],22:[2,31],23:[2,31],24:[2,31],35:[2,31],36:[2,31],37:[2,31],38:[2,31],39:[2,31],40:[2,31],41:[2,31],46:[2,31],47:[2,31],48:[2,31]},{5:[2,32],8:[2,32],9:[2,32],14:[2,32],17:[2,32],18:[2,32],19:[2,32],20:[2,32],21:[2,32],22:[2,32],23:[2,32],24:[2,32],35:[2,32],36:[2,32],37:[2,32],38:[2,32],39:[2,32],40:[2,32],41:[2,32],46:[2,32],47:[2,32],48:[2,32]},{5:[2,35],8:[2,35],9:[2,35],14:[2,35],17:[2,35],18:[2,35],19:[2,35],20:[2,35],21:[2,35],22:[2,35],23:[2,35],24:[2,35],35:[2,35],36:[2,35],37:[2,35],38:[2,35],39:[2,35],40:[2,35],41:[2,35],46:[2,35],47:[2,35],48:[2,35]},{5:[2,36],8:[2,36],9:[2,36],14:[2,36],17:[2,36],18:[2,36],19:[2,36],20:[2,36],21:[2,36],22:[2,36],23:[2,36],24:[2,36],35:[2,36],36:[2,36],37:[2,36],38:[2,36],39:[2,36],40:[2,36],41:[2,36],46:[2,36],47:[2,36],48:[2,36]},{5:[2,37],8:[2,37],9:[2,37],14:[2,37],17:[2,37],18:[2,37],19:[2,37],20:[2,37],21:[2,37],22:[2,37],23:[2,37],24:[2,37],35:[2,37],36:[2,37],37:[2,37],38:[2,37],39:[2,37],40:[2,37],41:[2,37],46:[2,37],47:[2,37],48:[2,37]},{5:[2,34],8:[2,34],9:[2,34],14:[2,34],17:[2,34],18:[2,34],19:[2,34],20:[2,34],21:[2,34],22:[2,34],23:[2,34],24:[2,34],35:[2,34],36:[2,34],37:[2,34],38:[2,34],39:[2,34],40:[2,34],41:[2,34],46:[2,34],47:[2,34],48:[2,34]},{5:[2,38],8:[2,38],9:[2,38],14:[2,38],17:[2,38],18:[2,38],19:[2,38],20:[2,38],21:[2,38],22:[2,38],23:[2,38],24:[2,38],35:[2,38],36:[2,38],37:[2,38],38:[2,38],39:[2,38],40:[2,38],41:[2,38],46:[2,38],47:[2,38],48:[2,38]},{5:[2,39],8:[2,39],9:[2,39],14:[2,39],17:[2,39],18:[2,39],19:[2,39],20:[2,39],21:[2,39],22:[2,39],23:[2,39],24:[2,39],35:[2,39],36:[2,39],37:[2,39],38:[2,39],39:[2,39],40:[2,39],41:[2,39],46:[2,39],47:[2,39],48:[2,39]},{8:[1,34],13:47,16:53,18:[1,48],23:[1,14],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27],48:[1,51],49:52},{1:[2,1]},{9:[1,54]},{5:[2,40],8:[2,40],9:[2,40],14:[2,40],17:[2,40],18:[2,40],19:[2,40],20:[2,40],21:[2,40],22:[2,40],23:[2,40],24:[2,40],35:[2,40],36:[2,40],37:[2,40],38:[2,40],39:[2,40],40:[2,40],41:[2,40],46:[2,40],47:[2,40],48:[2,40]},{9:[1,55],46:[1,56]},{9:[2,43],46:[2,43]},{45:[1,57]},{9:[1,30],42:31,43:32,44:[1,33]},{5:[2,5],9:[2,5]},{8:[1,34],13:47,16:58,18:[1,48],23:[1,14],25:15,27:43,29:[1,59],30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{5:[2,9],8:[2,9],9:[2,9],14:[2,9],17:[2,9],18:[1,39],19:[1,38],20:[1,40],21:[1,41],22:[1,42],23:[2,9],35:[2,9],36:[2,9],37:[2,9],38:[2,9],39:[2,9],40:[2,9],41:[2,9],47:[2,9]},{8:[1,34],13:60,23:[1,14],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{8:[1,34],13:61,23:[1,14],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{8:[1,34],13:62,23:[1,14],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{8:[1,34],13:63,23:[1,14],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{8:[1,34],13:64,23:[1,14],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{5:[2,27],8:[2,27],9:[2,27],14:[2,27],17:[2,27],18:[2,27],19:[2,27],20:[2,27],21:[2,27],22:[2,27],23:[2,27],24:[2,27],35:[2,27],36:[2,27],37:[2,27],38:[2,27],39:[2,27],40:[2,27],41:[2,27],46:[2,27],47:[2,27],48:[2,27]},{8:[1,34],13:47,16:65,18:[1,48],23:[1,14],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{8:[2,21],18:[2,21],23:[2,21],35:[2,21],36:[2,21],37:[2,21],38:[2,21],39:[2,21],40:[2,21],41:[2,21],47:[2,21]},{6:66,8:[1,67]},{5:[2,12],8:[2,12],9:[2,12],14:[2,12],17:[2,12],18:[1,39],19:[1,38],20:[1,40],21:[1,41],22:[1,42],23:[2,12],35:[2,12],36:[2,12],37:[2,12],38:[2,12],39:[2,12],40:[2,12],41:[2,12],46:[2,12],47:[2,12],48:[2,12]},{8:[1,34],13:68,23:[1,14],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{18:[1,39],19:[1,38],20:[1,40],21:[1,41],22:[1,42],24:[1,69]},{5:[2,26],8:[2,26],9:[2,26],14:[2,26],17:[2,26],18:[2,26],19:[2,26],20:[2,26],21:[2,26],22:[2,26],23:[2,26],24:[2,26],35:[2,26],36:[2,26],37:[2,26],38:[2,26],39:[2,26],40:[2,26],41:[2,26],46:[2,26],47:[2,26],48:[2,26]},{5:[2,45],8:[2,45],9:[2,45],14:[2,45],17:[2,45],18:[2,45],19:[2,45],20:[2,45],21:[2,45],22:[2,45],23:[2,45],24:[2,45],35:[2,45],36:[2,45],37:[2,45],38:[2,45],39:[2,45],40:[2,45],41:[2,45],46:[2,45],47:[2,45],48:[2,45]},{48:[1,70]},{46:[1,71],48:[2,47]},{5:[2,4],8:[2,4],9:[2,4],14:[2,4],17:[2,4],23:[2,4],35:[2,4],36:[2,4],37:[2,4],38:[2,4],39:[2,4],40:[2,4],41:[2,4],47:[2,4]},{5:[2,41],8:[2,41],9:[2,41],14:[2,41],17:[2,41],18:[2,41],19:[2,41],20:[2,41],21:[2,41],22:[2,41],23:[2,41],24:[2,41],35:[2,41],36:[2,41],37:[2,41],38:[2,41],39:[2,41],40:[2,41],41:[2,41],46:[2,41],47:[2,41],48:[2,41]},{43:72,44:[1,33]},{8:[1,34],13:47,16:73,18:[1,48],23:[1,14],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{5:[2,22],8:[2,22],9:[2,22],14:[2,22],17:[2,22],23:[2,22],35:[2,22],36:[2,22],37:[2,22],38:[2,22],39:[2,22],40:[2,22],41:[2,22],47:[2,22]},{23:[1,74],30:75,47:[1,27]},{5:[2,14],8:[2,14],9:[2,14],14:[2,14],17:[2,14],18:[2,14],19:[2,14],20:[1,40],21:[1,41],22:[1,42],23:[2,14],24:[2,14],35:[2,14],36:[2,14],37:[2,14],38:[2,14],39:[2,14],40:[2,14],41:[2,14],46:[2,14],47:[2,14],48:[2,14]},{5:[2,15],8:[2,15],9:[2,15],14:[2,15],17:[2,15],18:[2,15],19:[2,15],20:[1,40],21:[1,41],22:[1,42],23:[2,15],24:[2,15],35:[2,15],36:[2,15],37:[2,15],38:[2,15],39:[2,15],40:[2,15],41:[2,15],46:[2,15],47:[2,15],48:[2,15]},{5:[2,16],8:[2,16],9:[2,16],14:[2,16],17:[2,16],18:[2,16],19:[2,16],20:[2,16],21:[2,16],22:[1,42],23:[2,16],24:[2,16],35:[2,16],36:[2,16],37:[2,16],38:[2,16],39:[2,16],40:[2,16],41:[2,16],46:[2,16],47:[2,16],48:[2,16]},{5:[2,17],8:[2,17],9:[2,17],14:[2,17],17:[2,17],18:[2,17],19:[2,17],20:[2,17],21:[2,17],22:[1,42],23:[2,17],24:[2,17],35:[2,17],36:[2,17],37:[2,17],38:[2,17],39:[2,17],40:[2,17],41:[2,17],46:[2,17],47:[2,17],48:[2,17]},{5:[2,18],8:[2,18],9:[2,18],14:[2,18],17:[2,18],18:[2,18],19:[2,18],20:[2,18],21:[2,18],22:[2,18],23:[2,18],24:[2,18],35:[2,18],36:[2,18],37:[2,18],38:[2,18],39:[2,18],40:[2,18],41:[2,18],46:[2,18],47:[2,18],48:[2,18]},{5:[2,10],8:[2,10],9:[2,10],14:[2,10],17:[2,10],23:[2,10],35:[2,10],36:[2,10],37:[2,10],38:[2,10],39:[2,10],40:[2,10],41:[2,10],47:[2,10]},{5:[2,11],8:[2,11],9:[2,11],14:[2,11],17:[2,11],23:[2,11],35:[2,11],36:[2,11],37:[2,11],38:[2,11],39:[2,11],40:[2,11],41:[2,11],47:[2,11]},{7:29,8:[1,34],10:6,11:7,12:8,13:10,14:[1,11],17:[1,12],23:[1,14],25:15,27:9,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27]},{5:[2,13],8:[2,13],9:[2,13],14:[2,13],17:[2,13],18:[1,39],19:[1,38],20:[1,40],21:[1,41],22:[1,42],23:[2,13],35:[2,13],36:[2,13],37:[2,13],38:[2,13],39:[2,13],40:[2,13],41:[2,13],46:[2,13],47:[2,13],48:[2,13]},{5:[2,19],8:[2,19],9:[2,19],14:[2,19],17:[2,19],18:[2,19],19:[2,19],20:[2,19],21:[2,19],22:[2,19],23:[2,19],24:[2,19],35:[2,19],36:[2,19],37:[2,19],38:[2,19],39:[2,19],40:[2,19],41:[2,19],46:[2,19],47:[2,19],48:[2,19]},{5:[2,46],8:[2,46],9:[2,46],14:[2,46],17:[2,46],18:[2,46],19:[2,46],20:[2,46],21:[2,46],22:[2,46],23:[2,46],24:[2,46],35:[2,46],36:[2,46],37:[2,46],38:[2,46],39:[2,46],40:[2,46],41:[2,46],46:[2,46],47:[2,46],48:[2,46]},{8:[1,34],13:47,16:53,18:[1,48],23:[1,14],25:15,27:43,30:20,31:16,32:17,33:18,34:19,35:[1,13],36:[1,24],37:[1,21],38:[1,22],39:[1,23],40:[1,25],41:[1,26],47:[1,27],49:76},{9:[2,44],46:[2,44]},{9:[2,42],46:[2,42]},{24:[1,77],30:78,47:[1,27]},{6:79,8:[1,67]},{48:[2,48]},{6:80,8:[1,67]},{24:[1,81]},{5:[2,25],8:[2,25],9:[2,25],14:[2,25],17:[2,25],23:[2,25],35:[2,25],36:[2,25],37:[2,25],38:[2,25],39:[2,25],40:[2,25],41:[2,25],47:[2,25]},{5:[2,23],8:[2,23],9:[2,23],14:[2,23],17:[2,23],23:[2,23],35:[2,23],36:[2,23],37:[2,23],38:[2,23],39:[2,23],40:[2,23],41:[2,23],47:[2,23]},{6:82,8:[1,67]},{5:[2,24],8:[2,24],9:[2,24],14:[2,24],17:[2,24],23:[2,24],35:[2,24],36:[2,24],37:[2,24],38:[2,24],39:[2,24],40:[2,24],41:[2,24],47:[2,24]}],
defaultActions: {3:[2,2],4:[2,3],28:[2,1],76:[2,48]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:/* skip comment */
break;
case 2:/* skip comment */
break;
case 3:return 20
break;
case 4:return 21
break;
case 5:return 18
break;
case 6:return 19
break;
case 7:return 22
break;
case 8:return 23
break;
case 9:return 24
break;
case 10:return 8
break;
case 11:return 9
break;
case 12:return 47
break;
case 13:return 48
break;
case 14:return 46
break;
case 15:return 39
break;
case 16:return 38
break;
case 17:return 40
break;
case 18:return 41
break;
case 19:return 14
break;
case 20:return 26
break;
case 21:return 17
break;
case 22:return 29
break;
case 23:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 36;
break;
case 24:return 37;
break;
case 25:return 35
break;
case 26:return 28
break;
case 27:return 5
break;
case 28:return 'INVALID'
break;
}
};
lexer.rules = [/^\s+/,/^\/\/[^\n]*/,/^#[^\n]*/,/^\*/,/^\//,/^-/,/^\+/,/^\^/,/^\(/,/^\)/,/^\{/,/^\}/,/^\[/,/^\]/,/^,/,/^PI\b/,/^E\b/,/^true\b/,/^false\b/,/^(set )/,/^(color|pen-size)/,/^(repeat|REPEAT)/,/^(function)/,/^"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,/^-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,/^[a-zA-Z]+([a-zA-Z_]*)?\b/,/^=/,/^$/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = grammar;
exports.parse = function () { return grammar.parse.apply(grammar, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}