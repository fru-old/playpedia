var path = require('path')

// Path to be excluded
var nonode  = '!**/node_modules/**';
var nomongo = '!**/used_mongodb/**';
var notemp  = '!**/used_temporary/**';

// Banner for node mocha tests
var banner  = "for (var member in require.cache) delete require.cache[member];\n";

// Start mongo command
var mongo   = path.join(__dirname, "used_mongodb", "mongod")
mongo += " --dbpath " + path.join(__dirname, "used_mongodb", "data")

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    shell: {
        mongo: {
            command: mongo
        },
        options: {
          stdout: true,
          stderr: true,
          async: true
        }
    },
    coffee: {
      all: {
        files: [{
          expand: true,
          src: ['code_playpedia/**/*.coffee.md'],
          dest: 'used_temporary',
          ext: '.js'
        }]
      }
    },
    express: {
      server: {
        options: {
          script: 'used_temporary/code_playpedia/server.js'
        }
      },
      options: {
        debug: true
      }
    },
    watch: {
      playpedia: {
        files: ['code_playpedia/**'],
        tasks: ['build', 'simplemocha', 'express'],
        options: {
          spawn: false
        }
      },
      plugins: {
        files: ['code_plugins/**'],
        tasks: [],
        options: {
          livereload: 35729
        }
      }
    },
    simplemocha: {
      options:{
        //globals: ['should'],
        //timeout: 3000,
        //ignoreLeaks: false,
        //grep: '*-test',
        //ui: 'bdd',
        reporter: 'min'
      },
      server: { 
        src: ['used_developing/node/**/*-test.js'] 
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 8080,
          'web-host': 'localhost',
          'debug-port': 5858
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-shell-spawn');

  grunt.registerTask('build', ['coffee']);
  grunt.registerTask('debug', ['node-inspector']);
  grunt.registerTask('default', ['shell:mongo','build', 'express', 'watch']);//, 'uglify'

};