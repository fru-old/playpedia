# Express Server


## Settings
This section contains the configuration used during development. When deploying
this is replaced by a configuration file.

    settings = {
      # Session deployment options
      session: 
        secret: 'Development Session Hash'
      # Server deployment options
      server:    
        port: 3333
        domain: 'localhost'
        fullurl: 'http://localhost:3333'
      # Database deployment options
      db:
        port: 27017
        domain: '127.0.0.1'
      # Facebook authentication credentials
      facebook:  
        clientID: '1445183219042769'
        clientSecret: '6b1e95d61b95e7ec67081df7e396fef6'
      # Configure testing environment
      testing:
        run: true
    }


## Requirements
    
    express = require 'express'
    path    = require 'path'
    app     = express()
    mongo   = require 'mongodb'
    server  = new mongo.Server(settings.db.domain, settings.db.port)
    db      = new mongo.Db('pp', server, { safe : false });
    common  = require './common.js'
    Mocha   = require 'mocha'
    fs      = require 'fs'
    async   = require 'async'


## Setup express server

    app.use express.logger 'dev'
    app.use '/static', express.static path.resolve('code_plugins')
    app.use '/static', express.static path.resolve('used_temporary','code_plugins') 
    app.use do express.cookieParser
    app.use do express.json
    app.use do express.urlencoded

    # TODO: Remove example service
    app.get '/hello', (req, res) ->
      res.send '<html><body><test>Hello World</test></body></html>'

    port   = settings.server.port
    domain = settings.server.domain
    app.listen port, domain, ->
      db.open (err) ->
        if err then throw err
        do module.exports.init
        mode = process.env.NODE_ENV
        console.log "Application server started at #{port}."


## Build shared object 

    cbs = []
    module.exports =
      onload: (cb) -> 
        cbs.push cb if cb
        if module.exports.app
          cb module.exports for cb in cbs
          cbs = []
      init: () ->
        @app        = app
        @db         = db
        @express    = express
        @user       = require('./user.js')(app, db, this)
        @permission = require('./permission.js')(app, db, this)
        do @onload
      settings: settings


## Invoke mocha unit testing

    walk = (dir, onfile, done) ->
      single = (file, after) ->
        file = path.join(".",dir, file)
        fs.stat file, (err, stat) ->
          if stat && do stat.isDirectory
            walk file, onfile, after
          else 
            onfile file
            do after

      fs.readdir dir, (err, list)->
        if err then return done err
        async.each(list, single, done)

    mode = process.env.NODE_ENV
    if settings.testing.run && (!mode || mode == 'development') 
      mocha = new Mocha().timeout(30000).reporter('min')
      add = (file) -> mocha.addFile file
      run = () -> do mocha.run
      walk "./used_temporary/code_playpedia/testing", add, run