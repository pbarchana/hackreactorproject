// Load models
var mongoose = require('mongoose');
var Server = mongoose.model('Server');
var Switch = mongoose.model('Switch');
var Connection = mongoose.model('Connection');

// Helpers
var addToD3Nodes = function(nodes, type, newNodes) {
  nodes.forEach(function(node) {
    var newNode = {};
    newNode._id = node._id.toHexString();
    newNode.type = type;
    newNode.macs = [];
    // Extract the mac addresses
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

var addToZoomD3Links = function(connections, links) {
  connections.forEach(function(connection) {
    connection.interfaces.forEach(function(interface) {
      interface.neighbors.forEach(function(mac) {
        link = {};
        link.source = {};
        link.target = {};
        link.source.arc = interface.mac;
        link.source.x   = -1;
        link.source.y   = -1;
        
        link.target.arc = mac;
        link.target.x   = -1;
        link.target.y   = -1;        
        links.push(link);
      });
    });
  });
};

module.exports.getAll = function(req, res) {
  // lean returns a plain javascript object with not mongoose stuff atached to it
  var json = {"results": {}};
  Server.find(function (err, servers) {
    Switch.find(function (err, switches) {
      Connection.find(function (err, connectivity) {
        json.results.servers = servers;
        json.results.switches = switches;
        json.results.connectivity = connectivity;
        res.set("Content-Type", "application/json");
        res.send(json);
      });
    });
  });
};

module.exports.getAllFlattened = function(req, res) {
  // lean returns a plain javascript object with not mongoose stuff atached to it
  var json = {};
  var nodes = [];
  var links = [];
  Server.find(function (err, servers) {
    Switch.find(function (err, switches) {
      Connection.find(function (err, connections) {
        servers.forEach(function(server) {
          nodes.push(server);
        });
        switches.forEach(function(oneSwitch) {
          nodes.push(oneSwitch);
        });
        addToD3Links(connections, links);
        
        json.nodes = nodes;
        json.links = links;
        res.set("Content-Type", "application/json");
        res.send(json);
      });
    });
  });
};

module.exports.getAllZoomed = function(req, res) {
  // lean returns a plain javascript object with not mongoose stuff atached to it
  var json = {};
  var nodes = [];
  var links = [];
  Server.find(function (err, servers) {
    Switch.find(function (err, switches) {
      Connection.find(function (err, connections) {
        servers.forEach(function(server) {
          nodes.push(server);
        });
        switches.forEach(function(oneSwitch) {
          nodes.push(oneSwitch);
        });
        addToZoomD3Links(connections, links);
        json.nodes = nodes;
        json.links = links;
        res.set("Content-Type", "application/json");
        res.send(json);
      });
    });
  });
};

module.exports.getD3Data = function(req, res) {
  // lean returns a plain javascript object with not mongoose stuff atached to it
  var json = {};
  var newNodes = [];
  var links = [];
  Server.find({}, {"components.nics.mac":1}, function (err, servers) {
    addToD3Nodes(servers, 'server', newNodes);
    Switch.find({}, {"components.nics.mac":1}, function (err, switches) {
      addToD3Nodes(switches, 'switch', newNodes);
      Connection.find(function(err, connections) {
        addToD3Links(connections, links);
        json.nodes = newNodes;
        json.links = links;
        res.set("Content-Type", "application/json");
        res.send(json);
      });
    });
  });
};