(function() {
  var __slice = [].slice;

  module.exports = function(app, db, common) {
    var SETTINGS, SessionDB, checkUser, passport, register;
    SessionDB = require('connect-mongo')(common.express);
    SETTINGS = require('./config.js');
    app.use(common.express.session({
      secret: SETTINGS.session.secret,
      store: new SessionDB({
        db: db
      })
    }));
    passport = require('passport');
    passport.serializeUser = function(user, done) {
      return done(null, JSON.stringify(user));
    };
    passport.deserializeUser = function(user, done) {
      return done(null, JSON.parse(user));
    };
    passport.validateUser = function(user, done) {
      return done(null, user);
    };
    checkUser = function(name, done, args) {
      var password, profile, user, _ref, _ref1, _ref2, _ref3;
      profile = {
        type: name
      };
      switch (name) {
        case "facebook":
          profile.email = (_ref = args[2]) != null ? (_ref1 = _ref.emails[0]) != null ? _ref1.value : void 0 : void 0;
          return done(null, profile);
        case "google":
          profile.email = (_ref2 = args[1]) != null ? (_ref3 = _ref2.emails[0]) != null ? _ref3.value : void 0 : void 0;
          return done(null, profile);
        case "local":
          user = args[0];
          password = args[1];
          return done(null, {
            id: user
          });
      }
    };
    register = function(name, settings) {
      var Strategy, check, redirect;
      redirect = passport.authenticate(name, {
        successRedirect: '/',
        failureRedirect: '/login?failure'
      });
      Strategy = require('passport-' + name).Strategy;
      check = function() {
        var args, done;
        done = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return checkUser(name, done, args);
      };
      passport.use(new Strategy(settings, check));
      return redirect;
    };
    return module.exports = {
      facebook: register('facebook', {
        clientID: "1445183219042769",
        clientSecret: "6b1e95d61b95e7ec67081df7e396fef6",
        callbackURL: "http://localhost:3333/login/facebook/callback",
        scope: ['email']
      }),
      google: register('google', {
        returnURL: 'http://localhost:3333/login/google/callback',
        realm: 'http://localhost:3333/'
      }),
      local: register('local', {
        usernameField: 'email',
        passwordField: 'password'
      }),
      authenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
          return next();
        }
        return res.redirect('/login');
      }
    };
  };

}).call(this);
