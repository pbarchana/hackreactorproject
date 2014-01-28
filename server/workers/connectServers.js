// ================ Dependencies =====================

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');
var config = require('../config/config');
var baseDir = path.join(__dirname, '..', 'mockData/');

// ================ Models =====================

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

// ================ Helpers =====================

var makeIdMacsArray = function(nodes) {
  return _.map(nodes, function(node) {
    return {
      _id: node._id,
      macs: _.map(node.components.nics, function(nic) {
        return nic.mac;
      })
    };
  });
};

var makeTreeConnections = function(origServers, origSwitches) {
  var connections = [];
  var servers = makeIdMacsArray(origServers);
  var switches = makeIdMacsArray(origSwitches);
  // choose a switch and connect to 5 - 10 random servers
  // each server only has one connection

  var selectRandomMac = function(macs) {
    var macIdx = Math.floor(Math.random(macs.length));
    var mac = macs[macIdx];
    // Remove mac so we can't access it again
    macs.splice(macIdx, 1);
    return mac;
  };

  var selectRandomServer = function() {
    var serverIdx = Math.floor(Math.random(servers.length));
    var server = servers[serverIdx];
    // Remove server so we can't access it again
    servers.splice(serverIdx, 1);
    return server;
  };

  var selectRandomSwitch = function() {
    var switchIdx = Math.floor(Math.random(switches.length));
    var mySwitch = switches[switchIdx];
    return mySwitch;
  };

  var makeConnection = function(server, mySwitch) {
    return {
      source: selectRandomMac(server.macs),
      target: selectRandomMac(mySwitch.macs),
      sourceId: server._id,
      targetId: mySwitch._id
    };
  };
  
  var avgNum = Math.floor(servers.length/switches.length);
  _.each(switches, function(mySwitch) {
    // Connect each switch to even number of servers
    for (var i = 0; i < avgNum; i++) {
      if (!servers.length) return;
      connections.push(makeConnection(selectRandomServer(), mySwitch));
    }
    // Connect the switch to one other random switch
    connections.push(makeConnection(selectRandomSwitch(), mySwitch));
  });
  return connections;
};


// var makeRandomConnections = function(servers, switches) {
//   // go through each server, and connect with a random switch
//   // map all servers with all switches

//   _.object(_.map(servers))

//   var randomSwitch = function() {
//     return Math.floor(Math.random(switches.length));
//   };

//   servers.forEach(function(server) {

//   });
// };
// Tree like structure

// var makeConnections = function(servers, switches) {

// };

// ================ Main Logic =====================

// retrieve and save connections
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  async.parallel({
    servers: function(callback){
      Server.find(callback);
    },
    switches: function(callback){
      Switch.find(callback);
    }
  }, function(err, results) {
    // make connections
    debugger;
    var connections = makeTreeConnections(results.servers, results.switches);
    // save connections

    Connection.remove({}, function(err) {
      console.log('connections removed');
    });

    Connection.collection.insert(connections, null, function(err, results) {
      console.log(results);
      mongoose.connection.close();
    });

    // async.each(connections, Connection.save, function(err, results) {
    //   debugger;
    //   console.log('SAVED: ' + results);
    // });
    // Connection.create(connections, function (err, results) {
    //   if (err) console.error(err);
    //   console.log('documents saved');
    // });
  });
});