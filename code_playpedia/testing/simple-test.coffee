
assert = require('chai').assert;

describe 'Arguments', ->
  it 'pop() works', ->
    args = ->
      return Array.prototype.slice.call(arguments, 0)

    result = args("1", "2", "3")

    assert.equal(result.pop(), "3");
    assert.equal(result.length, 2);
    assert.equal(result.toString(), ["1", "2"].toString());