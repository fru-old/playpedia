async   = require 'async'
assert  = require('chai').assert
browser = do require('../mocks/browser.js').browser

describe 'Browser', ->
  it 'Hello World', (done) ->
    browser.visit '/hello', ->
      browser.text 'test', (test) -> 
        assert.equal(test, "Hello World")
        done()