var fs = require('fs');
var path = require('path');
// Random name from the ones listed below
var dataCenterName;
var baseDir = path.join(__dirname, '..', 'mockData/');


var generateName = function() {
  var names = ['XO San Francisco', 'Cogent', 'Virtustream SF', 'Savvis SN1', 'Colocation America'];
  var randomIdx = Math.floor(Math.random() * names.length);
  return names[randomIdx];
};

// Generate coordinate within 2 points of given number
var generateCoordinate = function(num) {
  return  (num + (Math.random() * 2)).toFixed(2);
};

// Generate coordinate within 2 points of given number
var generateLocation = function() {
  var locations = ['San Francisco', 'San Jose', 'Los Angeles'];
  return locations[Math.floor(Math.random() * locations.length)];
};

var generateDataCenter = function() {
  return {
    type: 'datacenter',
    name: generateName(),
    location: generateLocation(),
    longitude: generateCoordinate(-122),
    latitude: generateCoordinate(36)
  };
};

// Write datacenters to files
var requiredNrDataCenters = process.argv[2];
for (var i = 0; i < requiredNrDataCenters; i++) {
  dataCenterName = "datacenter" + i + ".json";
  fs.writeFileSync(baseDir + "datacenters/"+dataCenterName, JSON.stringify(generateDataCenter()));
}
