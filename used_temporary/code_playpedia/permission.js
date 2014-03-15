(function() {
  module.exports = function(app, db, common) {
    var Guid, createContent, getPermission, perm, setPermission;
    Guid = require('mongodb').ObjectID;
    perm = db.collection('playpedia_permissions');
    getPermission = function(contentGuid, pluginGuid, anonymous) {
      return {
        readable: 1,
        writable: 1
      };
    };
    createContent = function(contentPath, pluginGuid, anonymous) {
      var newContent, userGuid;
      contentPath = new String(contentPath);
      pluginGuid = new Guid(pluginGuid);
      userGuid = common.user.get(anonymous);
      return newContent = {
        contentPath: contentPath,
        pluginGuid: pluginGuid,
        userGuid: userGuid,
        writable: 1000000,
        readable: 1000000
      };
    };
    setPermission = function(contentGuid, pluginGuid, forUserGuid, readLevel, writeLevel) {
      var currentUser;
      contentGuid = new Guid(contentGuid);
      pluginGuid = new Guid(pluginGuid);
      forUserGuid = new Guid(forUserGuid);
      readLevel = new Number(readLevel);
      writeLevel = new Number(writeLevel);
      return currentUser = common.user.get();
    };
    return {
      createContent: createContent,
      setPermission: setPermission
    };
  };

}).call(this);
