var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/config');
var readFiles = require('./readFiles');
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

// Bootstrap db connection
mongoose.connect(config.db);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // once connection open, read all the mock files and save it to database
  readFiles(Servers);
});

// Bootstrap routes
require('./config/routes')(app);

app.listen(8080);
console.log("Listening on http://localhost:8080");
