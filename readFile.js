
module.exports = function(Servers) {
  var fs = require('fs');
  var mockDir = './mockData/out';
  // var data = {};
  debugger;
  fs.readdir(mockDir, function(err, files){
    debugger;
    if (err) throw err;
    // var c = 0;
    var servers = new Servers({ servers: servers });
    servers.save(function (err, servers) {
      if (err) console.log(err);
      console.log('SAVED:' + servers);

      Servers.find(function (err, servers) {
        if (err) // TODO handle err
        console.log('RETRIEVED:' + servers);
      });
    });
    files.forEach(function(file){
      // c++;
      fs.readFile(mockDir + file, 'utf-8', function(err, json) {
        if (err) throw err;
        debugger;
        // data[file] = html;
        // if (0 === --c) {
        //   console.log(data);  //socket.emit('init', {data: data});
        // }
      });
    });
  });
};
