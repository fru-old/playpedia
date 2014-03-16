
Browser = require 'zombie-phantom'
extend  = require 'xtend'
server  = require '../server.js'

# Browser mocking
browser = new Browser
  site: 'http://localhost:3333'
  phantomPath: require('phantomjs').path
module.exports.browser = browser

# Setings mocking
originalSettings = null
module.exports.setting = (mockSettings) ->
  if !originalSettings
    originalSettings = extend server.settings
  server.settings = extend server.settings, mockSettings
module.exports.restore = () ->
  if originalSettings
    server.settings = originalSettings
    originalSettings = null

# TODO: when needed - request mocking