// Load models
var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

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

var makeZoomD3Links = function(links) {
  return _.map(links, function(link) {
    var nwLink = {};
    nwLink.source = {};
    nwLink.source.element = link.toObject().source;
    nwLink.source.x   = -1;
    nwLink.source.y   = -1;

    nwLink.target = {};
    nwLink.target.element = link.toObject().target;
    nwLink.target.x   = -1;
    nwLink.target.y   = -1;
    return nwLink;
  });
};

module.exports.getAll = function(req, res) {
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

module.exports.getAllZoomed = function(req, res) {
  var json = {};
  async.parallel({
    servers: function(callback){
      // specifies which attributes to select
      Server.find({}, 'type attributes.UUID attributes.cVendor attributes.platform components.nics.mac', callback);
    },
    switches: function(callback){
      Switch.find(callback);
    },
    links: function(callback){
      Connection.find(callback);
    }
  }, function(err, results) {
    json.nodes = results.servers.concat(results.switches);
    json.links = makeZoomD3Links(results.links);
    res.set("Content-Type", "application/json");
    res.send(json);
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
