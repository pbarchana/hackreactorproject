var fs = require('fs');
var path = require("path");
var mockDir = path.join(__dirname, '..', 'mockData/out/');

var clearDatabase = function(Servers) {
  Servers.remove({}, function(err) {
    console.log('collection removed');
  });
};

var saveToDB = function(Servers, json) {
  var servers = new Servers(JSON.parse(json));
  servers.save(function (err, servers) {
    if (err) console.log(err);
    console.log('saved server to db');
  });
};

module.exports = function(Servers) {
  // clear any collections data from the database
  debugger;
  clearDatabase(Servers);
  // readfiles each file in the mockData/out dir and save them to the DB
  fs.readdir(mockDir, function(err, files){
    if (err) throw err;
    files.forEach(function(file){
      fs.readFile(mockDir + file, 'utf-8', function(err, json) {
        if (err) throw err;
        saveToDB(Servers, json);
      });
    });
  });
};
