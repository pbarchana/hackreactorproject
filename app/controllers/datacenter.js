var mongoose = require('mongoose');
var async = require('async');

var DataCenter = mongoose.model('DataCenter');
var DataCenterConnection = mongoose.model('DataCenterConnection');


var getCoordinates = function(id) {
  var coordinates;
  DataCenter.findById(id, function(err, dataCenter) {
    coordinates = [dataCenter.latitude, dataCenter.longitude];
  });
  return coordinates;
};

module.exports.getAll = function(req, res) {
  DataCenter.find(function(err, dataCenters) {
    DataCenterConnection.find(function(err, dataCenterConnections) {
      console.log(dataCenterConnections);
      var json = {};
      json.dataCenters = dataCenters;
      var  connections = [];

      // create connections
      async.each(dataCenterConnections, function(connection, mainCallback) {
        async.parallel([
          // get origin coordinates
          function(callback) {
            DataCenter.findById(connection.origin, callback);
          },
          // get connection coordinates
          function(callback) {
            DataCenter.findById(connection.connection, callback);
          }
        ], function(err, dataCenters) {
          var originCoord = [dataCenters[0].latitude, dataCenters[0].longitude];
          var connectionCoord = [dataCenters[1].latitude, dataCenters[1].longitude];
          connections.push([originCoord, connectionCoord]);
          mainCallback();
        });
      }, function() {
        json.connections = connections;
        res.set("Content-Type", "application/json");
        res.send(json);
      });
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