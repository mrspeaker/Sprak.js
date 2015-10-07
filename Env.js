function Env () {

  const env = {
    output: [],
    outer:{},
    bindings: {
      '+': (x, y) => x + y,
      '-': (x, y) => x - y,
      '*': (x, y) => x * y,
      '/': (x, y) => x / y,
      '==': (x, y) => x === y,
      '<>': (x, y) => x !== y,
      '>': (x, y) => x > y,
      '<': (x, y) => x < y,
      '>=': (x, y) => x >= y,
      '<=': (x, y) => x <= y,
      'sin': a => Math.sin(a),
      'cos': a => Math.cos(a),
      'tan': a => Math.tan(a),
      'atan2': (y, x) => Math.atan2(y, x),
      'mod': (x, y) => x % y,

      'ClearText': () => env.output = [],
      'Print': msg => env.output.push(msg),
      'Random': () => Math.random(),
      'PlaySound': name => console.log("PlaySound", name),
      'SaveMemory': (key, data) => console.log("SaveMemory", key, data),
      'LoadMemory': key => console.log("LoadMemory", ...key),
      'RemoteFunctionCall': (id, func, args) => console.log("LoadMemory", id, func, ...args),
      'Sleep': time => console.log('Sleep', time),
      'Input': msg => console.log('Input', msg),
      'Connect': name => console.log('Connect', name),
    }
  };

  return env;
}

module.exports = Env;
