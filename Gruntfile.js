module.exports = function(grunt) {
  grunt.initConfig({
    // start mongo db
    shell: {
      mongo: {
        command: 'mongod',
        options: {
          async: true
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

  // The tasks that get executed when typing 'grunt'
  grunt.registerTask('default', ['shell', 'nodemon']);
};