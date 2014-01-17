// Import models
var Servers = require('../models/servers.js');
var Switches = require('../models/switches.js');
var Connectivity = require('../models/connectivity.js');

module.exports = function(app) {

  // get all data
  app.get('/all', function(req, res) {
    // lean returns a plain javascript object with not mongoose stuff atached to it
    var json = {"results": {}};
    Servers.find().lean().exec(function (err, servers) {
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