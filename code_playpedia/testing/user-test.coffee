async   = require 'async'
assert  = require('chai').assert
browser = do require('../mocks/browser.js').browser
request = require 'request'
config  = require '../config.js'
common  = require '../common.js'


register = "
  <form method='post'>
    <input name='username' />
    <input name='password' />
    <input type='submit' id='register' />
  </form>
"

describe 'Register', ->
  it 'Simple', (done) ->
    setTimeout (-> console.log common), 500
    #common.onload ->
    #  common.app.get 'register', (req, res) ->
    #    res.send register

    form = form:
      key: 'value'


    request.post 'http://localhost:3333/register', form, (err) ->
      assert.notOk err 
      do done
