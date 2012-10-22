var assert = require('chai').assert;
var backtrack = require('./backtrack');

suite('resolve', function () {
  var model = {
    'blue': true,
    'red': false
  };

  test('undefined inversion', function () {
    assert.strictEqual(backtrack.resolve('-yellow', model), undefined);
  });

  test('defined inversion', function () {
    assert.strictEqual(backtrack.resolve('-blue', model), false);
  });

  test('defined value', function () {
    assert.strictEqual(backtrack.resolve('blue', model), true);
  });

  test('defined inverted value', function () {
    assert.strictEqual(backtrack.resolve('-red', model), true);
  });
});

suite('satisfiable', function () {
  var model = {
    'pink': true,
    'purple': false,
    'green': false,
    'yellow': true,
    'red': false
  };

  test('defined, defined inversion', function () {
    var clause = ['purple', '-pink'];
    var result = backtrack.satisfiable(clause, model);

    assert.strictEqual(result, false);
  });

  test('undefined, undefined inversion', function () {
    var clause = ['orange', '-blue'];
    var result = backtrack.satisfiable(clause, model);

    assert.strictEqual(result, undefined);
  });

  test('defined, undefined inversion', function () {
    var clause = ['yellow', '-blue'];
    var result = backtrack.satisfiable(clause, model);

    assert.strictEqual(result, true);
  });

  test('1 defined, 2 undefined', function () {
    var clause = ['pink', 'orange', '-blue'];
    var result = backtrack.satisfiable(clause, model);

    assert.strictEqual(result, true);
  });

  test('5 undefined', function () {
    var clause = ['chair', 'table', 'coffee', 'phone', 'foobar'];
    var result = backtrack.satisfiable(clause, model);

    assert.strictEqual(result, undefined);
  });
});

suite('update', function () {
  var model = {
    'pink': true,
    'purple': false,
    'green': false,
    'yellow': true,
    'red': false
  };

  var updated = backtrack.update(model, 'foobar', true);

  test('different object', function () {
    assert.notStrictEqual(model, updated);
  });

  test('changing one doesnt affect the other', function () {
    updated.test = false;
    assert.strictEqual(model[test], undefined);
  });

  test('updated value is present', function () {
    assert.strictEqual(updated.foobar, true);
  });
});

suite('solve', function () {
  test('functional test', function () {
    var variables = ['blue', 'green', 'yellow', 'pink', 'purple'];
    var clauses = [
      ['blue', 'green', '-yellow'],
      ['-blue', '-green', 'yellow'],
      ['pink', 'purple', 'green', 'blue', '-yellow']
    ];

    var model = backtrack.solve(variables, clauses);

    clauses.forEach(function (clause) {
      assert(backtrack.satisfiable(clause, model) === true);
    });
  });
});

suite('builder', function () {
  var exp;

  setup(function () { exp = new backtrack.Expression(); });

  test('clauseEqual', function () {
    assert(backtrack.Expression.clauseEqual(['pink', 'blue'], ['blue', 'pink']));
    assert(backtrack.Expression.clauseEqual(['-pink', 'blue'], ['blue', '-pink', 'orange']) === false);
    assert(backtrack.Expression.clauseEqual(['-pink', 'blue', 'orange'], ['blue', '-pink', 'orange']));
    assert(backtrack.Expression.clauseEqual(['-pink', 'blue'], ['blue', '-pink']));
  });

  test('and', function () {
    exp.and('blue', 'green');
    exp.and('pink');
    assert(exp.indexOf(['pink']) !== -1, 'expression contains a clause [pink]');
    assert(exp.indexOf(['blue']) !== -1, 'expression contains a clause [pink]');
    assert(exp.indexOf(['green']) !== -1, 'expression contains a clause [pink]');
  });

  test('or', function () {
    exp.or('blue', 'green');
    exp.or('pink');
    exp.or('purple', '-yellow', 'green');
    assert(exp.indexOf(['blue', 'green']) != -1, 'expression contains a clause [blue, green]');
  });

  suite('xor', function () {

    test('two literal', function () {
      exp.xor('foo', 'bar');
      assert(exp.indexOf(['foo', 'bar']) != -1);
      assert(exp.indexOf(['-foo', '-bar']) != -1);
    });

    test('three literal', function () {
      exp.xor('foo', 'bar', 'baz');
      assert(exp.indexOf(['foo', 'bar', 'baz']) != -1);
      assert(exp.indexOf(['-foo', '-bar']) != -1);
      assert(exp.indexOf(['-bar', '-baz']) != -1);
    });

  });

  test('functional solving test', function () {
    exp.or('blue', 'green', '-yellow');
    exp.or('-blue', '-green', 'yellow');
    exp.or('pink', 'purple', 'green', 'blue', '-yellow');

    var model = exp.solve();

    exp.forEach(function (clause) {
      assert(backtrack.satisfiable(clause, model) === true);
    });
  });
});

