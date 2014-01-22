// Random name from the ones listed below
var generateName = function() {
  var names = ['XO San Francisco', 'Cogent', 'Virtustream SF', 'Savvis SN1', 'Colocation America'];
  var randomIdx = Math.floor(Math.random() * names.length);
  return names[randomIdx];
};

// Generate coordinate within 2 points of given number
var generateCoordinate = function(num) {
  return  num + (Math.random() * 2);
};

var generateDataCenter = function() {
  return {
    type: 'datacenter',
    name: generateName(),
    longitude: generateCoordinate(120),
    latitude: generateCoordinate(36)
  };
};

generateDataCenter();