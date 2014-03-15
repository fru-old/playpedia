for (var member in require.cache) { if(member.indexOf('used_temporary')>=0) delete require.cache[member]; }
(function() {
  var Mocha, SETTINGS, app, async, common, db, expose, express, fs, mocha, mongo, onfile, path, server, walk,
    __slice = [].slice;

  express = require('express');

  path = require('path');

  app = express();

  mongo = require('mongodb');

  SETTINGS = require('./config.js');

  server = new mongo.Server(SETTINGS.db.domain, SETTINGS.db.port);

  db = new mongo.Db('pp', server, {
    safe: false
  });

  common = require('./common.js');

  Mocha = require('mocha');

  fs = require('fs');

  async = require('async');

  path = require('path');

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
      console.log(list.length);
      return async.each(list, single, done);
    });
  };

  mocha = new Mocha().timeout(30000).reporter('min');

  onfile = function(file) {
    return mocha.addFile(file);
  };

  walk("./used_temporary/code_playpedia/testing", onfile, function() {
    return mocha.run();
  });

  expose = function() {
    var path;
    path = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return express["static"](path.join.apply(path, [__dirname].concat(__slice.call(path))));
  };

  app.use(express.logger('dev'));

  app.use(expose('code_plugins'));

  app.use(expose('used_temporary', 'code_plugins'));

  app.use(express.cookieParser());

  app.use(express.json());

  app.use(express.urlencoded());

  db.open(function(err) {
    var domain, port;
    if (err) {
      throw err;
    }
    app.get('/hello', function(req, res) {
      return res.send('<html><body><test>Hello World</test></body></html>');
    });
    port = SETTINGS.server.port;
    domain = SETTINGS.server.domain;
    return app.listen(port, domain, function() {
      common.init(db, app, express);
      return console.log(("Express started at " + port + ". ") + process.pid);
    });
  });

}).call(this);
