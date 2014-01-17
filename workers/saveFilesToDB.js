var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var rootDir = path.join(__dirname, '..', 'mockData/');

// Import models
// var Servers = require('../models/servers.js');
// var Switches = require('../models/switches.js');

// var Schema = mongoose.Schema;
// var serverSchema = new Schema ({
//   date: Number,
//   attributes: {},
//   components: {}
// });
// var switchSchema = new Schema ({
//   attributes: {},
//   components: {
//     nics: []
//   }
// });

// // Create models
// var Servers = mongoose.model('Servers', serverSchema);
// var Switches = mongoose.model('Switches', switchSchema);

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
module.exports = function(Model, pathToDir) {
  // clear any collections data from the database
  clearDatabase(Model);
  debugger;
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

// Save data
// clearAndSave(Servers, rootDir + "servers/");
// clearAndSave(Switches, rootDir + "switches/");
