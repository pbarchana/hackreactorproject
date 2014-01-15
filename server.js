var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/config');
var readFiles = require('./workers/readFiles');

var app = express();

// Setup our database schema and model
var Schema = mongoose.Schema;
var dataSchema = new Schema ({
  date: Number,
  attributes: {},
  components: {}
});

// Setup the model
var Servers = mongoose.model('Servers', dataSchema);

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


