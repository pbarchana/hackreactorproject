var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var config = require('../config/config');
var baseDir = path.join(__dirname, '..', 'mockData/');

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

// Create reference to models
var Server = mongoose.model('Server');
var Switch = mongoose.model('Switch');
var Connection = mongoose.model('Connection');
var DataCenter = mongoose.model('DataCenter');
var DataCenterConnection = mongoose.model('DataCenterConnection');



var saveToDB = function(Model, json) {
  var model = new Model(json);
  model.save(function (err, Model) {
    if (err) console.log(err);
    console.log('saved file to db');
  });
};

// generate random connections between all existing data centers
var generateConnections = function(dataCenters, maxNumOfConnections) {
  var json = {};
  var connections = [];
  var max = dataCenters.length < maxNumOfConnections ? dataCenters.length : maxNumOfConnections;
  // helpers
  var randomIndex = function() {
    return Math.floor(Math.random() * dataCenters.length);
  };
  var connect = function(dataCenter) {
    var linkNum = Math.ceil(Math.random() * max);
    var connectionIds = [];
    for (var i = 0; i < linkNum; i++) {
      connectionIds.push(dataCenters[i]._id);

      // save in separate connection table
      // saveToDB(DataCenterConnection, {
      //   origin: dataCenter._id,
      //   connection: dataCenters[randomIndex()]._id
      // });
    }
    dataCenter.connectionIds = connectionIds;
    // save new dataCenter with references to connections
    saveToDB(DataCenter, dataCenter);
  };
  // generate connections
  connect(dataCenters[0]);
  json.connections = connections;
  return json;
};


// retrieve and save connections
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  DataCenter.find(function (err, dataCenters) {
    if (err) console.log(err);// TODO handle err
    generateConnections(dataCenters, 3);
  });
});