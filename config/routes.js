// Import models
var BSON = require('bson');

var Servers = require('../models/servers.js');
var Switches = require('../models/switches.js');
var Connectivity = require('../models/connectivity.js');

var serversToNodes = function(nodes, type, newNodes) {
  nodes.forEach(function(node) {
    var newNode = {};
    newNode._id = node._id.toHexString();
    newNode.type = type;
    newNode.macs = [];
    // Extract the mac addresses
    // Located within components.nics[i].mac for both servers and switches
    node.components.nics.forEach(function(nic) {
      newNode.macs.push(nic.mac);
    });
    newNodes.push(newNode);
  });
  return newNodes;
};

var connectivityToLinks = function() {

};

module.exports = function(app) {

  app.get('/nodes', function(req, res) {
    // lean returns a plain javascript object with not mongoose stuff atached to it
    var json = {"results": {}};
    Servers.find('components.nics.mac').lean().exec(function (err, servers) {
      if (err) console.log(err);// TODO handle err
      Switches.find().lean().exec(function (err, switches) {
        if (err) console.log(err);// TODO handle err
        Switches.find().lean().exec(function (err, connectivity) {
          if (err) console.log(err);
          json.results.servers = servers;
          json.results.switches = switches;
          json.results.connectivity = connectivity;
          res.set("Content-Type", "application/json");
          res.send(json);
        });
      });
    });
  });

  // get all data
  app.get('/all', function(req, res) {
    // lean returns a plain javascript object with not mongoose stuff atached to it
    debugger;
    var json = {"results": {}};
    Servers.find('components.nics.mac').lean().exec(function (err, servers) {
      if (err) console.log(err);// TODO handle err
      Switches.find().lean().exec(function (err, switches) {
        if (err) console.log(err);// TODO handle err
        Switches.find().lean().exec(function (err, connectivity) {
          if (err) console.log(err);
          json.results.servers = servers;
          json.results.switches = switches;
          json.results.connectivity = connectivity;
          res.set("Content-Type", "application/json");
          res.send(json);
        });
      });
    });
  });

  // get server data
  app.get('/servers', function(req, res) {
    Servers.find().lean().exec(function (err, servers) {
      if (err) console.log(err);// TODO handle err
      console.log('RETRIEVED:' + servers);
      res.set("Content-Type", "application/json");
      res.send(servers);
    });
  });

  // get switch data
  app.get('/switches', function(req, res) {
    Switches.find().lean().exec(function (err, switches) {
      if (err) console.log(err);// TODO handle err
      console.log('RETRIEVED:' + switches);
      res.set("Content-Type", "application/json");
      res.send(switches);
    });
  });
};