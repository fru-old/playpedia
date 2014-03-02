(function() {
  module.exports = {
    session: {
      secret: "Development Session Hash"
    },
    server: {
      port: 3333,
      domain: 'localhost',
      fullurl: 'http://localhost:3333'
    },
    facebook: {
      clientID: "1445183219042769",
      clientSecret: "6b1e95d61b95e7ec67081df7e396fef6"
    },
    db: {
      port: 27017,
      domain: "127.0.0.1"
    }
  };

}).call(this);
