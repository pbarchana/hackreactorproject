var zoomHelpers = require('./zoomHelpers.js');
var angular = require('angular');

var d3 = require('d3');

var app = angular.module('app');

var bootstrapd3 = function(scope,  element, attrs) {

  //View window width and height
  var viewWidth = element[0].offsetWidth;
  var viewHeight = element[0].offsetHeight;
  var linkDirectory = {};
  var selected_link = null;
  var link;
  var node;

  var radius = 45;
  var color = d3.scale.category20c();

    var pie = zoomHelpers.definePie();
    var arc = zoomHelpers.defineArc(radius);
    var svg = zoomHelpers.createSvg(element[0], viewWidth, viewHeight);
    var force = zoomHelpers.createForceLayout(viewWidth - 200, viewHeight - 200);
    
    force
    .links(scope.nwdata.links)
    .nodes(scope.nwdata.nodes)
    .start();

  var selectedArc;
  var selectedArc1;

  for(var i = scope.nwdata.nodes * scope.nwdata.nodes; i > 0; --i) {
     force.tick();
  }

  var showNode;
    
    var map = zoomHelpers.macToArcMapping(arc);
    var tempNode;

    for (var k = 0;  k < scope.nwdata.links.length; k++) {
      var l = scope.nwdata.links[k];
      // console.log("l = ",l.source);
      tempNode = l.source.arc;
      //console.log(" map = ",map," temp = ", tempNode);
      l.source["arc"] = map.get(tempNode).arc;
      l.source.x   = map.get(tempNode).x;
      l.source.y   = map.get(tempNode).y;
      tempNode = l.target.arc;

      l.target["arc"] = map.get(tempNode).arc;
      l.target.x   = map.get(tempNode).x;
      l.target.y   = map.get(tempNode).y;
    }
    // console.log("s", scope.nwdata.links[0]);
    var link = svg.selectAll(".link")
      .data(scope.nwdata.links)
      .enter().append("line")
      .classed('link', true)
      .style("stroke-width", "1px")
      .style("stroke", "black")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })

    scope.$apply(function() {
      scope.loading = false;
    });
  }, 500);
  window.onresize = function() {
    scope.$apply();
  };
};

app.directive('zoomIn', [function() {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '=',
      loading: '='
    },

    link: bootstrapd3

  };
}]);