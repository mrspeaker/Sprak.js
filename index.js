const parse = require('./parser');
const evals = require('./evals');
const Env = require('./env');

const env = Env();

const p = `# Welcome to Sprak, yo!
var a = 1.5
var b = Random()
var c = 2

# Print it out!
ClearText()
Print("Welcome to Sprak.")
Print((a + b) * c)

# Lol things
void Lol()
  # oh, lol
  Print("lololol.")
end
`;

const parsed = parse(p.split('\n')
//  .filter(l => l.trim() !== "") // Remove empty lines
  .join('\n'));
  //.map(l => parse(l)); // Parse each line

try {
  evals.evalStatements(parsed, env);
} catch (e) {
  console.log("err:", e);
}

document.body.innerHTML = `<pre>--PROGRAM--
${p}


--DISPLAY--
${env.output.join("\n")}


--AST--

${JSON.stringify(parsed, null, 2)}</pre>`;
