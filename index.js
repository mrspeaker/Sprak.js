const parse = require('./parser');
const evals = require('./evals');
const Env = require('./env');

const env = Env();

const progDom = document.querySelector('#prog');

const p = `# Welcome to Sprak, yo!
var a = 1.5
var b = Random()
var c = 2

# Print it out!
ClearText()
Print("Welcome to Sprak.")
Bar()
Print("Some math:")
Print((a + b) * c)
Bar()

void Bar()
  Print("==============")
end

`;

progDom.value = p;

const parsed = parse(p);
const functions = parsed.filter(a => a.tag === "define");
const theRest = parsed.filter(a => a.tag !== "define");

try {
  evals.evalStatements([...functions, ...theRest], env);
} catch (e) {
  console.log("err:", e);
}

document.querySelector("#screen").innerHTML = env.output.join("\n");
document.querySelector("#out").innerHTML = `--AST--

${JSON.stringify(parsed, null, 2)}`;
