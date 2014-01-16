
module.exports = function(app, Servers, Switches) {
  
  // TODO: return index.html
  app.get('/', function(req, res){
    res.send('hello world');
  });

  // get all data
  app.get('/all', function(req, res) {
    // lean returns a plain javascript object with not mongoose stuff atached to it
    var results = '';
    Servers.find().lean().exec(function (err, servers) {
      if (err) console.log(err);// TODO handle err
      Switches.find().lean().exec(function (err, switches) {
        if (err) console.log(err);// TODO handle err
        debugger;
        res.set("Content-Type", "application/json");
        res.send(servers);
    });
  });
  // get server data
  app.get('/servers', function(req, res) {
    // lean returns a plain javascript object with not mongoose stuff atached to it
    Servers.find().lean().exec(function (err, servers) {
      if (err) console.log(err);// TODO handle err
      console.log('RETRIEVED:' + servers);
      res.set("Content-Type", "application/json");
      res.send(servers);
    });
  });
  // get switch data
  app.get('/switches', function(req, res) {
    // lean returns a plain javascript object with not mongoose stuff atached to it
    Switches.find().lean().exec(function (err, switches) {
      if (err) console.log(err);// TODO handle err
      console.log('RETRIEVED:' + switches);
      res.set("Content-Type", "application/json");
      res.send(switches);
    });
  });
}