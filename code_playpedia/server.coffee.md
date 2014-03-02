# Express Server
    
    express   = require 'express'
    path      = require 'path'
    app       = express()
    mongo     = require 'mongodb'
    server    = new mongo.Server("127.0.0.1", 27017)
    db        = new mongo.Db('pp', server, { safe : false });

    relativeStatic = (path...) -> 
      express.static path.join(__dirname, path...)

    app.use express.logger 'dev'
      
    app.use('/static', relativeStatic('code_plugins'));
    app.use('/static', relativeStatic('used_temporary','code_plugins'));
      
    app.use do express.cookieParser
    app.use do express.json
    app.use do express.urlencoded
    
    #app.use express.session { secret: 'i am not telling you' }

    db.open (err) ->
      if err then throw err

      app.get '/hello.txt', (req, res) ->
        res.send 'Hello World'

      common = {app: app, db: db, express: express}
      common.user = require('./user.js')(app, db, common)

      app.listen 3333, 'localhost', ->
        console.log 'Express started at 3333.'





    


