var gulp          = require('gulp'),
    gutil = require('gulp-util'),
    // gulp-util     = require('gulp-util'),
    exec          = require('child_process').exec,
    browserify    = require('gulp-browserify'),
    rename        = require("gulp-rename"),
    stylus        = require('gulp-stylus'),
    concat        = require('gulp-concat'),
    nodemon       = require('gulp-nodemon'),
    templateCache = require('gulp-angular-templatecache'),
    async         = require('async');

// =============== Gulp Config ===============
var dest = './dist';

var stylesheets = [
  'node_modules/bootstrap/dist/css/bootstrap.min.css',
  'node_modules/animate.css/animate.min.css',
  'public/stylesheets/style.css'
];

var serverNum = 10;
var switchNum = 2;
var dataCenterNum = 2;

// =============== Generate Data ===============
var dir = __dirname + '/server/workers/';
// exec = exec.bind(null, { cwd: 'server/workers' });
var cwd = { cwd: 'server/workers' };

gulp.task('delete', function(cb) {
  var commands = [
    'node ' + dir + 'checkForDirectories.js',
    'node ' + dir + 'deleteMockData.js'
  ];
  async.each(commands, exec, cb);
});
// TODO: find a cleaner way to do this with bind/each. Is there any way to change the bind order??
gulp.task('create', ['delete'], function(cb) {
  async.series([
    function(callback) {
      exec('python mockNodes.py ' + serverNum, cwd, callback);
    },
    function(callback) {
      exec('node mockDataCenter.js ' + dataCenterNum, cwd, callback);
    },
    function(callback) {
      exec('node mockSwitches ' + switchNum, cwd, callback);
    }
  ], cb);
});

gulp.task('connect', ['create'], function(cb) {
  exec('node mockConnectivity', cwd, cb);
});

gulp.task('generate', ['connect'], function(cb) {
  require('./server/workers/saveFilesToDB');
  // exec('node saveFilesToDB.js', cwd, cb);
});

// gulp.task('generate', ['save']);

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
gulp.task('copyFonts', function() {
  return gulp.src('node_modules/bootstrap/fonts/**')
    .pipe(gulp.dest('./dist/fonts'));
});
gulp.task('copyImg', function() {
  return gulp.src('./public/img/**')
    .pipe(gulp.dest('./dist/img'));
});
gulp.task('copy', ['copyIndex', 'copyFonts', 'copyImg']);

// =============== Automatic Reload ===============
gulp.task('nodemon', ['scripts', 'css', 'copy'], function () {
  nodemon({ script: 'server/server.js', options: '--debug' });
});
gulp.task('watch', ['scripts', 'css', 'copy'], function () {
  gulp.watch('public/client/**', ['scripts']);
  gulp.watch('public/stylesheets/**', ['css']);
});

// =============== Default ===============
gulp.task('default', ['nodemon', 'watch']);