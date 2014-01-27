var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    exec       = require('child_process').exec,
    async      = require('async'),
    browserify = require('gulp-browserify'),
    rename     = require("gulp-rename"),
    stylus     = require('gulp-stylus'),
    concat     = require('gulp-concat'),
    nodemon    = require('gulp-nodemon');
    templateCache = require('gulp-angular-templatecache');

var dest = './public';

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

// TODO: compile templates
// angular templates
// gulp.task('templates', function () {
//   // return es.concat(
//   return gulp.src('public/client/views/*.html')
//     .pipe(templateCache('templates.js', {
//       // root: 'client/views/',
//       // module: 'app'
//     }))
//     .pipe(gulp.dest('./public/client'));
// });

gulp.task('scripts', function() {
  // Single entry point to browserify
  return gulp.src('public/index.js')
    .pipe(browserify({
      insertGlobals : true,
    }))
    .pipe(rename("bundle.js"))
    .pipe(gulp.dest(dest));
});

// Get and render all .styl files recursively 
gulp.task('stylus', function () {
  return gulp.src('./public/stylesheets/style.styl')
    .pipe(stylus({
        use: ['nib'],
        set:['compress']
      }))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('css', ['stylus'], function() {
  return gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css', 'node_modules/animate.css/animate.min.css', 'public/stylesheets/style.css'])
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest(dest));
});

// gulp.task('copyIndex', function() {
//   return gulp.src('./public/index.html')
//     .pipe(gulp.dest(dest));
// });

// gulp.task('copyImg', function() {
//   return gulp.src('./public/img/**')
//     .pipe(gulp.dest('./dist/img'));
// });

// gulp.task('copy', ['copyIndex', 'copyImg']);

gulp.task('nodemon', ['scripts', 'css'], function () {
  nodemon({ script: 'server/server.js', options: '--debug' });
});

gulp.task('watch', ['scripts', 'css'], function () {
  gulp.watch('public/client/**', ['scripts']);
  gulp.watch('public/stylesheets/**', ['css']);
});




// Default task
gulp.task('default', ['nodemon', 'watch']);