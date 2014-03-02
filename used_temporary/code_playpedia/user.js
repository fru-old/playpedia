(function() {
  module.exports = function(app, db, common) {
    var SETTINGS, SessionDB, passport, registerProvider, result, strategies, userdb;
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
    userdb = db.collection("userdata");
    userdb.findUser = function(profile, done) {
      var credentials;
      credentials = {
        email: profile.email,
        method: profile.method
      };
      return userdb.findOne(credentials, function(err, user) {
        var p;
        if (err) {
          return done(err);
        }
        p = profile.password;
        if (p !== void 0 && p !== user.password) {
          return done("WrongPassword");
        }
        return done(null, user);
      });
    };
    userdb.findOrCreateUser = function(profile, done) {
      return userdb.findUser(profile, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        }
        return userdb.insert(profile, function(err, newuser) {
          if (err) {
            return done(err);
          }
          return done(null, newuser);
        });
      });
    };
    registerProvider = function(name, settings) {
      var Strategy, redirect;
      redirect = passport.authenticate(name, {
        successRedirect: '/',
        failureRedirect: '/login?failed'
      });
      Strategy = require('passport-' + name).Strategy;
      passport.use(new Strategy(settings, settings.login));
      return redirect;
    };
    strategies = {
      facebook: registerProvider('facebook', {
        clientID: SETTINGS.facebook.clientID,
        clientSecret: SETTINGS.facebook.clientSecret,
        callbackURL: SETTINGS.server.fullurl + "/login/facebook/callback",
        scope: ['email'],
        login: function(accessToken, refreshToken, profile, done) {
          var _ref;
          return done(null, {
            email: (_ref = profile.emails[0]) != null ? _ref.value : void 0,
            method: "facebook"
          });
        }
      }),
      google: registerProvider('google', {
        returnURL: SETTINGS.server.fullurl + '/login/google/callback',
        realm: SETTINGS.server.fullurl + '/',
        login: function(identifier, profile, done) {
          var _ref;
          return done(null, {
            email: (_ref = profile.emails[0]) != null ? _ref.value : void 0,
            method: "google"
          });
        }
      }),
      local: registerProvider('local', {
        usernameField: 'email',
        passwordField: 'password',
        login: function(email, password, done) {
          return done(null, {
            email: email,
            method: "local",
            password: password
          });
        }
      })
    };
    result = {
      authenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
          return next();
        }
        return res.redirect('/login');
      }
    };
    return result;
  };

}).call(this);
