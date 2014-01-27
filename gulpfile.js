var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    exec       = require('child_process').exec,
    async      = require('async'),
    browserify = require('gulp-browserify'),
    rename     = require("gulp-rename"),

// Generate configurations
var serverNum = 20;
var switchNum = 5;
var dataCenterNum = 5;
// Generate mock data
gulp.task('generate', function() {
  var callback = function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  };
  exec('node' + __dirname + '/workers/checkForDirectories', callback);
  exec('node' + __dirname + '/workers/deleteMockData', callback);
  exec('node' + __dirname + '/workers/mockDataCenter ' + dataCenterNum, callback);
  exec('python' + __dirname + '/workers/mockNodes.py ' + serverNum, callback);
  exec('node' + __dirname + '/workers/mockSwitches ' + switchNum, callback);
  exec('node' + __dirname + '/workers/mockConnectivity', callback);
  exec('node' + __dirname + '/workers/saveFilesToDB', callback);
});

// Generate bundle.js from index.js
gulp.task('scripts', function() {
  // Single entry point to browserify
  gulp.src('public/index.js')
    .pipe(browserify({
      insertGlobals : false,
    }))
    .pipe(rename("bundle.js"))
    .pipe(gulp.dest('./public'));
});

// watch for changes
gulp.task('watch', function () {
  gulp.watch('public/client/**', ['scripts']);
});

gulp.task('save', function() {
});

gulp.task('connect', function() {
});

gulp.task('express', function() {
  require('./server');
});


// Default task
gulp.task('default', function(){

  require('./server');

});