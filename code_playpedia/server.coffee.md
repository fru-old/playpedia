# Express Server
    
    express   = require 'express'
    path      = require 'path'
    app       = express()
    mongo     = require 'mongodb'
    SETTINGS  = require './config.js'
    server    = new mongo.Server(SETTINGS.db.domain, SETTINGS.db.port)
    db        = new mongo.Db('pp', server, { safe : false });
    common    = require './common.js'



    Mocha     = require 'mocha'
    fs        = require 'fs'
    async     = require 'async'
    path      = require 'path'
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
        console.log list.length
        async.each(list, single, done)

    mocha = new Mocha().timeout(30000).reporter('min')
    onfile = (file) -> mocha.addFile file
    walk "./used_temporary/code_playpedia/testing", onfile, ->
      do mocha.run
    

    expose = (path...) -> 
      express.static path.join(__dirname, path...)

    app.use express.logger 'dev'
    app.use expose('code_plugins')
    app.use expose('used_temporary','code_plugins') 
    app.use do express.cookieParser
    app.use do express.json
    app.use do express.urlencoded

    db.open (err) ->
      if err then throw err

      # TODO remove
      app.get '/hello', (req, res) ->
        res.send '<html><body><test>Hello World</test></body></html>'

      port   = SETTINGS.server.port
      domain = SETTINGS.server.domain

      app.listen port, domain, ->
        common.init db, app, express
        console.log "Express started at #{port}. "+process.pid




    


