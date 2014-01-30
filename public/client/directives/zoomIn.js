var zoomHelpers = require('./zoomHelpers.js');
var angular = require('angular');
//var helpers = require('./helpers.js');

var d3 = require('d3');

var app = angular.module('app');


var bootstrapd3 = function(scope,  element, attrs) {

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
    var force = zoomHelpers.createForceLayout(viewWidth-200, viewHeight-200);


    var selectedArc;
    var selectedArc1;

    force
    .links(scope.nwdata.links)
    .nodes(scope.nwdata.nodes)
    .start();

    for(var i = scope.nwdata.nodes * scope.nwdata.nodes; i > 0; --i) {
       force.tick();
    }


    var showNode;
    setTimeout(function(){
      force.stop()

      var point = {};
      var point1 = {};
      var node = svg.selectAll(".node")
        .data(scope.nwdata.nodes)
        .enter().append("g")
        .classed('node', true)
        .on('mouseenter', function(d) {
          var that = this;
          zoomHelpers.showNodeInfo(d, that)})
        .on('mouseleave', zoomHelpers.hideNodeInfo);

      node.selectAll("path")
        .data(function(d) {return pie(d.components.nics); })
        .enter().append("svg:path")
        .attr("d", arc)
        .on('click', function(d){
          var centerX = d3.select(this.parentNode).node().transform.animVal.getItem(0).matrix.e;
          var centerY = d3.select(this.parentNode).node().transform.animVal.getItem(0).matrix.f;
          var centroidX = arc.centroid(d)[0];
          var centroidY = arc.centroid(d)[1];
          point1.x = point.x;
          point1.y = point.y;
          point.x = centerX + centroidX;
          point.y = centerY + centroidY;

          selectedArc1 = selectedArc;
          selectedArc  = d;

          if (selectedArc !== undefined && selectedArc1 !== undefined && selectedArc1 !== selectedArc) {

            var testLink = {};
            var testLinkArray = [];
            testLink.source = selectedArc1
            testLink.target = selectedArc;
            testLink.source.x = point1.x;
            testLink.source.y = point1.y;

            testLink.target.x = point.x;
            testLink.target.y = point.y;

            testLinkArray.push(testLink);
            force.links().push(testLink);
            svg.append('g').selectAll(".link")
            .data(testLinkArray)
            .enter().insert("line", ".node")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .classed('link', true)
       }

      })
      .append("title").text(function(d, i) {
       var retString =
        "MAC: " + d.data.mac;
        return retString;
      })
      .style("fill", function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

      node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

      var map = zoomHelpers.macToArcMapping(arc);
      var tempNode;

      for (var k = 0;  k < scope.nwdata.links.length; k++) {
        var l = scope.nwdata.links[k];

        tempNode = l.source.element;
        l.source["element"] = map.get(tempNode).element;
        l.source.x   = map.get(tempNode).x;
        l.source.y   = map.get(tempNode).y;

        tempNode = l.target.element;

        l.target["element"] = map.get(tempNode).element;
        l.target.x   = map.get(tempNode).x;
        l.target.y   = map.get(tempNode).y;
      }

      var link = svg.selectAll(".link")
        .data(scope.nwdata.links)
        .enter().append("line")
        .classed('link', true)
        .on('mouseover', zoomHelpers.showLinkDetails)
        .on('mouseout', zoomHelpers.hideLinkDetails)
        .on('click', zoomHelpers.selectLink)
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