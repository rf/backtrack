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

var res = test.solve();

console.dir(res);

var test2 = new backtrack.Expression();
test2.xor('foo@2.3', 'foo@2.2', 'foo@2.1');
test2.xor('bar@2.3', 'bar@2.2', 'bar@1.1');
test2.xor('baz@2.3', 'baz@1.2', 'baz@1.1');

test2.or('-foo@2.1', 'bar@2.2');
test2.or('-foo@2.3', 'bar@2.2');

test2.or('-baz@2.3', 'bar@2.3');
test2.or('-baz@1.2', 'bar@2.2');

console.dir(test2.solve());
