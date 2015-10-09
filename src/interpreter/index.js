const parse = require("./parser");
const evals = require("./evals");
const Env = require("./env");

function run (prog, env) {
  const parsed = parse(prog);
  const functions = parsed.filter(a => a.tag === "define");
  const theRest = parsed.filter(a => a.tag !== "define");

  try {
    evals.evalStatements([...functions, ...theRest], env);
  } catch (e) {
    console.log("err:", e);
  }
}

module.exports = {
  Env,
  evals,
  parse,
  run
};
