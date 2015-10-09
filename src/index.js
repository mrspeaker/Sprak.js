const {Env, run} = require("./interpreter/");
const progs = require("./progs");

const domScreen = document.querySelector("#screen");
const domProgText = document.querySelector("#prog");
const domRun = document.querySelector("#run");
domRun.addEventListener("click", () => runIt(), false);

const env = Env();
const runIt = () => {
  run(domProgText.value, env);
  domScreen.innerHTML = env.output.join("\n");
};

// Init program
domProgText.value = progs.hello;
runIt();
