"use strict";
const evals = require("../src/interpreter/evals");
const tester = require("./tester");
const equal = tester.equal;
const deep = tester.deep;

console.log("🌴  🌴  🌴  Cont 🌴  🌴  🌴");
console.log("");

const env = {
  outer:{},
  bindings: {
    "+": (x, y) => x + y,
    "*": (x, y) => x * y,
    "Print": (msg) => console.log(msg),
    a: 1
  }
};

const thunkVal = val => ({
  tag: 'val',
  val
});

deep(
  "get primitive thunk",
  evals.evalExpr("primitive", env, thunkVal),
  { tag: 'thunk', func: thunkVal, args: [ 'primitive' ] }
);

deep(
  "Step function (primitive, not done)",
  evals.stepOne({done: false, data:{ tag: 'thunk', func: thunkVal, args: [ 'primitive' ] }}),
  { done: false, data: { tag: 'val', val: 'primitive' } }
);

deep(
  "Step function (primitive, done)",
  evals.stepOne({ done: false, data: { tag: 'val', val: 'primitive' } }),
  { done: true, data: 'primitive' }
);

equal(
  "Comments eval to null",
  evals.evalStatement({"tag":"comment","val":" Hello, World"}, env),
  null);

evals.evalAll("primitive", env, v => {
  equal("primitives eval to primitives", v, "primitive");
});

evals.evalAll(
  {"tag":"call","name":"+","args":[1,2]},
  env,
  v => {
    equal("eval simple expression", v, 3);
  });

evals.evalAll(
  {"tag":"call","name":"*","args":[{"tag":"call","name":"+","args":[2,2]},2]},
  env,
  v => {
    equal("eval compound expression", v, 8);
  });

evals.evalAll({"tag":"ident","name":"a"}, env, v => equal(
  "lookup environment variable", v, 1
));

equal(
  "Define a function",
  evals.evalStatement(
    {"tag":"define","name":"Say","args":[],"body":[{"tag":"comment","val":" test"}]},
    env),
  0);

/*
equal(
  "2 + 2 * 2 = 6",
  6,
  evals.evalStatements(parse(`2 + 2 * 2`), env));

equal(
  "(2 + 2) * 2 = 8",
  8,
  evals.evalStatements(parse(`(2 + 2) * 2`), env));

console.log("");
*/
