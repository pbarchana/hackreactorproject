var gulp          = require('gulp'),
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

var serverNum = 4000;
var switchNum = 500;
var dataCenterNum = 100;

// =============== Generate Data ===============

var db = require('./server/workers/database');
var connect = require('./server/workers/connectServers');
var dir = __dirname + '/server/workers/';
var cwd = { cwd: 'server/workers' };

// -------------- Create Files -----------------

gulp.task('checkDirectories', function(cb) {
  exec('node checkForDirectories.js', cwd, cb);
});

gulp.task('deleteFiles', ['checkDirectories'], function(cb) {
  exec('node deleteMockData.js', cwd, cb);
});

// TODO: find a cleaner way to do this with bind/each. Is there any way to change the bind order??
gulp.task('createFiles', ['deleteFiles'], function(cb) {
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

// -------------- Save To DB -----------------

gulp.task('open', function(cb) {
  db.connect(cb);
});

gulp.task('delete', ['open'], function(cb) {
  db.delete(cb);
});

gulp.task('saveFiles', ['open', 'createFiles'], function(cb) {
  db.saveFiles(cb);
});

gulp.task('connect', ['open', 'saveFiles'], function(cb) {
  connect.servers.tree(cb);
});

gulp.task('generate', ['checkDirectories', 'deleteFiles', 'createFiles', 'open', 'delete', 'createFiles', 'saveFiles', 'connect'], function() {
  db.close();
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
// TODO: get uglify working
gulp.task('scripts', ['templates'], function() {
  return gulp.src('public/index.js')
    .pipe(browserify({
      insertGlobals : true,
    }))
    // .pipe(uglify())
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

// =============== Watch ===============

gulp.task('nodemon', ['scripts', 'css', 'copy'], function () {
  nodemon({ script: 'server/server.js', options: '--debug' });
});
gulp.task('watch', ['scripts', 'css', 'copy'], function () {
  gulp.watch('public/client/**', ['scripts']);
  gulp.watch('public/stylesheets/**', ['css']);
  gulp.watch('public/index.html', ['copy']);
});

// =============== Default ===============

gulp.task('default', ['nodemon', 'watch']);