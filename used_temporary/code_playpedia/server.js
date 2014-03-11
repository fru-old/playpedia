(function() {
  var SETTINGS, app, db, expose, express, mongo, path, server,
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
    var common, domain, port;
    if (err) {
      throw err;
    }
    app.get('/hello', function(req, res) {
      return res.send('<html><body><test>Hello World</test></body></html>');
    });
    common = {
      app: app,
      db: db,
      express: express
    };
    common.user = require('./user.js')(app, db, common);
    common.permission = require('./permission.js')(app, db, common);
    port = SETTINGS.server.port;
    domain = SETTINGS.server.domain;
    return app.listen(port, domain, function() {
      return console.log("Express started at " + port + ".");
    });
  });

}).call(this);
