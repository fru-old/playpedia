(function() {
  var Browser, browser, extend, originalSettings, server;

  Browser = require('zombie-phantom');

  extend = require('xtend');

  server = require('../server.js');

  browser = new Browser({
    site: 'http://localhost:3333',
    phantomPath: require('phantomjs').path
  });

  module.exports.browser = browser;

  originalSettings = null;

  module.exports.setting = function(mockSettings) {
    if (!originalSettings) {
      originalSettings = extend(server.settings);
    }
    return server.settings = extend(server.settings, mockSettings);
  };

  module.exports.restore = function() {
    if (originalSettings) {
      server.settings = originalSettings;
      return originalSettings = null;
    }
  };

}).call(this);
