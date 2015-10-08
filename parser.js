const PEG = require("pegjs");
const peg = `
  start
    = ws seq:statements { return seq; }

  char = [ a-zA-Z0-9\\?\\!]
  moreChar = [ a-zA-Z0-9!#$%&\'\(\)*+,-\.=:/]

  number_frac
    = '.' chars:[0-9]* { return '.' + chars.join(''); }

  number
    = chars:[0-9]+ frac:number_frac?
      { return parseFloat(chars.join('') + frac); }
    / '-' chars:[0-9]+ frac:number_frac?
      { return -parseFloat(chars.join('') + frac); }

  string
    = '\\"' ch:moreChar* '\\"' { return ch.join(''); }

  comment = '#' rest:moreChar* { return rest.join(''); }

  type = "string" / "number" / "void"

  keywords = "end"
  validfirstchar = [a-zA-Z_]
  validchar = [0-9a-zA-Z_]
  identifier =
    f:validfirstchar chars:validchar* { return f + chars.join(''); }

  nonEndStatement = !end s:statement { return s }

  statement
    = c:comment ws br { return { tag: "comment", val: c} }
    / "var" ws v:identifier ws "=" ws expr:expression ws br
      { return { tag:"=", left:v, right:expr }; }
    / t:type ws v:identifier ws "(" ws ")" br ws body:statements ws end
        { return { tag:"define", name:v, args: [], body:body }; }
    / t:type ws v:identifier ws "(" ws args:ident_list ws ")" br ws body:statements ws end
        { return { tag:"define", name:v, args: args, body:body }; }
    / "if" sigws expr:expression sigws ws body:statements ws "end" ws
      { return { tag:"if", expr:expr, body:body }; }
    / "repeat" ws "(" ws expr:expression ws ")" ws
      "{" ws body:statements ws "}" ws
      { return { tag:"repeat", expr:expr, body:body }; }
    / expr:expression ws br
      { return { tag:"ignore", body:expr }; }

  sep = ';'
  end = 'end' ws br

  statements
     = ws s:nonEndStatement ss:statements* ws
     { return ss.reduce((ac, el) => { el.forEach(e => ac.push(e)); return ac; }, [s]); }
     / ws s:nonEndStatement { return [s]; }

  expression
    = expr:comparative { return expr; }

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

  mult_op = "*" / "/" / "mod"
  multiplicative
      = left:primary ws op:mult_op ws right:multiplicative
          { return {tag:'call', name:op, args:[left, right]}; }
      / primary

  primary
    = number
    / string
    / v:identifier "(" ws ")" { return { tag:"call", name:v, args:[] }; }
    / v:identifier ws "(" ws args:arglist ws ")" { return { tag:"call", _:"a", name:v, args:args }; }
    / v:identifier ws args:arglist { return { tag:"call", _:"b", name:v, args:args }; }
    / v:identifier { return { tag:"ident", name:v }; }
    / "(" ws expression:expression ws ")" { return expression; }

  comma_expression = "," ws expr:expression { return expr; }

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
