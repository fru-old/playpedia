async   = require 'async'
assert  = require('chai').assert
mock    = require '../mocks/utilities.js'

describe 'Browser', ->
  it 'Hello World', (done) ->
    mock.browser.visit '/hello', ->
      mock.browser.text 'test', (test) -> 
        assert.equal(test, "Hello World")
        done()