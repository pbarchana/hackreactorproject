var gulp = require('gulp');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var async = require('async');
var browserify = require('gulp-browserify');
var rename = require("gulp-rename");

gulp.task('scripts', function() {
    // Single entry point to browserify
    gulp.src('public/index.js')
        .pipe(browserify({
          insertGlobals : false,
        }))
        .pipe(rename("bundle.js"))
        .pipe(gulp.dest('./public'));
});

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
  exec('node' + __dirname + '/workers/mockDataCenter 2', callback);
  exec('python' + __dirname + '/workers/mockNodes.py 2', callback);
  exec('node' + __dirname + '/workers/mockSwitches 2', callback);
  exec('node' + __dirname + '/workers/mockConnectivity', callback);
  exec('node' + __dirname + '/workers/saveFilesToDB', callback);
});

gulp.task('save', function() {
});

gulp.task('connect', function() {
});


gulp.task('default', function(){
  // place code for your default task here
});