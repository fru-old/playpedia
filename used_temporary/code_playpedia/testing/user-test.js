(function() {
  var assert, async, browser, register, request, server;

  async = require('async');

  assert = require('chai').assert;

  browser = require('../mocks/browser.js').browser();

  request = require('request');

  server = require('../server.js');

  register = "<form method='post'> <input name='username' /> <input name='password' /> <input type='submit' id='register' /> </form>";

  describe('Register', function() {
    return it('Simple', function(done) {
      var form;
      server.onload(function() {
        return server.app.get('register', function(req, res) {
          return res.send(register);
        });
      });
      form = {
        form: {
          key: 'value'
        }
      };
      return request.get('http://localhost:3333/register', form, function(err) {
        assert.notOk(err);
        return done();
      });
    });
  });

}).call(this);
