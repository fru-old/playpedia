# User Authentication

The user authentication module provides authentication both locally and via 
social login. Passport.js is used to allow the login via email, Facebook or 
Google account. 

    module.exports = (app, db, common) ->

Once a user will login a session will be opened and stored in the mongodb so 
that even after a server reboot no session will be lost. For this purpose a 
session middleware needs to be inserted into express. 
      
      SessionDB = require('connect-mongo') common.express
      SETTINGS  = require('./config.js')

      app.use common.express.session
        secret: SETTINGS.session.secret
        store:  new SessionDB({db: db})

Passport.js is initialized to store the full user object in the mongodb session
so that no further database calls are need per service request.

      passport  = require 'passport' 

      # Extract id from user object
      passport.serializeUser = (user, done) ->
        done(null, JSON.stringify user)

      # Retrieve user from id
      passport.deserializeUser = (user, done) ->
        done(null, JSON.parse user)

To login or register a user, the database has to be queried. For this every 
user consists of an email as well as the login method. These two properties 
constitute the id of an user. For security reasons the passwort has to be 
checkt at this point as well.

      userdb = db.collection "userdata"
      userdb.findUser = (profile, done) ->
        credentials = 
          email: profile.email
          method: profile.method 
        userdb.findOne credentials, (err, user) ->
          if err then return done err
          p = profile.password
          if p != undefined and p != user.password
            return done "WrongPassword" 
          return done null, user

Depending on login method (e.g: facebook) when no user is found on has to be 
created. This can also be called to register a user.

      userdb.findOrCreateUser = (profile, done) ->
        userdb.findUser profile, (err, user) ->
          if err then return done err
          if user then return done null, user
          userdb.insert profile, (err, newuser) ->
            if err then return done err
            return done null, newuser

With passport.js every authentication provider needs to be registerd. For this 
purpose a helper function has been created. This contains the redirect urls used
after a successfull or failed authentication request.

      registerProvider = (name, settings) ->
        redirect = passport.authenticate name,
          successRedirect: '/'
          failureRedirect: '/login?failed'
        Strategy = require('passport-'+name).Strategy
        passport.use new Strategy(settings, settings.login)
        return redirect

Used authentication strategies are lised here including provider specific 
settings and a function that is executed on login.

      signin = 

Facebook (OAuth 2.0) for this method an app needs to be created at Facebook 
Developers. A different app will be used in production.

        facebook: registerProvider 'facebook',
          clientID: SETTINGS.facebook.clientID
          clientSecret: SETTINGS.facebook.clientSecret
          callbackURL: SETTINGS.server.fullurl + "/login/facebook/callback"
          scope: ['email']
          login: (accessToken, refreshToken, profile, done) ->
            profile.email = profile.emails[0]?.value
            profile.accessToken = accessToken
            profile.refreshToken = refreshToken
            profile.method = 'facebook'
            userdb.findOrCreateUser profile, done
              

Google (OpenID) authentication strategy. Playpedia does not need to be 
registered at google for this.

        google: registerProvider 'google',
          returnURL: SETTINGS.server.fullurl + '/login/google/callback'
          realm: SETTINGS.server.fullurl + '/'
          login: (identifier, profile, done) ->
            profile.email = profile.emails[0]?.value
            profile.identifier = identifier
            profile.method = 'google'
            userdb.findOrCreateUser profile, done

Conventional local strategie that does not rely on OAuth. User login and
registration using email and password.

        local: registerProvider 'local',
          usernameField: 'email'
          passwordField: 'password'
          login: (email, password, done) ->
            profile = 
              email: email
              method: 'local'
              password: password
            userdb.findUser profile, done
          register: (email, password, done) -> 
            profile = 
              email: email
              method: 'local'
              password: password
            userdb.findOrCreateUser profile, done

Express routes for the authentication.
  
      app.get  '/login/facebook', signin.facebook
      app.get  '/login/facebook/callback', signin.facebook
      app.get  '/login/google', signin.google
      app.get  '/login/google/callback', signin.google
      app.post '/register', (req, res) ->
        email = req.body.email
        password = req.body.password
        signin.local.register email, password, (err, user) ->
          passport.authenticate('local') req, res, ->
            res.redirect '/' 
      app.post '/login', signin.local
      app.get  '/logout', (req, res) ->
        do req.logout
        res.redirect '/'

Returns a public method to make an express page visible to authenticated
users only.

      return {
         authenticated: (req, res, next) -> 
          if do req.isAuthenticated then return do next
          res.redirect '/login'
      }
    

