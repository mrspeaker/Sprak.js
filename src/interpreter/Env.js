function Env () {

  const memory = {};

  const env = {
    output: [],
    outer:{},
    bindings: {
      "+": (x, y) => x + y,
      "-": (x, y) => x - y,
      "*": (x, y) => x * y,
      "/": (x, y) => x / y,
      "==": (x, y) => x === y,
      "<>": (x, y) => x !== y,
      ">": (x, y) => x > y,
      "<": (x, y) => x < y,
      ">=": (x, y) => x >= y,
      "<=": (x, y) => x <= y,
      "Sin": a => Math.sin(a),
      "Cos": a => Math.cos(a),
      "Tan": a => Math.tan(a),
      "Atan2": (y, x) => Math.atan2(y, x),
      "Mod": (x, y) => x % y,
      "Random": () => Math.random(),

      "ClearText": () => env.output = [],
      "Print": msg => env.output.push(msg),
      "PlaySound": name => console.log("PlaySound", name),
      "SaveMemory": (key, data) => memory[key] = data,
      "LoadMemory": key => memory[key] || null,
      "RemoteFunctionCall": (id, func, args) => console.log("LoadMemory", id, func, ...args),
      "Sleep": time => console.log("Sleep", time),
      "Input": msg => console.log("Input", msg),
      "Connect": name => console.log("Connect", name),
      "Slurp": name => console.log("Connect", name)
    }
  };

  return env;
}

module.exports = Env;
