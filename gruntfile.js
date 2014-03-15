var path = require('path')

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
          src: ['code_playpedia/**/*.coffee.md', 'code_playpedia/**/*.coffee'],
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
        debug: true,
        spawn: false
      }
    },
    watch: {
      playpedia: {
        files: ['code_playpedia/**'],
        tasks: ['build', 'express'], //
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