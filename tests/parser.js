"use strict";
const parse = require("../src/interpreter/parser");
const tester = require("./tester");
const deep = tester.deep;

console.log("🌴  🌴  🌴  Parser 🌴  🌴  🌴");
console.log("");

deep(
  "Comment. # Hello, World.",
  parse(`# Hello, World`),
  [{"tag":"comment","val":" Hello, World"}]
);

deep(
  "Simple value",
  parse(`"hi"`),
  [ { tag: 'expr', body: "hi" } ]);

deep(
  "Compound expression. (2 + 2) * 2.",
  parse(`(2 + 2) * 2`),
  [{"tag":"expr","body":{"tag":"call","name":"*","args":[{"tag":"call","name":"+","args":[2,2]},2]}}]);


deep(
  "Assignment to variable",
  parse(`var a = 1`),
  [{"tag":"=","left":"a","right":1}]
);

deep(
  "Function call, no args",
  parse(`ClearText()`),
  [{"tag":"expr","body":{"tag":"call","name":"ClearText","args":[]}}]);

deep(
  "Function call, one arg",
  parse(`Print("hey")`),
  [{"tag":"expr","body":{"tag":"call","name":"Print","args":["hey"]}}]);

deep(
  "Function call, multiple args",
  parse(`SaveMemory("life", 42)`),
  [{"tag":"expr","body":{"tag":"call","name":"SaveMemory","args":["life",42]}}]
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

deep(
  "function definition",
  parse(
`void Say()
  # test
end`),
  [{"tag":"define","name":"Say","args":[],"body":[{"tag":"comment","val":" test"}]}]
);

deep(
  "loop i from 0 to 10",
  parse(
`loop i from 0 to 10
  Print(i)
end
`),
  [{"tag":"loop","ident":"i","body":[{"tag":"expr","body":{"tag":"call","name":"Print","args":[{"tag":"ident","name":"i"}]}}],"from":0,"to":10}]
);

console.log("");
