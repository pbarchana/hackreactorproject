var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var config = require('../config/config');
var rootDir = path.join(__dirname, '..', 'mockData/');

// Import models
var Servers = require('../models/servers.js');
var Switches = require('../models/switches.js');

// Helpers
var clearDatabase = function(Model) {
  Model.remove({}, function(err) {
    console.log('collection removed');
  });
};
var saveToDB = function(Model, json) {
  var model = new Model(JSON.parse(json));
  model.save(function (err, Model) {
    if (err) console.log(err);
    console.log('saved file to db');
  });
};

// Save all files in a directory to a database model
var clearAndSave = function(Model, pathToDir) {
  // clear any collections data from the database
  clearDatabase(Model);
  // readfiles each file in the mockData/out dir and save them to the DB
  fs.readdir(pathToDir, function(err, files){
    if (err) throw err;
    files.forEach(function(file){
      fs.readFile(pathToDir + file, 'utf-8', function(err, json) {
        if (err) throw err;
        saveToDB(Model, json);
      });
    });
  });
};

// Connect to database and save
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // Save data
  clearAndSave(Servers, rootDir + "servers/");
  clearAndSave(Switches, rootDir + "switches/");
});