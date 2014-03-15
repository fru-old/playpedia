# Init Common
    
    cbs    = []
    onload = (cb) ->
      cbs.push cb if cb
      if common.app
        do cb for cb in cbs
        cbs = []

    common = {}
    init   = (db, app, express) ->
      common.db         = db
      common.app        = app
      common.express    = express
      common.user       = require('./user.js')(app, db, common)
      common.permission = require('./permission.js')(app, db, common)
      do onload
    random = Math.random()
    
    console.log "!!!!!!!!!!!"+process.pid
    module.exports = 
      pid: process.pid
      common: common
      init:   init
      onload: onload 
      random: random

