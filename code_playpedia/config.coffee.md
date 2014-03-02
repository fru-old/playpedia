# Configuration Development
This file contains the configuration used during development. This is needed 
to store sensitive information, from application keys to session secrets. For 
deployment this file is edited to contain sensitive information. Therefor the 
content of this file should never be accessible directlly by the user.

    module.exports =
  
The session secret is a salt used when computing a hash in the express session.

      session:
        secret: "Development Session Hash"

Server deployment information, like the port express runs at.

      server:
        port: 3333
        domain: 'localhost'
        fullurl: 'http://localhost:3333'

Facebook authentication provider credentials.
  
      facebook:
        clientID: "1445183219042769"
        clientSecret: "6b1e95d61b95e7ec67081df7e396fef6" 

Database deployment information.
      
      db:
        port: 27017
        domain: "127.0.0.1"