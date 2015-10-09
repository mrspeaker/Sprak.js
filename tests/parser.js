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
  "Comment",
  parse(`# Hello, World`),
  [{"tag":"comment","val":" Hello, World"}]
);

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

deep(
  "Function call, multiple args",
  parse(`SaveMemory("life", 42)`),
  [{"tag":"ignore","body":{"tag":"call","name":"SaveMemory","args":["life",42]}}]
);

// Should work:
/*
  deep() if a == 1 \n end... same line?
*/

deep(
  "if statement, simple",
  parse(
`if a == 1
  # test
end`),
  [{"tag":"if","expr":{"tag":"call","name":"==","args":[{"tag":"ident","name":"a"},1]},"body":[{"tag":"comment","val":" test"}]}]
);

deep(
  "if/else",
  parse(
`if a == 1
  # test
else
  # test
end`),
  [{"tag":"ifelse","expr":{"tag":"call","name":"==","args":[{"tag":"ident","name":"a"},1]},"body":[{"tag":"comment","val":" test"}],"body2":[{"tag":"comment","val":" test"}]}]
);
