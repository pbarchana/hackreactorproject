var mongoose = require('mongoose');
var DataCenter = mongoose.model('DataCenter');
var DataCenterConnection = mongoose.model('DataCenterConnection');

module.exports.getAll = function(req, res) {
  DataCenter.find(function(err, dataCenters) {
    DataCenterConnection.find(function(err, dataCenterConnections) {
      console.log(dataCenterConnections);
      var json = {};
      json.dataCenters = dataCenters;
      var connections = [];
      dataCenterConnections.forEach(function(connection) {
        connections.push([connection.origin, connection.connection]);
      });
      json.connections = connections;
      res.set("Content-Type", "application/json");
      res.send(json);
    });
  });
};

module.exports.getById = function(req, res) {
  // lean returns a plain javascript object with not mongoose stuff atached to it
  DataCenter.findById(req.params.id, function(err, dataCenter) {
    res.set("Content-Type", "application/json");
    res.send(dataCenter);
  });
};