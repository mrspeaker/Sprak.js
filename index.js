const parse = require('./parser');
const evals = require('./evals');
const Env = require('./env');

const env = Env();

const p = `
# Welcome to Sprak, yo!
var a = 1.5
var b = Random()
var c = 2

# Print it out!
Print("Welcome to Sprak.")
Print((a + b) * c)
`;

const parsed = p.split('\n')
  .filter(l => l.trim() !== "") // Remove empty lines
  .map(l => parse(l)); // Parse each line

evals.evalProg(parsed, env);

document.body.innerHTML = `<pre>--PROGRAM--${p}


--DISPLAY--
${env.output.join("\n")}


--AST--

${JSON.stringify(parsed, null, 2)}</pre>`;
