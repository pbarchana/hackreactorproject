module.exports = function(grunt) {
  // Helpers
  var random = function(max) {
    return Math.ceil(Math.random() * max);
  };

  grunt.initConfig({
    shell: {
      // start mongo db
      mongo: {
        command: 'mongod',
        options: {
          async: true
        }
      },

      // Generate mock data
      deleteMockData: {
        command: 'node deleteMockData.js',
        options: {
          execOptions: {
            cwd: 'workers' // selected directory
          }
        }
      },

      generateNodes: {
        command: 'python mockNodes.py ' + random(20),
        options: {
          execOptions: {
            cwd: 'workers' // selected directory
          }
        }
      },
      generateSwitches: {
        command: 'node mockSwitches.js ' + random(5),
        options: {
          execOptions: {
            cwd: 'workers'
          }
        }
      },
      generateConnectivity: {
        command: 'node mockConnectivity.js',
        options: {
          execOptions: {
            cwd: 'workers'
          }
        }
      }
    },

    // start server
    nodemon: {
      dev: {
        options: {
          file: 'server.js',
          nodeArgs: ['--debug']
        }
      }
    }
  });

  // get dependencies
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-nodemon');

  // "grunt generate" - deletes existing data, and creates new mock data set
  grunt.registerTask('generate', ['shell:deleteMockData', 'shell:generateNodes', 'shell:generateSwitches', 'shell:generateConnectivity']);

  // The tasks that get executed when typing 'grunt'
  grunt.registerTask('default', ['shell:mongo', 'nodemon']);
};