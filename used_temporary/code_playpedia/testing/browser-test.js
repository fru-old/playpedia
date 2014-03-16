(function() {
  var assert, async, mock;

  async = require('async');

  assert = require('chai').assert;

  mock = require('../mocks/utilities.js');

  describe('Browser', function() {
    return it('Hello World', function(done) {
      return mock.browser.visit('/hello', function() {
        return mock.browser.text('test', function(test) {
          assert.equal(test, "Hello World");
          return done();
        });
      });
    });
  });

}).call(this);
