
// =========== Dependencies ===============

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var config = require('../config/config');
var baseDir = path.join(__dirname, '..', 'mockData/');

// =========== Models ===============

//Bootstrap models
var models_path = path.join(__dirname, '..', 'app/models');
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);
// Save reference to models
var Server = mongoose.model('Server');
var Switch = mongoose.model('Switch');
var Connection = mongoose.model('Connection');
var DataCenter = mongoose.model('DataCenter');
var DataCenterConnection = mongoose.model('DataCenterConnection');

// =========== Helpers ===============

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

// =========== Logic ===============
 
// Connect to database and save
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // Save data
  async.each([Server])
  clearAndSave(Server, baseDir + "servers/");
  clearAndSave(Switch, baseDir + "switches/");
  // clearAndSave(Connection, baseDir + "connectivity/");
  clearAndSave(DataCenter, baseDir + "datacenters/");
  clearDatabase(DataCenterConnection);
});

