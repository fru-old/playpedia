# Permissions 

    module.exports = (app, db, common) ->

      Guid = require('mongodb').ObjectID
      perm = db.collection 'playpedia_permissions'


      getPermission = (contentGuid, pluginGuid, anonymous) ->
        return {
          readable: 1
          writable: 1
        }

This can be used annonymously to create novel content with high read and write access

      createContent = (contentPath, pluginGuid, anonymous) ->
        contentPath = new String contentPath
        pluginGuid  = new Guid pluginGuid
        userGuid    = common.user.get anonymous 
        newContent  =
          contentPath: contentPath
          pluginGuid:  pluginGuid
          userGuid:    userGuid
          writable:    1000000
          readable:    1000000
        #perm.find









The user has to be loged in to set permissions for other players

      setPermission = (contentGuid, pluginGuid, forUserGuid, readLevel, writeLevel) ->
        contentGuid = new Guid contentGuid
        pluginGuid  = new Guid pluginGuid 
        forUserGuid = new Guid forUserGuid
        readLevel   = new Number readLevel
        writeLevel  = new Number writeLevel
        currentUser = do common.user.get



      return { 
        createContent: createContent
        setPermission: setPermission
      }










