for (var member in require.cache) { if(member.indexOf('used_temporary')>=0) delete require.cache[member]; }
(function() {
  var assert, async, browser, common, config, register, request;

  async = require('async');

  assert = require('chai').assert;

  browser = require('../mocks/browser.js').browser();

  request = require('request');

  config = require('../config.js');

  common = require('../common.js');

  register = "<form method='post'> <input name='username' /> <input name='password' /> <input type='submit' id='register' /> </form>";

  describe('Register', function() {
    return it('Simple', function(done) {
      var form;
      setTimeout((function() {
        return console.log(common);
      }), 500);
      form = {
        form: {
          key: 'value'
        }
      };
      return request.post('http://localhost:3333/register', form, function(err) {
        assert.notOk(err);
        return done();
      });
    });
  });

}).call(this);
