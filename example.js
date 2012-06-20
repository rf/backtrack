var backtrack = require('./backtrack');
var solve = backtrack.solve;

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

var test = new backtrack.Expression();
test.xor('a', 'b', 'c');
test.and('a1', 'a2', 'a3');
console.dir(test);
console.dir(test.literals);

var res = solve(test);

console.dir(res);
