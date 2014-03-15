for (var member in require.cache) { if(member.indexOf('used_temporary')>=0) delete require.cache[member]; }
(function() {
  var assert;

  assert = require('chai').assert;

  describe('Arguments', function() {
    return it('pop() works', function() {
      var args, result;
      args = function() {
        return Array.prototype.slice.call(arguments, 0);
      };
      result = args("1", "2", "3");
      assert.equal(result.pop(), "3");
      assert.equal(result.length, 2);
      return assert.equal(result.toString(), ["1", "2"].toString());
    });
  });

}).call(this);
