var mongoose = require('mongoose');
var async = require('async');
var Switch = mongoose.model('Switch');
var Connection = mongoose.model('Connection');

// ================= Helpers =====================

var getNodeConnections = function(node, allConnections) {
  // get all connections that match either source or target
  var queries = [ { sourceId: node._id }, { targetId: node._id } ];
  async.concat(queries, allConnections.find, function(err, results){
    // select whichever id != node id
    var connectionIds = _.map(results, function(err, result) {
      if (node._id === result.sourceId) return result.targetId;
      if (node._id === result.targetId) return result.sourceId;
    });
    // query for those id's
    async.each(connectionIds, Switch.findById, function() {

    });
  });
};

// ================= Exports =====================

module.exports.getById = function(req, res) {
  Switch.findById(req.params.id, function(err, result) {
    res.set("Content-Type", "application/json");
    res.send(result);
  });
};

module.exports.getByIdWithConnections = function(req, res) {
  var json = {};
  async.parallel({
    switch: function(callback) {
      Switch.findById(req.params.id, callback);
    },
    connections: function(callback) {
      Connection.find(callback);
    }
  }, function(err, results) {
    json.node = results.switch;
    json.connections = getNodeConnections(results.switch, results.connections);
    res.set("Content-Type", "application/json");
    res.send(mySwitch);
  });

  Switch.findById(req.params.id, function(err, mySwitch) {
    res.set("Content-Type", "application/json");
    res.send(mySwitch);
  });
};


module.exports.getAll = function(req, res) {
  Switch.find(function (err, switches) {
    if (err) console.log(err);// TODO handle err
    console.log('RETRIEVED:' + switches);
    res.set("Content-Type", "application/json");
    res.send(switches);
  });
};