# User Authentication

The user authentication module provides authentication both locally and via 
social login. Passport.js is used to allow the login via email, Facebook or 
Google account. 

    passport = require('passport')
    module.exports = (app, db, common) ->

      # Extract id from user
      passport.serializeUser = (user, done) ->
        done(null, user.id)


      # Find user in database
      passport.deserializeUser = (id, done) ->
        done(null, { id: id })


      # Private Methods
      composeUser = (name, done, args) ->
        switch name
          when "facebook"
            profile = args[2]
            done(null, { id: profile.emails[0].value })
          when "google"
            profile = args[1]
            done(null, { id: profile.emails[0].value })
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
        compose = (done, args...) ->
          composeUser(name, done, args )
        passport.use new Strategy(settings, compose)

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
    
