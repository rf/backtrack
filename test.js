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
