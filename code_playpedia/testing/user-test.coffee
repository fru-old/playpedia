async   = require 'async'
assert  = require('chai').assert
mock    = require '../mocks/utilities.js' 
request = require 'request'
server  = require '../server.js'

register = "
  <form method='post' action='/register'>
    <input name='email' id='email' />
    <input name='password' id='password' />
    <input type='submit' id='register' />
  </form>"

describe 'Register', ->
  
  # Setup settings and services
  before (done) ->
    server.onload ->
      mock.setting { url: onlogin: "/after" }
      server.app.get '/register', (req, res) ->
        res.send register
      server.app.get '/after', (req, res) ->
        res.send "<test>succeded</test>"
      do done

  # Restore settings
  after (done) ->
    do mock.restore
    do done

  # Simple test case
  it 'Simple', (done) ->
    async.series [
      (done) -> mock.browser.visit '/register', done
      (done) -> mock.browser.fill '#email', 'test@test.com', done
      (done) -> mock.browser.fill '#password', 'test', done
      (done) -> mock.browser.pressButton '#register', done
      (done) -> mock.browser.until 'window.location.pathname !== "/register"', done
      (done) -> mock.browser.text 'test', (text) -> 
        assert.equal(text, "succeded")        
        do done
    ], done