
var saveToDB = function(Servers, json) {
  var servers = new Servers({ servers: json });
  servers.save(function (err, servers) {
    if (err) console.log(err);
    // console.log('SAVED:' + servers);

    Servers.find(function (err, servers) {
      if (err) console.log(err);// TODO handle err
      console.log('RETRIEVED:' + servers);
    });
  });
};

module.exports = function(Servers) {
  var fs = require('fs');
  var mockDir = './mockData/out/';
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
