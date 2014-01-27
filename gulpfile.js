var gulp          = require('gulp'),
    exec          = require('child_process').exec,
    async         = require('async'),
    browserify    = require('gulp-browserify'),
    rename        = require("gulp-rename"),
    stylus        = require('gulp-stylus'),
    concat        = require('gulp-concat'),
    nodemon       = require('gulp-nodemon');
    templateCache = require('gulp-angular-templatecache');

// =============== Gulp Config ===============
var dest = './dist';

var stylesheets = [
  'node_modules/bootstrap/dist/css/bootstrap.min.css',
  'node_modules/animate.css/animate.min.css',
  'public/stylesheets/style.css'
];

var serverNum = 20;
var switchNum = 5;
var dataCenterNum = 5;

// =============== Generate Data ===============
gulp.task('generate', function() {
  var callback = function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) console.log('exec error: ' + error);
  };
  exec('node' + __dirname + '/workers/checkForDirectories', callback);
  exec('node' + __dirname + '/workers/deleteMockData', callback);
  exec('node' + __dirname + '/workers/mockDataCenter ' + dataCenterNum, callback);
  exec('python' + __dirname + '/workers/mockNodes.py ' + serverNum, callback);
  exec('node' + __dirname + '/workers/mockSwitches ' + switchNum, callback);
  exec('node' + __dirname + '/workers/mockConnectivity', callback);
  exec('node' + __dirname + '/workers/saveFilesToDB', callback);
});

// =============== Scripts ===============
gulp.task('templates', function () {
  return gulp.src('public/client/views/*.html')
    .pipe(templateCache('templates.js', {
      root: 'client/views/',
      module: 'app'
    }))
    .pipe(gulp.dest('./public/client'));
});
gulp.task('scripts', ['templates'], function() {
  return gulp.src('public/index.js')
    .pipe(browserify({
      insertGlobals : true,
    }))
    .pipe(rename("bundle.js"))
    .pipe(gulp.dest(dest));
});

// =============== CSS ===============
gulp.task('stylus', function () {
  return gulp.src('./public/stylesheets/style.styl')
    .pipe(stylus({
        use: ['nib'],
        set:['compress']
      }))
    .pipe(gulp.dest('./public/stylesheets'));
});
gulp.task('css', ['stylus'], function() {
  return gulp.src(stylesheets)
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest(dest));
});

// =============== Copy Files ===============
gulp.task('copyIndex', function() {
  return gulp.src('./public/index.html')
    .pipe(gulp.dest(dest));
});
gulp.task('copyImg', function() {
  return gulp.src('./public/img/**')
    .pipe(gulp.dest('./dist/img'));
});
gulp.task('copy', ['copyIndex', 'copyImg']);

// =============== Automatic Reload ===============
gulp.task('nodemon', ['scripts', 'css', 'copy'], function () {
  nodemon({ script: 'server/server.js', options: '--debug' });
});
gulp.task('watch', ['scripts', 'css'], function () {
  gulp.watch('public/client/**', ['scripts']);
  gulp.watch('public/stylesheets/**', ['css']);
});

// =============== Default ===============
gulp.task('default', ['nodemon', 'watch']);