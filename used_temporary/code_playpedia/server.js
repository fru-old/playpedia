(function() {
  var app, db, express, mongo, path, relativeStatic, server,
    __slice = [].slice;

  express = require('express');

  path = require('path');

  app = express();

  mongo = require('mongodb');

  server = new mongo.Server("127.0.0.1", 27017);

  db = new mongo.Db('pp', server, {
    safe: false
  });

  relativeStatic = function() {
    var path;
    path = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return express["static"](path.join.apply(path, [__dirname].concat(__slice.call(path))));
  };

  app.use(express.logger('dev'));

  app.use('/static', relativeStatic('code_plugins'));

  app.use('/static', relativeStatic('used_temporary', 'code_plugins'));

  app.use(express.cookieParser());

  app.use(express.json());

  app.use(express.urlencoded());

  db.open(function(err) {
    var common;
    if (err) {
      throw err;
    }
    app.get('/hello.txt', function(req, res) {
      return res.send('Hello World');
    });
    common = {
      app: app,
      db: db,
      express: express
    };
    common.user = require('./user.js')(app, db, common);
    return app.listen(3333, 'localhost', function() {
      return console.log('Express started at 3333.');
    });
  });

}).call(this);
