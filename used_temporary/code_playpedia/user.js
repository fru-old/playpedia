(function() {
  module.exports = function(app, db, common) {
    var SETTINGS, SessionDB, passport, registerProvider, signin, signup, userdb;
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
    signin = {
      facebook: registerProvider('facebook', {
        clientID: SETTINGS.facebook.clientID,
        clientSecret: SETTINGS.facebook.clientSecret,
        callbackURL: SETTINGS.server.fullurl + "/login/facebook/callback",
        scope: ['email'],
        login: function(accessToken, refreshToken, profile, done) {
          var _ref;
          profile.email = (_ref = profile.emails[0]) != null ? _ref.value : void 0;
          profile.accessToken = accessToken;
          profile.refreshToken = refreshToken;
          profile.method = 'facebook';
          return userdb.findOrCreateUser(profile, done);
        }
      }),
      google: registerProvider('google', {
        returnURL: SETTINGS.server.fullurl + '/login/google/callback',
        realm: SETTINGS.server.fullurl + '/',
        login: function(identifier, profile, done) {
          var _ref;
          profile.email = (_ref = profile.emails[0]) != null ? _ref.value : void 0;
          profile.identifier = identifier;
          profile.method = 'google';
          return userdb.findOrCreateUser(profile, done);
        }
      }),
      local: registerProvider('local', {
        usernameField: 'email',
        passwordField: 'password',
        login: function(email, password, done) {
          var profile;
          profile = {
            email: email,
            method: 'local',
            password: password
          };
          return userdb.findUser(profile, done);
        }
      })
    };
    signup = function(req, done) {
      var profile;
      profile = {
        email: req.body.email,
        method: 'local',
        password: req.body.password
      };
      return userdb.findOrCreateUser(profile, done);
    };
    app.get('/login/facebook', signin.facebook);
    app.get('/login/facebook/callback', signin.facebook);
    app.get('/login/google', signin.google);
    app.get('/login/google/callback', signin.google);
    app.post('/register', function(req, res) {
      return signup(req, function(err, user) {
        return passport.authenticate('local')(req, res, function() {
          return res.redirect('/');
        });
      });
    });
    app.post('/login', signin.local);
    app.get('/logout', function(req, res) {
      req.logout();
      return res.redirect('/');
    });
    return {
      authenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
          return next();
        }
        return res.redirect('/login');
      },
      get: function(anonymous) {
        var error, _ref;
        error = "This action can't be done anonymously - please login.";
        if (anonymous) {
          return null;
        }
        return ((_ref = req.user) != null ? _ref._id : void 0) || (function() {
          throw error;
        })();
      }
    };
  };

}).call(this);
