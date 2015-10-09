const PEG = require("pegjs");
const peg = `
  start
    = ws seq:statements { return seq; }

  // Missing some chars, I bet
  char = [ a-zA-Z0-9!#$%&\'\(\)*+,-\.=:/]

  number_frac
    = '.' digs:[0-9]* { return '.' + digs.join(''); }

  number
    = digs:[0-9]+ frac:number_frac?
      { return parseFloat(digs.join('') + frac); }
    / '-' digs:[0-9]+ frac:number_frac?
      { return -parseFloat(digs.join('') + frac); }

  string
    = '\\"' ch:char* '\\"' { return ch.join(''); }

  comment = '#' rest:char* { return rest.join(''); }

  dataType = "string" / "number" / "void"

  validIdentFirstChar = [a-zA-Z_]
  validIdentChar = [0-9a-zA-Z_]
  identifier =
    f:validIdentFirstChar chars:validIdentChar* { return f + chars.join(''); }

  statement
    = c:comment ws br { return { tag: "comment", val: c} }

    / "var" sigws v:identifier ws "=" ws ex:expression ws br
      { return { tag:"=", left:v, right:ex }; }

    / t:dataType sigws v:identifier ws "(" ws ")" ws br body:statements end
        { return { tag:"define", name:v, args: [], body:body }; }
    / t:dataType sigws v:identifier ws "(" ws args:ident_list ws ")" ws br body:statements end
        { return { tag:"define", name:v, args: args, body:body }; }

    / "if" sigws ex:expression ws br body:statements else body2:statements end
      { return { tag:"ifelse", expr:ex, body:body, body2:body2 }; }
    / "if" sigws ex:expression ws br body:statements ws end
      { return { tag:"if", expr:ex, body:body }; }

    / "loop" sigws v:identifier sigws
        "from" sigws from:number sigws
        "to" sigws to:number ws br
        body:statements end
        { return { tag:"loop", ident:v, body:body, from:from, to:to }; }

    / ex:expression ws br { return { tag:"expr", body:ex }; }

  end = 'end' ws br
  else = 'else' ws br

  nonKeywordStatement = !else !end s:statement { return s }
  statements
     = ws s:nonKeywordStatement ss:statements* ws
     { return ss.reduce((ac, el) => { el.forEach(e => ac.push(e)); return ac; }, [s]); }
     / ws s:nonKeywordStatement { return [s]; }

  expression
    = ex:comparative { return ex; }

  comp_op = "<=" / ">=" / "==" / "<>" / "<" / ">"
  comparative
    = left:additive ws op:comp_op ws right:comparative
      { return {tag:'call', name:op, args:[left, right]}; }
    / additive

  additive_op = "+" / "-"
  additive
    = left:multiplicative ws op:additive_op ws right:additive
      { return {tag:'call', name:op, args:[left, right]}; }
    / multiplicative

  mult_op = "*" / "/" / "Mod"
  multiplicative
      = left:primary ws op:mult_op ws right:multiplicative
          { return {tag:'call', name:op, args:[left, right]}; }
      / primary

  primary
    = number
    / string
    / v:identifier "(" ws ")" { return { tag:"call", name:v, args:[] }; }
    / v:identifier ws "(" ws args:arglist ws ")" { return { tag:"call", name:v, args:args }; }
    / v:identifier { return { tag:"ident", name:v }; }
    / "(" ws ex:expression ws ")" { return ex; }

  comma_expression = "," ws ex:expression { return ex; }

  arglist
    = first:expression rest:comma_expression* { return [first].concat(rest); }

  comma_identifier = "," ws v:identifier { return v; }

  ident_list
      = first:identifier rest:comma_identifier*
        { return [first].concat(rest); }

  ws = [ \\t]*
  sigws = [ \\t]+
  br = [\\r\\n]+ / !.

`;
const parser = PEG.buildParser(peg);

module.exports = parser.parse;
