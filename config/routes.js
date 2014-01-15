
module.exports = function(app, Servers) {
  
  // TODO: return index.html
  app.get('/', function(req, res){
    res.send('hello world');
  });

  // get server data
  app.get('/data', function(req, res) {
    // lean returns a plain javascript object with not mongoose stuff atached to it
    Servers.find().lean().exec(function (err, servers) {
      if (err) console.log(err);// TODO handle err
      console.log('RETRIEVED:' + servers);
      res.set("Content-Type", "application/json");
      res.send(servers);
    });
  });

  // save server data

};

