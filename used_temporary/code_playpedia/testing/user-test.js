(function() {
  var assert, async, mock, register, request, server;

  async = require('async');

  assert = require('chai').assert;

  mock = require('../mocks/utilities.js');

  request = require('request');

  server = require('../server.js');

  register = "<form method='post' action='/register'> <input name='email' id='email' /> <input name='password' id='password' /> <input type='submit' id='register' /> </form>";

  describe('Register', function() {
    before(function(done) {
      return server.onload(function() {
        mock.setting({
          url: {
            onlogin: "/after"
          }
        });
        server.app.get('/register', function(req, res) {
          return res.send(register);
        });
        server.app.get('/after', function(req, res) {
          return res.send("<test>succeded</test>");
        });
        return done();
      });
    });
    after(function(done) {
      mock.restore();
      return done();
    });
    return it('Simple', function(done) {
      return async.series([
        function(done) {
          return mock.browser.visit('/register', done);
        }, function(done) {
          return mock.browser.fill('#email', 'test@test.com', done);
        }, function(done) {
          return mock.browser.fill('#password', 'test', done);
        }, function(done) {
          return mock.browser.pressButton('#register', done);
        }, function(done) {
          return mock.browser.until('window.location.pathname !== "/register"', done);
        }, function(done) {
          return mock.browser.text('test', function(text) {
            assert.equal(text, "succeded");
            return done();
          });
        }
      ], done);
    });
  });

}).call(this);
