# Configuration Development
This file contains the configuration used during development. This is needed 
to store sensitive information, from application keys to session secrets. For 
deployment this file is edited to contain sensitive information. Therefor the 
content of this file should never be accessible directlly by the user.

    module.exports =
  
The session secret is a salt used when computing a hash in the express session.

      session:
        secret: "Development Session Hash"