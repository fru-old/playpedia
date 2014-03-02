(function() {
  var passport,
    __slice = [].slice;

  passport = require('passport');

  module.exports = function(app, db, common) {
    var composeUser, register;
    passport.serializeUser = function(user, done) {
      return done(null, user.id);
    };
    passport.deserializeUser = function(id, done) {
      return done(null, {
        id: id
      });
    };
    composeUser = function(name, done, args) {
      var password, profile, user;
      switch (name) {
        case "facebook":
          profile = args[2];
          return done(null, {
            id: profile.emails[0].value
          });
        case "google":
          profile = args[1];
          return done(null, {
            id: profile.emails[0].value
          });
        case "local":
          user = args[0];
          password = args[1];
          return done(null, {
            id: user
          });
      }
    };
    register = function(name, settings) {
      var Strategy, compose, redirect;
      redirect = passport.authenticate(name, {
        successRedirect: '/',
        failureRedirect: '/login?failure'
      });
      Strategy = require('passport-' + name).Strategy;
      compose = function() {
        var args, done;
        done = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return composeUser(name, done, args);
      };
      passport.use(new Strategy(settings, compose));
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
