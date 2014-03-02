# Express Server
    
    express   = require 'express'
    path      = require 'path'
    app       = express()
    mongo     = require 'mongodb'
    SETTINGS  = require('./config.js')
    server    = new mongo.Server(SETTINGS.db.domain, SETTINGS.db.port)
    db        = new mongo.Db('pp', server, { safe : false });
    
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
      app.get '/hello.txt', (req, res) ->
        res.send 'Hello World'

      common = {app: app, db: db, express: express}
      common.user = require('./user.js')(app, db, common)

      port   = SETTINGS.server.port
      domain = SETTINGS.server.domain

      app.listen port, domain, ->
        console.log "Express started at #{port}."





    


