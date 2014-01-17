
module.exports = function(app, Servers, Switches) {

  // get all data
  app.get('/all', function(req, res) {
    // lean returns a plain javascript object with not mongoose stuff atached to it
    var json = {"results": {}};
    Servers.find().lean().exec(function (err, servers) {
      if (err) console.log(err);// TODO handle err
      Switches.find().lean().exec(function (err, switches) {
        if (err) console.log(err);// TODO handle err
        json.results.servers = servers;
        json.results.switches = switches;
        res.set("Content-Type", "application/json");
        res.send(json);
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