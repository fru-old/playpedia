(function() {
  module.exports = function(app, db, common) {
    var SessionDB, passport, registerProvider, server, signin, signup, userdb;
    SessionDB = require('connect-mongo')(common.express);
    server = require('./server.js');
    app.use(common.express.session({
      secret: server.settings.session.secret,
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
        if (user && p !== user.password) {
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
    registerProvider = function(name, options) {
      var Strategy, redirct, redirect;
      redirct = {
        failureRedirect: '/login?failed'
      };
      redirect = passport.authenticate(name, redirect, function(req, res) {
        return res.redirect(server.settings.url.onlogin);
      });
      Strategy = require('passport-' + name).Strategy;
      passport.use(new Strategy(options, options.login));
      return redirect;
    };
    signin = {
      facebook: registerProvider('facebook', {
        clientID: server.settings.facebook.clientID,
        clientSecret: server.settings.facebook.clientSecret,
        callbackURL: server.settings.server.fullurl + "/login/facebook/callback",
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
        returnURL: server.settings.server.fullurl + '/login/google/callback',
        realm: server.settings.server.fullurl + '/',
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
          return res.redirect(server.settings.url.onlogin);
        });
      });
    });
    app.post('/login', signin.local);
    app.get('/logout', function(req, res) {
      req.logout();
      return res.redirect(server.settings.url.onlogout);
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
