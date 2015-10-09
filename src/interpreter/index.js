const assert = require("assert");
const parse = require("./parser");
const evals = require("./evals");
const Env = require("./env");

function run (prog, env) {
  const parsed = parse(prog);
  console.log(JSON.stringify(parsed, null, 2))
  const functions = parsed.filter(a => a.tag === "define");
  const theRest = parsed.filter(a => a.tag !== "define");

  try {
    evals.evalStatements([...functions, ...theRest], env);
  } catch (e) {
    console.log("err:", e);
  }
}

// Testin' some things
assert.deepEqual(parse(`var a = 1`), [{"tag":"=","left":"a","right":1}]);
assert.deepEqual(parse(`Print("hey")`), [{"tag":"ignore","body":{"tag":"call","_":"a","name":"Print","args":["hey"]}}]);

module.exports = {
  Env,
  evals,
  parse,
  run
};
