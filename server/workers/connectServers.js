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

helpers.makeIdMacsArray = function(nodes) {
  return _.map(nodes, function(node) {
    return {
      _id: node._id,
      macs: _.map(node.components.nics, function(nic) {
        return nic.mac;
      })
    };
  });
};

helpers.selectRandomMac = function(macs) {
  var macIdx = Math.floor(Math.random(macs.length));
  var mac = macs[macIdx];
  // Remove mac so we can't access it again
  // macs.splice(macIdx, 1);
  return mac;
};

helpers.selectRandomServer = function(servers) {
  var serverIdx = Math.floor(Math.random(servers.length));
  var server = servers[serverIdx];
  // Remove server so we can't access it again
  servers.splice(serverIdx, 1);
  return server;
};

helpers.selectRandomSwitch = function(switches) {
  var switchIdx = Math.floor(Math.random(switches.length));
  var mySwitch = switches[switchIdx];
  return mySwitch;
};

helpers.makeConnection = function(server, mySwitch) {
  return {
    source: helpers.selectRandomMac(server.macs),
    target: helpers.selectRandomMac(mySwitch.macs),
    sourceId: server._id,
    targetId: mySwitch._id
  };
};

// Connect servers even between
var makeTreeConnections = function(origServers, origSwitches) {
  var connections = [];
  var servers = helpers.makeIdMacsArray(origServers);
  var switches = helpers.makeIdMacsArray(origSwitches);
  
  var avgNum = Math.floor(servers.length/switches.length);
  _.each(switches, function(mySwitch) {
    // Connect switch to servers
    for (var i = 0; i < avgNum; i++) {
      if (!servers.length) return;
      connections.push(helpers.makeConnection(helpers.selectRandomServer(servers), mySwitch));
    }
    // Connect switch to one other random switch
    connections.push(helpers.makeConnection(helpers.selectRandomSwitch(switches), mySwitch));
  });
  return connections;
};

// ================ Exports =====================

// retrieve info, make connections, save in database
// all expect database connection to be open

// ------------  Servers and Switches -----------

module.exports.servers = {};
module.exports.servers.tree = function(cb) {
  async.parallel({
    servers: function(callback){
      models.Server.find(callback);
    },
    switches: function(callback){
      models.Switch.find(callback);
    }
  }, function(err, results) {
    var connections = makeTreeConnections(results.servers, results.switches);

    models.Connection.collection.insert(connections, null, function(err, results) {
      console.log(results);
      cb();
    });
  });
};

// ------------ Data Centers -----------

module.exports.dataCenters = function() {
  // TODO: ...
};

