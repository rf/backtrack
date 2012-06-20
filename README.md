# backtrack

[![build status](https://secure.travis-ci.org/russfrank/backtrack.png)](http://travis-ci.org/russfrank/backtrack)

This is a simple backtracking SAT solver written in javascript.  I wrote it
partially because I needed a SAT solver and partially because I was unable to
find a simple example of such an algorithm online.

It has no dependencies and it is written in clean ECMAScript 5.  It expects
input in Conjunctive Normal Form and will output a model which satisfies the
given set of clauses.

You can install it like this:

```shell
$ npm i backtrack
```

and use it like this

```javascript
var solve = require('backtrack').solve;

var clauses = [
  ['blue', 'green', '-yellow'],
  ['-blue', '-green', 'yellow'],
  ['pink', 'purple', 'green', 'blue', '-yellow']
];

var variables = ['blue', 'green', 'yellow', 'pink', 'purple'];

var model = solve(variables, clauses);
// model => { purple: true, pink: true, yellow: true, green: true }
```

Read the [annotated source](http://russfrank.us/static/backtrack/backtrack.html)!

Tests are written in mocha

```shell
$ npm test
```

You can also pass in a model and the solver will inform you if the expression
is satisfiable under the assumptions you have given it:

```javascript
var solvable = solve(variables, clauses, {blue: true, yellow: false, green: true});
// solvable => false
```

Since the second clause is now unsolvable, the entire expression is unsolvable.

# License
MIT
