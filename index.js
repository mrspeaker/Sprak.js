const parse = require('./parser');
const evals = require('./evals');
const Env = require('./env');
const assert = require('assert');

assert.deepEqual(parse(`var a = 1`), [{"tag":"=","left":"a","right":1}]);
assert.deepEqual(parse(`Print("hey")`), [{"tag":"ignore","body":{"tag":"call","_":"a","name":"Print","args":["hey"]}}]);

const env = Env();

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

const progDom = document.querySelector('#prog');
document.querySelector("#run").addEventListener("click", () => parseNRide(progDom.value), false);
progDom.value = p;

function parseNRide(prog) {
  const parsed = parse(prog);
  const functions = parsed.filter(a => a.tag === "define");
  const theRest = parsed.filter(a => a.tag !== "define");

  try {
    evals.evalStatements([...functions, ...theRest], env);
  } catch (e) {
    console.log("err:", e);
  }

  document.querySelector("#screen").innerHTML = env.output.join("\n");
  document.querySelector("#out").innerHTML = "--AST--\n\n" + JSON.stringify(parsed, null, 2);
}
parseNRide(progDom.value);
