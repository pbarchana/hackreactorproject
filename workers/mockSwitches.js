var fs = require('fs');

var generateMAC = function() {
  var mac = "";

	for (var i = 0; i < 6; i++) {
		mac += Math.floor(Math.random() * 16).toString(16).toUpperCase();
    mac += Math.floor(Math.random() * 16).toString(16).toUpperCase();
    if (i != 5) mac += ":";
	} 
  return mac;
};

var nrPortConfigs = [24, 48, 72];


var generatePort = function(id) {
  var port = {};
  port["firmware"] = "bc 5.2.2 NCSI 2.0.6";
  port["interface"] = "eth" + (id);
  port["link"] = "yes";
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
  var s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  };
  var uuid = function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };

  var attrib = {};
  attrib["vendor"] = "Cisco";
  attrib["UUID"] = uuid();
  return attrib;
};

var generateComponents = function() {
  var components = {};
  components["nics"] = generatePorts();
  return components;

};


var generateSwitch = function() {
  var nSwitch = {};
  nSwitch["type"] = "switch";
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
  fs.writeFileSync("../mockData/switches/"+switchName, JSON.stringify(generateSwitch()));
  switchName = "";
}


