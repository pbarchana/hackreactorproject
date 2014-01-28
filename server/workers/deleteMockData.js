var fs = require('fs');
var path = require('path');
var baseDir = path.join(__dirname, '..', 'mockData/');

var deleteFiles = function(pathToDir) {
  fs.readdir(pathToDir, function(err, files){
    if (err) throw err;
    files.forEach(function(file) {
      fs.unlink(pathToDir + file, function (err) {
        if (err) throw err;
        console.log('successfully deleted ' + file);
      });
    });
  });
};

deleteFiles(baseDir + 'servers/');
deleteFiles(baseDir + 'switches/');
deleteFiles(baseDir + 'connectivity/');
deleteFiles(baseDir + 'datacenters/');

