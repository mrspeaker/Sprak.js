"use strict";
const assert = require("assert");
const parse = require("../src/interpreter/parser");

function deep (msg, val, expected) {
  let passed = false;
  try {
    assert.deepEqual(val, expected, msg);
    passed = true;
  } catch (e) {
    console.log("😡  FAIL");
    console.log(e);
    console.log(JSON.stringify(e.actual));
  }
  if (passed) {
    console.log("😀  " + msg);
  }
}

deep(
  "Simple value",
  parse(`"hi"`),
  [ { tag: 'ignore', body: "hi" } ]);

deep(
  "Assignment to variable",
  parse(`var a = 1`),
  [{"tag":"=","left":"a","right":1}]
);

deep(
  "Function call, no args",
  parse(`ClearText()`),
  [{"tag":"ignore","body":{"tag":"call","name":"ClearText","args":[]}}]);

deep(
    "Function call, one arg",
    parse(`Print("hey")`),
    [{"tag":"ignore","body":{"tag":"call","name":"Print","args":["hey"]}}]);

// deep()
