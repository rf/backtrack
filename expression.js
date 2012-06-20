// Boolean expression builder

var util = require('util');

function Expression () {
  this._literals = {};
}

// An `Expression` is an `Array` of clauses.
util.inherits(Expression, Array);

// ### or
// Add a clause consisting of the provided literals ored together. 
Expression.prototype.or = function () {
  var clause = Array.prototype.slice.call(arguments);
  this._ensure(clause);
  this.push(clause);
};

// ### xor
// Add clauses causing each of the provided arguments to be xored.
Expression.prototype.xor = function () {
  // This first clause is the 'or' portion. "One of them must be true."
  var literals = Array.prototype.slice.call(arguments);
  this._ensure(literals);
  this.push(literals);

  // Then, we generate clauses such that "only one of them is true".
  var that = this;
  for (var i = 0; i < literals.length; i++) {
    for (var j = i + 1; j < literals.length; j++) {
      this._ensure(literals);
      this.push([
        Expression.negateLiteral(literals[i]), 
        Expression.negateLiteral(literals[j])
      ]);
    }
  }
};

// ### and
// Add each of the provided literals into their own clause in the expression.
Expression.prototype.and = function () {
  var literals = Array.prototype.slice.call(arguments);
  var that = this;
  this._ensure(literals);
  literals.forEach(function (item) { that.push([item]); });
};

// ### solve
// Solve this expression with the backtrack solver. Lazy-loads the solver.
Expression.prototype.solve = function () {
  var backtrack = require('./backtrack');
  return backtrack.solve(Object.keys(this._literals), this);
};

// ### _ensure
// Private method that ensures that a particular literal is marked as being in
// the expression.
Expression.prototype._ensure = function ensure (array) {
  var that = this;
  if (!Array.isArray(array)) array = Array.prototype.slice.call(arguments);

  array.forEach(function (item) { that._literals[item] = true; });
};

Expression.prototype.indexOf = function (clause) {
  for (var i = 0; i < this.length; i++) {
    if (Expression.clauseEqual(this[i], clause)) return true;
  }

  return false;
};

Expression.clauseEqual = function (exp1, exp2) {
  for (var i = 0; i < exp1.length; i++) {
    if (exp2.indexOf(exp1[i]) == -1) return false;
  }

  if (exp2.length != exp1.length) return false;

  return true;
};

Expression.negateLiteral = function (literal) {
  if (literal[0] == '-') return literal.slice(1);
  else return '-' + literal;
};

module.exports = Expression;
