// ================ Dependencies =====================

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');
var config = require('../config/config');
var baseDir = path.join(__dirname, '..', 'mockData/');

// ================ Models =====================

var models = require('./bootstrapModels');

// ================ Functions =====================

var helpers = {};

// create three hubs in San Francisco, Chicago, and New York
helers.selectHubs = function(dataCenters) {
  var sanFranHub = dataCenters.splice(0,1);
  sanFranHub.name = 'San Francisco Hub';
  sanFranHub.location = 'San Francisco';
  sanFranHub.latitude = 37.78;
  sanFranHub.longitude = 122.41;

  var chicagoHub = dataCenters.splice(0,1);
  chicagoHub.name = 'Chicago Hub';
  chicagoHub.location = 'Chicago';
  chicagoHub.latitude = 41.88;
  chicagoHub.longitude = 87.62;

  var newYorkHub = dataCenters.splice(0,1);
  newYorkHub.name = 'New York Hub';
  newYorkHub.location = 'New York';
  newYorkHub.latitude = 40.67;
  newYorkHub.longitude = 73.94;

  return [sanFranHub, chicagoHub, newYorkHub];
};

helpers.selectSubCenter = function(subCenters) {
  return subCenters.splice(0,1);
};

helpers.selectHub= function(hubs) {
  return hub[Math.floor(Math.random() * hubs.length)];
};

helpers.makeConnection = function(subCenter, hub) {
  // Override coordinates with ones close to hub
  subCenter.location = hub.location;
  subCenter.latitude = helpers.generateNearbyCoordinate(hub.latitude);
  subCenter.longitude = helpers.generateNearbyCoordinate(hub.latitude);

  // return connection
  var connection = {};
  connection.sourceId = hub._id;
  connection.targetId = subCenter._id;
  return connection;
};

// Generate coordinate within two points of given coordinate
helpers.generateNearbyCoordinate = function(coordinate) {
  var plusOrMinus = Math.random() > 0.5 ? 1 : -1;
  var num = (Math.random() * 2).toFixed(2);
  return coordinate + plusOrMinus * num;
};

// Connect servers even between
var makeTreeConnections = function(dataCenters) {
  var hubs = helpers.selectHubs(dataCenters); // splice a few data centers from array, reset hub lat lang, and return them
  var subCenters = dataCenters; // save the remainder that weren't spliced

  var connections = [];
  
  var avgNum = Math.floor(subCenters.length/hubs.length);
  _.each(hubs, function(hub) {
    // Connect hub to subCenters
    for (var i = 0; i < avgNum; i++) {
      if (!subCenters.length) return;
      connections.push(helpers.makeConnection(helpers.selectSubCenter(subCenters), hub));
    }
    // Connect hub to one other hub switch
    connections.push(helpers.makeConnection(helpers.selectHub(hubs), hub));
  });
  return connections;
};

// ================ Exports =====================

// retrieve info, make connections, save in database
// all expect database connection to be open

// ------------ Data Centers -----------

module.exports.dataCenters = {};
module.exports.dataCenters.tree = function(cb) {
  async.parallel({
    dataCenters: function(callback){
      models.DataCenter.find(callback);
    },
    switches: function(callback){
      models.Switch.find(callback);
    }
  }, function(err, results) {
    var connections = makeTreeConnections(resultsDataCenters);

    models.Connection.collection.insert(connections, null, function(err, results) {
      console.log(results);
      cb();
    });
  });
};

