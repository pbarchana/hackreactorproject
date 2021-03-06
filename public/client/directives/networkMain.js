// **********************************************************************
// Directive for network main view
// **********************************************************************


var angular = require('angular');
var helpers = require('./mainHelpers.js');
var d3 = require('d3');

var app = angular.module('app');
var bootstrapd3 = function(scope, element, attrs) {

  var redraw = function() {
    svg.attr('transform', 'translate(' +
      d3.event.translate + ')' +
    ' scale(' + d3.event.scale + ')');
  };

  //View window width and height
  var viewWidth = element[0].offsetWidth;
  var viewHeight = element[0].offsetHeight;
  var linkDirectory = {};
  var selected_link = null;
  var link;
  var node;

  d3.select('link')
    .on('keydown', helpers.keydown);

  var force = d3.layout.force()
    .charge(-2500)
    .linkStrength(0.2)
    .linkDistance(200)
    .size([viewWidth, viewHeight])
    .gravity(2.0)
    .size([viewWidth - 300, viewHeight]);

  //Create view window SVG
  var svg =  d3.select(element[0])
    .append('svg')
    .attr('width', viewWidth)
    .attr('height', viewHeight)
    .attr("pointer-events", "all")
    .append('g')
    .call(d3.behavior.zoom().on("zoom", redraw))
    .append('g');


  //map mac addresses to nodes
  var map = helpers.mapMac(scope.nwdata.nodes);

  //set link source and target to node instead of mac address
  scope.nwdata.links.forEach(function(l){
    helpers.addLink(l.source, l.target, linkDirectory);
  
    l.source = map.get(l.source.element);
    l.target = map.get(l.target.element);
  });

  // This function is an attempt to set a fixed position on all
  // switch nodes ... not yet working. It should take the node array
  // and return an array with only the switch nodes value 'fixed'
  // set to true. It will be passed into the force.nodes method below
  var allNodes = function(){
    var nodes = scope.nwdata.nodes;
    var result = [];
    var switches = [];
    nodes.forEach(function(n){
      result.push(n);
    });
    return result;
  };

  // Start the force physics
  force
    .links(scope.nwdata.links)
    .nodes(scope.nwdata.nodes)
    .start();

  for(var i = scope.nwdata.nodes + scope.nwdata.nodes; i > 0; --i) {
    force.tick();
  }
  // use a timeout to allow the rest of the page to load first
  setTimeout(function(){
    force.stop();

    // Draw network connections
    link = svg.append('g').selectAll(".link")
    helpers.drawLinks(link, force);

    // Draw servers and switches
    node = svg.append('g').selectAll(".node");
    helpers.drawNodes(node, link, force, scope);

    scope.$apply(function() {
      scope.loading = false;
    });

  }, 500);

  // Browser onresize event
  window.onresize = function() {
    scope.$apply();
  };

};

app.directive('networkGraph', [function() {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '=',
      loading: '='
    },
    link: bootstrapd3
  };
}]);
