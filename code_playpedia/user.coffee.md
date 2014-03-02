# User Authentication

The user authentication module provides authentication both locally and via 
social login. Passport.js is used to allow the login via email, Facebook or 
Google account. 

    module.exports = (app, db, common) ->

Once a user will login a session will be opened and stored in the mongodb so 
that even after a server reboot no session will be lost. For this purpose a 
session middleware needs to be inserted into express. 
      
      SessionDB = require('connect-mongo')(common.express)
      SETTINGS  = require('./config.js') 

      app.use common.express.session
        secret: SETTINGS.session.secret
        store:  new SessionDB({db: db})


      passport  = require('passport')


      # Extract id from user
      passport.serializeUser = (user, done) ->
        done(null, JSON.stringify(user))

      # Find user in database
      passport.deserializeUser = (user, done) ->
        done(null, JSON.parse(user))

      passport.validateUser = (user, done) ->
        done(null, user)






      # Private Methods
      checkUser = (name, done, args) ->
        profile = { type: name }
        switch name
          when "facebook"
            profile.email = args[2]?.emails[0]?.value
            done(null, profile)
          when "google"
            profile.email = args[1]?.emails[0]?.value
            done(null, profile)
          when "local"
            user = args[0]
            password = args[1]
            done(null, { id: user })
        

      # Register authentication provider
      register = (name, settings) ->
        redirect = passport.authenticate name,
          successRedirect: '/'
          failureRedirect: '/login?failure'
        
        Strategy = require('passport-'+name).Strategy
        check = (done, args...) ->
          checkUser(name, done, args )
        passport.use new Strategy(settings, check)

        return redirect


      #Public
      module.exports =
        facebook: register 'facebook',
          clientID: "1445183219042769"
          clientSecret: "6b1e95d61b95e7ec67081df7e396fef6"
          callbackURL: "http://localhost:3333/login/facebook/callback"
          scope: ['email']
        google: register 'google',
          returnURL: 'http://localhost:3333/login/google/callback'
          realm: 'http://localhost:3333/'
        local: register 'local',
          usernameField: 'email'
          passwordField: 'password'
        authenticated: (req, res, next) -> 
          if do req.isAuthenticated then return do next
          res.redirect '/login'
    

