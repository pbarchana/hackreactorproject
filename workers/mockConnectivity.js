var fs   = require('fs');
var path = require('path');
var glob = require('glob');


var readServerMACs = function() {
  var serverJSON = "";
  var servers = [];
  var serverNICs = [];
  var serverMACs = {};

  serverJSON = glob.sync(path.join('../mockData/servers', '*.json'));
  for (var i = 0; i < serverJSON.length; i++) {
    servers.push(JSON.parse(fs.readFileSync(serverJSON[i], {encoding: 'utf8'})));
  }

  for (i = 0; i < servers.length; i++) {
    serverNICs = servers[i].components.nics;
    for (var j = 0; j < serverNICs.length; j++) {
      serverMACs[serverNICs[j].mac] = servers[i];
    }
  }
 
  var nrServerMACs = Object.keys(serverMACs).length;
  return serverMACs;
};


var readSwitchPorts = function() {
  var switchJSON = "";
  var switchObj = {};
  var nicArray = [];
  var switches = [];

  switchJSON = glob.sync(path.join('../mockData/switches', '*.json'));
  
  for (var i = 0; i < switchJSON.length; i++) {
    var switchMAC = [];
    switchObj = JSON.parse(fs.readFileSync(switchJSON[i], {encoding: 'utf8'}));
    nicArray = switchObj["components"]["nics"];
    for (var j = 0; j < nicArray.length; j++){
      switchMAC.push(nicArray[j].mac);
    }
    switchMAC = switchObj["components"]["nics"].slice(0);
    switches.push({switchInfo: switchObj, macs: switchMAC});
  }

  return switches;
};



var connectSwitches = function(switches, switchConn) {

  for (var i = 0; i < switches.length-1; i++) {
    //
    switchConn[i].push({switchPort: switches[i].macs[0],
                        serverMAC: switches[i+1].macs[0].mac
                      });
    switchConn[i+1].push({switchPort: switches[i+1].macs[0],
                        serverMAC: switches[i].macs[0].mac
                      });

    switches[i].macs.splice(0,1);
    switches[i+1].macs.splice(0,1);
  }
};


var generateConnectivity = function() {


  var switchConn = []; //Keeps track of Switch MAC <-> Server/Switch MAC
  var switchMACs = []; //Keeps track of the MAC address for easy hashing


  var serverMACs = readServerMACs();
  var switches   = readSwitchPorts();


  var nrSwitches = switches.length;
  var switchBin = 0;

  for (var i = 0; i < nrSwitches; i++) {
    switchConn[i] = [];
    switchMACs[i] = {};

    temp = switches[i].macs;

    for (var j = 0; j < temp.length; j++) {
      switchMACs[i][temp[j].mac] = 1;
    }
  }

  //Connect Switches to each other
  connectSwitches(switches, switchConn);

  
  // Connect Server Nodes to Switches
  for (var mac in serverMACs) {
    // Generate a random number to see which switch port this 
    // MAC address is going to be assinged to.

    switchBin = Math.floor(Math.random() * nrSwitches) % (nrSwitches);
   
    var portArray = switches[switchBin].macs;
    var portIdx = 0;
    portIdx = Math.floor(Math.random() *
        portArray.length) %
        (portArray.length);

    switchConn[switchBin].push({
         switchPort: portArray.splice(portIdx, 1)[0],
         serverMAC:  mac
    });
  }

  var connectedNodes = [];


  for (var n = 0; n < switchConn.length; n++) {
    connectedNodes[n] = [];
    for (i = 0; i < switchConn[n].length; i++) {
      connectedNodes[n].push(switchConn[n][i].serverMAC);
    }
  }

 var isAddressOnSwitch = function(macAdd) {
  for (var i = 0; i < switchMACs.length; i++) {
    if (switchMACs[i][macAdd] === 1)  {
      return i;
    }
  }
    return -1;
  };

  for (var s = 0; s < switchConn.length; s++) {
    var switchInfo = {};
    var idx = 0;
    var temp = [];
    switchInfo["interfaces"] = [];

    for (i = 0; i < switchConn[s].length; i++) {
      tempNeighbors = [];
      tempObj = {};
      if ((idx = isAddressOnSwitch(switchConn[s][i].serverMAC)) > -1) {
        tempNeighbors = connectedNodes[idx].slice(0);
      }
      //console.log("mac", switchConn[s][i].serverMAC);
      tempNeighbors.push(switchConn[s][i].serverMAC);
      tempObj["interfaces"] = switchConn[s][i].switchPort.interface;
      tempObj["state"] = "active";
      tempObj["vlandID"] = "1";
      tempObj["mac"] = switchConn[s][i].switchPort.mac;
      tempObj["neighbors"] = tempNeighbors.slice(0);

      switchInfo["interfaces"].push(tempObj);
    }
    fs.writeFileSync("../mockData/connectivity/switchInfo_"+s+".conn", JSON.stringify(switchInfo));
  }

//return switchConn;

}();
