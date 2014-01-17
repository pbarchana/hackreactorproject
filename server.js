// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/config');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');
var saveFilesToDB = require('./workers/saveFilesToDB.js');

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

// Import models
var Servers = require('./models/servers.js');
var Switches = require('./models/switches.js');

// Bootstrap routes
require('./config/routes')(app, Servers, Switches);

// Bootstrap db connection
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // once connection open, read all the mock files and save it to database
  saveFilesToDB(Servers, path.join(__dirname, 'mockData/servers/'));
  saveFilesToDB(Switches, path.join(__dirname, 'mockData/switches/'));
  
  // Open the connection
  app.listen(8081);
  console.log("Listening on http://localhost:8081");
});


