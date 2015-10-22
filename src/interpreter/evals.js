/* @flow */
const lookup = (env, v) => {
  if (!env || !env.bindings) {
    throw new Error("Undefined variable " + v);
  }
  if (env.bindings.hasOwnProperty(v)) {
    return env.bindings[v];
  }
  return lookup(env.outer, v);
};

const exists = (env, v) => {
  if (!env || !env.bindings) {
    return false;
  }
  if (env.bindings.hasOwnProperty(v)) {
    return true;
  }
  return exists(env.outer, v);
};

const update = (env, v, val) => {
  if (!env || !env.bindings) {
    throw new Error("Undefined variable " + v);
  }
  if (env.bindings.hasOwnProperty(v)) {
    env.bindings[v] = val;
    return 0;
  } else {
    return update(env.outer, v, val);
  }

};

const add_binding = (env, stmt, value) => {
  // redefine if already exists
  var e = env;
  while (e.hasOwnProperty("bindings")) {
    if (e.bindings.hasOwnProperty(stmt)) {
      e.bindings[stmt] = value;
      return 0;
    }
    e = e.outer;
  }

  env.bindings[stmt] = value;
};

const thunk = (f, ...args) => ({
  tag: 'thunk',
  func: f,
  args: args
});

const thunkVal = val => ({
  tag: 'val',
  val
});

const stepStart = (expr, env) => ({
  data: evalExpr(expr, env, thunkVal),
  done: false
});

const stepOne = state => {
  const th = state.data;
  if (th.tag == 'val') {
    state.data = th.val;
    state.done = true;
  }
  else if (th.tag === 'thunk') {
    if (!th.func || !th.func.apply) {
      console.error("what", th);
    }
    state.data = th.func.apply(null, th.args);
  }
  else {
    throw new Error('bad thunk');
  }
  return state;
};

// this is a trampoline...
const evalAll = (expr, env, cb) => {
  var state = stepStart(expr, env);
  const evals = state => {
    stepOne(state);
    if (!state.done) {
      setTimeout(() => {
        evals(state);
      }, 100);
    } else {
      cb(state.data);
    }
  };

  evals(state);
};

const evalExpr = (expr, env, cont) => {
  if (typeof expr === "number" || typeof expr === "string") {
    return thunk(cont, expr);
  }
  switch(expr.tag) {

  case "call":
    const func = lookup(env, expr.name);
    if (!func) {
      throw new Exception("No such function " + expr.name);
    }

    // TODO: hardcoded <= 2 args. Change to .reduce...
    const args = expr.args;
    if (!args.length) {
      return thunk(cont, func.apply(null));
    }
    if (args.length === 1) {
      return thunk(
        evalExpr, args[0], env, val => thunk(
          cont, func.apply(null, [val])
        )
      );
    }
    return thunk(
      evalExpr, args[0], env, leftVal => thunk(
        evalExpr, args[1], env, rightVal => thunk(
          cont, func.apply(null, [leftVal, rightVal])
        )
      )
    );

  case "ident":
    return thunk(cont, lookup(env, expr.name));

  default:
    throw new Error("Unknown form: " + expr.tag);

  }
};


const evalStatement = (stmt, env, cb) => {
  //var val;

  // Special forms
  switch(stmt.tag) {

  case "expr":
    return evalAll(stmt.body, env, v => {
      cb(v);
    });
    /*
  case "loop":
    // Todo: change to single-step model. Shouldn't execute entire loop at once.
    if (!exists(env, stmt.ident)) {
      add_binding(env, stmt.ident, 0);
    }
    var lastValue = 0;
    for (var i = stmt.from; i < stmt.to; ++i) {
      update(env, stmt.ident, i);
      lastValue = evalStatements(stmt.body, env);
    }
    return lastValue;

  case "=":
    // Create var if not exists yet.
    if (!exists(env, stmt.left)) {
      add_binding(env, stmt.left, 0);
    }
    val = evalExpr(stmt.right, env);
    update(env, stmt.left, val);
    return val;

  case "if":
    if (evalExpr(stmt.expr, env)) {
      val = evalStatements(stmt.body, env);
    }
    return val;

  case "ifelse":
    if (evalExpr(stmt.expr, env)) {
      val = evalStatements(stmt.body, env);
    } else {
      val = evalStatements(stmt.body2, env);
    }
    return val;
*/

  case "define":
    const func = function() {
      const bindings = stmt.args.reduce((b, arg, i) => {
        b[arg] = arguments[i];
        return b;
      }, {});
      const newEnv = { bindings, outer: env };
      return evalStatements(stmt.body, newEnv);
    };

    add_binding(env, stmt.name, func);
    cb && cb(0);
    return 0;

  case "comment":
    // TODO: remove from input?
    return null;
  default:
    console.log("syntax error? unknown statement:", stmt.tag);
  }
};

const evalStatements = (stmts, env) => {
  if (stmts.length) {
    evalStatement(stmts[0], env, () => evalStatements(stmts.slice(1), env));
  }
};

module.exports = {
  evalExpr,
  evalStatement,
  evalStatements,
  lookup,

  evalAll,
  stepOne
};
