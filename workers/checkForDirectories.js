var fs = require('fs');
var path = require('path');
var baseDir = path.join(__dirname, '..', 'mockData/');

var checkForDir = function(dirPath) {
  fs.exists(dirPath, function (exists) {
    if (!exists) {
      fs.mkdir(dirPath, function() {
        console.log('directory created');
      });
    }
  });
};

checkForDir(baseDir + 'servers/');
checkForDir(baseDir + 'switches/');
checkForDir(baseDir + 'connectivity/');


