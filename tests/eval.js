"use strict";
const evals = require("../src/interpreter/evals");
const parse = require("../src/interpreter/parser");
const tester = require("./tester");
const equal = tester.equal;

console.log("🌴  🌴  🌴  Evaluator 🌴  🌴  🌴");
console.log("");

const env = {
  outer:{},
  bindings: {
    "+": (x, y) => x + y,
    "*": (x, y) => x * y,
    "Print": (msg) => console.log(msg)
  }
};

equal(
  "Comments eval to null",
  null,
  evals.evalStatements([{"tag":"comment","val":" Hello, World"}], env)
);

equal(
  "1 + 1 = 2",
  2,
  evals.evalStatements(
    [{"tag":"expr","body":{"tag":"call","name":"+","args":[1,1]}}],
    env)
);

equal(
  "2 + 2 * 2 = 6",
  6,
  evals.evalStatements(parse(`2 + 2 * 2`), env));

equal(
  "(2 + 2) * 2 = 8",
  8,
  evals.evalStatements(parse(`(2 + 2) * 2`), env));

console.log("");
