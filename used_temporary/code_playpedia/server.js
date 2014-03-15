(function() {
  var Mocha, add, app, async, cbs, common, db, domain, express, fs, mocha, mongo, path, port, run, server, settings, walk;

  settings = {
    session: {
      secret: 'Development Session Hash'
    },
    server: {
      port: 3333,
      domain: 'localhost',
      fullurl: 'http://localhost:3333'
    },
    db: {
      port: 27017,
      domain: '127.0.0.1'
    },
    facebook: {
      clientID: '1445183219042769',
      clientSecret: '6b1e95d61b95e7ec67081df7e396fef6'
    },
    testing: {
      run: true
    }
  };

  express = require('express');

  path = require('path');

  app = express();

  mongo = require('mongodb');

  server = new mongo.Server(settings.db.domain, settings.db.port);

  db = new mongo.Db('pp', server, {
    safe: false
  });

  common = require('./common.js');

  Mocha = require('mocha');

  fs = require('fs');

  async = require('async');

  app.use(express.logger('dev'));

  app.use(express["static"](path.resolve('code_plugins')));

  app.use(express["static"](path.resolve('used_temporary', 'code_plugins')));

  app.use(express.cookieParser());

  app.use(express.json());

  app.use(express.urlencoded());

  app.get('/hello', function(req, res) {
    return res.send('<html><body><test>Hello World</test></body></html>');
  });

  port = settings.server.port;

  domain = settings.server.domain;

  app.listen(port, domain, function() {
    return db.open(function(err) {
      if (err) {
        throw err;
      }
      module.exports.init();
      return console.log("Application server started at " + port + ".");
    });
  });

  cbs = [];

  module.exports = {
    onload: function(cb) {
      var _i, _len;
      if (cb) {
        cbs.push(cb);
      }
      if (module.exports.app) {
        for (_i = 0, _len = cbs.length; _i < _len; _i++) {
          cb = cbs[_i];
          cb(module.exports);
        }
        return cbs = [];
      }
    },
    init: function() {
      this.app = app;
      this.db = db;
      this.express = express;
      this.user = require('./user.js')(app, db, this);
      this.permission = require('./permission.js')(app, db, this);
      return this.onload();
    },
    settings: settings
  };

  walk = function(dir, onfile, done) {
    var single;
    single = function(file, after) {
      file = path.join(".", dir, file);
      return fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          return walk(file, onfile, after);
        } else {
          onfile(file);
          return after();
        }
      });
    };
    return fs.readdir(dir, function(err, list) {
      if (err) {
        return done(err);
      }
      return async.each(list, single, done);
    });
  };

  if (settings.testing.run) {
    mocha = new Mocha().timeout(30000).reporter('min');
    add = function(file) {
      return mocha.addFile(file);
    };
    run = function() {
      return mocha.run();
    };
    walk("./used_temporary/code_playpedia/testing", add, run);
  }

}).call(this);
