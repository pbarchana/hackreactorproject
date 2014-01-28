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