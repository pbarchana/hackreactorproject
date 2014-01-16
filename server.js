var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/config');
var path = require("path");
var saveFilesToDB = require('./workers/readFiles');

var app = express();

// Create schemas
var Schema = mongoose.Schema;
var serverSchema = new Schema ({
  date: Number,
  attributes: {},
  components: {}
});
var switchSchema = new Schema ({
  attributes: {},
  components: {
    nics: []
  }
});

// Create models
var Servers = mongoose.model('Servers', serverSchema);
var Switches = mongoose.model('Switches', switchSchema);

// Bootstrap routes
require('./config/routes')(app, Servers, Switches);

// Bootstrap db connection
mongoose.connect(config.db);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // once connection open, read all the mock files and save it to database
  saveFilesToDB(Servers, path.join(__dirname, 'mockData/out/'));
  saveFilesToDB(Switches, path.join(__dirname, 'mockData/switches/'));
  
  // Open the connection
  app.listen(8081);
  console.log("Listening on http://localhost:8081");
});


