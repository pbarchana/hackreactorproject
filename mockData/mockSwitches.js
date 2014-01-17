var fs = require('fs');
var generateMAC = function() {
  var mac = "";

	for (var i = 0; i < 6; i++) {
		mac += Math.floor(Math.random() * 16).toString(16).toUpperCase();
    mac += Math.floor(Math.random() * 16).toString(16).toUpperCase();
    if (i != 5) mac += ":";
	} 
  return mac;
}

var nrPortConfigs = [24, 48, 72];


var generatePort = function(id) {
  var port = {};
  port["firmware"] = "bc 5.2.2 NCSI 2.0.6";
  port["interface"] = "eth" + (id);
  port["link"] = "yes"
  port["mac"] = generateMAC();
  port["name"]= "Cisco";
  return port;
};

var generatePorts = function() {
  var ports = [];
  var nrPorts = nrPortConfigs[
    Math.floor (Math.random() * 
      nrPortConfigs.length) % 
      nrPortConfigs.length
  ];

  for (var i = 0; i < nrPorts; i++) {
    ports.push(generatePort(i));
  }
  return ports;
};

var generateAttributes = function() {
  var attrib = {};
  attrib["name"] = "Cisco";
  return attrib;
}

var generateComponents = function() {
  var components = {};
  components["nics"] = generatePorts();
  return components;

};


var generateSwitch = function() {
  var nSwitch = {};
  nSwitch["attributes"] = generateAttributes();
  nSwitch["components"] = generateComponents();
  nSwitch["attributes"]["portTotal"]= nSwitch["components"]["nics"].length;
  return nSwitch;
};


var requiredNrSwitches = process.argv[2];
var date;
var switchName = "";
for (var i = 0; i <requiredNrSwitches; i++) {
  date = new Date();
  switchName += "switch-";
  switchName += date.getFullYear() + "-";
  switchName += date.getMonth() + "-";
  switchName += date.getDate() + ".";
  switchName += date.getTime() + ".json";
  console.log(switchName);
  fs.writeFileSync("./out/switches/"+switchName, JSON.stringify(generateSwitch()));
  switchName = "";
}


