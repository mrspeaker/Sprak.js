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
      'Print': (msg) => env.output.push(msg),
      'Random': () => Math.random()
    }
  };

  return env;
}

module.exports = Env;
