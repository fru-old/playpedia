for (var member in require.cache) { if(member.indexOf('used_temporary')>=0) delete require.cache[member]; }
(function() {
  var assert, async, browser;

  async = require('async');

  assert = require('chai').assert;

  browser = require('../mocks/browser.js').browser();

  describe('Browser', function() {
    return it('Hello World', function(done) {
      return browser.visit('/hello', function() {
        return browser.text('test', function(test) {
          assert.equal(test, "Hello World");
          return done();
        });
      });
    });
  });

}).call(this);
