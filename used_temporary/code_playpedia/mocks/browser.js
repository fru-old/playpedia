(function() {
  var Browser, browser;

  Browser = require('zombie-phantom');

  browser = new Browser({
    site: 'http://localhost:3333',
    phantomPath: require('phantomjs').path
  });

  module.exports.browser = function() {
    return browser;
  };

}).call(this);
