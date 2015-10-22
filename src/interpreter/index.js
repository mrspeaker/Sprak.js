const parse = require("./parser");
const evals = require("./evals");
const Env = require("./env");

function run (prog, env, out) {
  const parsed = parse(prog);
  const functions = parsed.filter(a => a.tag === "define");
  const theRest = parsed.filter(a => a.tag !== "define");
  try {
    evals.evalStatements([...functions, ...theRest], env, (o) => {
      console.log(o, env.output);
      out.innerHTML = env.output.join("\n");
    });
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
