(function() {
  var cbs, common, init, onload, random;

  cbs = [];

  onload = function(cb) {
    var _i, _len;
    if (cb) {
      cbs.push(cb);
    }
    if (common.app) {
      for (_i = 0, _len = cbs.length; _i < _len; _i++) {
        cb = cbs[_i];
        cb();
      }
      return cbs = [];
    }
  };

  common = {};

  init = function(db, app, express) {
    common.db = db;
    common.app = app;
    common.express = express;
    common.user = require('./user.js')(app, db, common);
    common.permission = require('./permission.js')(app, db, common);
    return onload();
  };

  random = Math.random();

  console.log("!!!!!!!!!!!" + process.pid);

  module.exports = {
    pid: process.pid,
    common: common,
    init: init,
    onload: onload,
    random: random
  };

}).call(this);
