// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/config');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');
// var saveFilesToDB = require('./workers/saveFilesToDB.js');

var app = express();

// set up environments
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(stylus.middleware({
  src: __dirname + '/public', // .styl files are located in `stylesheets`
  dest: __dirname + '/public', // .styl resources are compiled `public/stylesheets/*.css`
  compile: function (str, path) {
    return stylus(str)
      .set('filename', path)
      .set('compress', true)
      .use(nib());
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

// Bootstrap routes
require('./config/routes')(app);

// Bootstrap db connection
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // Open the connection
  app.listen(8081);
  console.log("Listening on http://localhost:8080");
});
