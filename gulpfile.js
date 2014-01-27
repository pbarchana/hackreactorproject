var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    exec       = require('child_process').exec,
    async      = require('async'),
    browserify = require('gulp-browserify'),
    rename     = require("gulp-rename"),
    stylus     = require('gulp-stylus'),
    concat     = require('gulp-concat'),
    nodemon    = require('gulp-nodemon');

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

gulp.task('scripts', function() {
  // Single entry point to browserify
  var stream = gulp.src('public/index.js')
    .pipe(browserify({
      insertGlobals : false,
    }))
    .pipe(rename("bundle.js"))
    .pipe(gulp.dest('./public'));
  return stream;
});

// Get and render all .styl files recursively 
gulp.task('stylus', function () {
  var stream = gulp.src('./public/stylesheets/style.styl')
    .pipe(stylus({
        use: ['nib'],
        set:['compress']
      }))
    .pipe(gulp.dest('./public/stylesheets'));
  return stream;
});

gulp.task('css', ['stylus'], function() {
  var stream = gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css', 'node_modules/animate.css/animate.min.css', 'public/stylesheets/style.css'])
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest('./public'));
  return stream;
});

// watch for changes
// gulp.task('copyIndex', function() {
//   return gulp.src('./public/index.html')
//     .pipe(gulp.dest('./dist'));
// });

// gulp.task('server', function() {
//   require('./server');
// });

gulp.task('nodemon', ['scripts', 'css'], function () {
  nodemon({ script: 'server.js', options: '--debug' });
});

gulp.task('watch', ['scripts', 'css'], function () {
  gulp.watch('public/client/**', ['scripts']);
  gulp.watch('public/stylesheets/**', ['css']);
});




// Default task
gulp.task('default', ['nodemon', 'watch']);