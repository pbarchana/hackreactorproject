// Load models
var path = require('path');
var mongoose = require('mongoose');
var Server = mongoose.model('Server');
var Switch = mongoose.model('Switch');
var Connection = mongoose.model('Connection');

// Load controllers
var serverCtrl = require('../app/controllers/server.js');
var switchCtrl = require('../app/controllers/switch.js');
var connectionCtrl = require('../app/controllers/connection.js');

var addToD3Nodes = function(nodes, type, newNodes) {
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
};

var addToD3Links = function(connections, links) {
  connections.forEach(function(connection) {
    connection.interfaces.forEach(function(interface) {
      interface.neighbors.forEach(function(mac) {
        link = {};
        link.source = interface.mac;
        link.target = mac;
        links.push(link);
      });
    });
  });
};

module.exports = function(app) {
  app.get('/nodes', function(req, res) {
    // lean returns a plain javascript object with not mongoose stuff atached to it
    var json = {};
    var newNodes = [];
    var links = [];
    Server.find({}, {"components.nics.mac":1}, function (err, servers) {
      addToD3Nodes(servers, 'server', newNodes);
      Switch.find({}, {"components.nics.mac":1}, function (err, switches) {
        addToD3Nodes(switches, 'switch', newNodes);
        Connection.find(function(err, connections) {
          debugger;
          addToD3Links(connections, links);
          json.nodes = newNodes;
          json.links = links;
          res.set("Content-Type", "application/json");
          res.send(json);
        });
      });
    });
  });

  // get server data
  app.get('/server', serverCtrl.getAll);
  app.get('/server/:id', serverCtrl.getById);

  // get switch data
  app.get('/switch', switchCtrl.getAll);
  app.get('/switch/:id', switchCtrl.getById);

  // get all data
  app.get('/all', function(req, res) {
    // lean returns a plain javascript object with not mongoose stuff atached to it
    var json = {"results": {}};
    Server.find('components.nics.mac').lean().exec(function (err, servers) {
      if (err) console.log(err);// TODO handle err
      Switch.find().lean().exec(function (err, switches) {
        if (err) console.log(err);// TODO handle err
        Connection.find().lean().exec(function (err, connectivity) {
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


  // get switch data
  app.get('/connection', connectionCtrl.getAll);
};