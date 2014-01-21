module.exports = function(grunt) {
  // Helpers
  var random = function(max) {
    return Math.ceil(Math.random() * max);
  };

  grunt.initConfig({
    // start server
    nodemon: {
      dev: {
        options: {
          file: 'server.js',
          nodeArgs: ['--debug']
        }
      }
    },
    execute: {
      target: {
        src: ['server.js']
      }
    },

    shell: {
      // start mongo db
      mongo: {
        command: 'mongod',
        options: {
          async: true,
          timeout: 2000,
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
        command: 'python mockNodes.py ' + 20,
        options: {
          execOptions: {
            cwd: 'workers' // selected directory
          }
        }
      },
      generateSwitches: {
        command: 'node mockSwitches.js ' + 10,
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
      },
      saveFilesToDB: {
        command: 'node saveFilesToDB.js',
        options: {
          execOptions: {
            cwd: 'workers'
          }
        }
      },
      checkForDirectories: {
        command: 'node checkForDirectories.js',
        options: {
          execOptions: {
            cwd: 'workers'
          }
        }
      }
    }

  });

  // get dependencies
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-execute');

  // "grunt generate" - deletes existing data, and creates new mock data set
  grunt.registerTask('generate', [
    'shell:checkForDirectories',
    'shell:deleteMockData',
    'shell:generateNodes',
    'shell:generateSwitches',
    'shell:generateConnectivity',
    'shell:saveFilesToDB'
  ]);

  // The tasks that get executed when typing 'grunt'
  // Weird things happen if I try to run mongo here
  grunt.registerTask('default', ['nodemon']);
};