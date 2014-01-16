var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/config');
var readFiles = require('./workers/readFiles');

var app = express();

// Setup our database schema and model
var Schema = mongoose.Schema;
var serverSchema = new Schema ({
  date: Number,
  attributes: {},
  components: {}
});
var switchSchema = newScheam ({
  attributes: {},
  components: {
    nics: []
  }
});

// Setup the models
var Servers = mongoose.model('Servers', serverSchema);
var Switches = mongoose.model('Switches', switchSchema);

// Bootstrap routes
require('./config/routes')(app, Servers);

// Bootstrap db connection
mongoose.connect(config.db);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // once connection open, read all the mock files and save it to database
  readFiles(Servers);
  app.listen(8081);
  console.log("Listening on http://localhost:8081");
});


