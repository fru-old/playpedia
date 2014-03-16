async   = require 'async'
assert  = require('chai').assert
mock    = require '../mocks/utilities.js' 
request = require 'request'
server  = require '../server.js'


register = "
  <form method='post'>
    <input name='username' />
    <input name='password' />
    <input type='submit' id='register' />
  </form>
"

describe 'Register', ->
  it 'Simple', (done) ->
    server.onload ->
      server.app.get 'register', (req, res) ->
        res.send register

    form = form:
      key: 'value'

    request.get 'http://localhost:3333/register', form, (err) ->
      assert.notOk err 
      do done
