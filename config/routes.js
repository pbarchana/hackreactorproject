// Load models
var mongoose = require('mongoose');
var Server = mongoose.model('Server');
var Switch = mongoose.model('Switch');
var Connection = mongoose.model('Connection');

// var Switches = require('../models/switches.js');
// var Connectivity = require('../models/connectivity.js');

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

  app.get('/server/:id', function(req, res) {
    // lean returns a plain javascript object with not mongoose stuff atached to it
    Server.findById(req.params.id, function(err, server) {
      res.set("Content-Type", "application/json");
      res.send(server);
    });
  });

  app.get('/switch/:id', function(req, res) {
    // lean returns a plain javascript object with not mongoose stuff atached to it
    Switch.findById(req.params.id, function(err, mySwitch) {
      res.set("Content-Type", "application/json");
      res.send(mySwitch);
    });
  });

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

  // get server data
  app.get('/server', function(req, res) {
    Server.find().lean().exec(function (err, servers) {
      if (err) console.log(err);// TODO handle err
      console.log('RETRIEVED:' + servers);
      res.set("Content-Type", "application/json");
      res.send(servers);
    });
  });

  // get switch data
  app.get('/switch', function(req, res) {
    Switch.find().lean().exec(function (err, switches) {
      if (err) console.log(err);// TODO handle err
      console.log('RETRIEVED:' + switches);
      res.set("Content-Type", "application/json");
      res.send(switches);
    });
  });
  // get switch data
  app.get('/connection', function(req, res) {
    Connection.find().lean().exec(function (err, connections) {
      if (err) console.log(err);// TODO handle err
      console.log('RETRIEVED:' + connections);
      res.set("Content-Type", "application/json");
      res.send(connections);
    });
  });
};