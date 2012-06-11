// This is an extremely simple implementation of the 'backtracking' algorithm for
// solving boolean satisfiability problems. It contains no optimizations.

// The input consists of a boolean expression in Conjunctive Normal Form.
// This means it looks something like this:
//
// `(blue OR green) AND (green OR NOT yellow)`
//
// We encode this as an array of strings with a `-` in front for negation:
//
// `[['blue', 'green'], ['green', '-yellow']]`

// ### solve
//
// * `count` is the total number of variables.
// * `clauses` is an array of clauses.
// * `model` is a set of variable assignments. 

function solve (variables, clauses, model) {
  model = model || {};

  // If every clause is satisfiable, return the model which worked.
  if (clauses.every(function (c) { return satisfiable(c, model); }))
    return model;

  // If any clause is **exactly** false, return `false`; this model will not
  // work.
  if (clauses.some(function (c) { return satisfiable(c, model) === false; }))
    return false;

  // Choose a new value to test by simply looping over the possible variables
  // and checking to see if the variable has been given a value yet.  
  var choice;
  for (var i = 0; i < variables.length; i++) {
    if (model[variables[i]] === undefined) {
      choice = variables[i];
    }
  }

  // If there are no more variables to try, return false.
  if (!choice) return false;

  // Recurse into two cases. The variable we chose will need to be either
  // true or false for the expression to be satisfied.
  return solve(variables, clauses, update(model, choice, true)) ||
         solve(variables, clauses, update(model, choice, false));
}

// ### update
// Copies the model, then sets `choice` = `value` in the model, and returns it.

function update (model, choice, value) {
  var copy = {};
  for (var v in model) copy[v] = model[v];
  copy[choice] = value;
  return copy;
}

// ### satisfiable
// Determines whether a clause is satisfiable given a certain model.

function satisfiable (clause, model) {
  // If every variable is false, then the clause is false.
  if (clause.every(function (v) { return resolve(v, model) === false; }))
    return false;
  // If any variable is true, then the clause is true.
  if (clause.some(function (v) { return resolve(v, model) === true; }))
    return true;

  // Otherwise, we don't know what the clause is.
  return undefined;
}

// ### resolve
// Resolve some variable to its actual value, or undefined.

function resolve (variable, model) {
  if (variable[0] == '-') {
    var value = model[variable.slice(1)];
    return value === undefined? undefined : !value;
  } else return model[variable];
}

var phrase = [
  ['blue', 'green', '-yellow'],
  ['-blue', '-green', 'yellow'],
  ['pink', 'purple', 'green', 'blue', '-yellow']
];

var things = ['blue', 'green', 'yellow', 'pink', 'purple'];

console.log(solve(things, phrase));
