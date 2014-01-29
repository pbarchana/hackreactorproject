
// =========== Dependencies ===============

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');
var config = require('../config/config');


var baseDir = path.join(__dirname, '..', 'mockData/');
var models = require('./bootstrapModels');

// ============== Helpers ===============

var saveJSONToDB = function(Model, json, callback) {
  var model = new Model(JSON.parse(json));
  model.save(function (err, Model) {
    if (err) console.log(err);
    console.log('saved file to db');
    callback();
  });
};

// Save all files in a directory to a database model
var saveFilesToDb = function(Model, pathToDir, callback) {
  // TODO: figure out a way to do this asynchronously
  var files = fs.readdirSync(pathToDir);
  modelSaveFunctions = _.map(files, function(file) {
    var json = fs.readFileSync(pathToDir + file);
    var model = new Model(JSON.parse(json));
    return function(cb) { model.save(cb); };
  });

  async.parallel(modelSaveFunctions, function() {
    console.log('models saved to DB');
    callback();
  });


  // files.forEach(function(file) {
  //   json.push(fs.readFileSync(file));
  // });
  // // To large to do it this way
  // Model.collection.insert(json, null, function(err, results) {
  //   console.log(results);
  //   cb();
  // });
};

// =========== Exports ===============
 
module.exports.connect = function(callback) {
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', callback);
};

module.exports.close = function(callback) {
  mongoose.connection.close(callback);
};

module.exports.delete = function(callback) {
  var collections = _.keys(mongoose.connection.collections);
  async.each(collections, function(collectionName, cb) {
    var collection = mongoose.connection.collections[collectionName];
    collection.drop(function(err) {
      if (err && err.message != 'ns not found') cb(err);
      cb();
    });
  }, callback);
};

module.exports.saveFiles = function(callback) {
  async.parallel([
    // function(cb) { cb() }
    function(cb) { saveFilesToDb(models.Server, baseDir + "servers/", cb); },
    function(cb) { saveFilesToDb(models.Switch, baseDir + "switches/", cb); },
    function(cb) { saveFilesToDb(models.DataCenter, baseDir + "datacenters/", cb); }
  ], function() {
    console.log('all saved');
    callback();
  });
};

// module.exports.saveFiles(function() {});