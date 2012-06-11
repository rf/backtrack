var solve = require('./backtrack').solve;

var clauses = [
  ['blue', 'green', '-yellow'],
  ['-blue', '-green', 'yellow'],
  ['pink', 'purple', 'green', 'blue', '-yellow']
];

var variables = ['blue', 'green', 'yellow', 'pink', 'purple'];

var model = solve(variables, clauses);

console.dir(model);

var solvable = solve(variables, clauses, {blue: true, yellow: false, green: true});
console.log(solvable);
