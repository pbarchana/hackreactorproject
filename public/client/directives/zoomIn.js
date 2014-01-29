var zoomHelpers = require('./zoomHelpers.js');
var angular = require('angular');
//var helpers = require('./helpers.js');

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

  

  var force = d3.layout.force()
    .charge(-2000)
    .linkStrength(0.1)
    .linkDistance(70)
    .gravity(0.3)
    .size([viewWidth - 200, viewHeight - 200]);

  //Create view window SVG
  

  var selectedArc;
  var selectedArc1;

  console.log(scope.nwdata.links);
  debugger;

  force
  .links(scope.nwdata.links)
  .nodes(scope.nwdata.nodes)
  .start();

  for(var i = scope.nwdata.nodes * scope.nwdata.nodes; i > 0; --i) {
     force.tick();
  }

  var showNode;

  var showNodeInfo = function(node, that){
    console.log("Node", node);
    //debugger;
    var selected = d3.select(that).attr('nodeSelected');

    if(selected === 'false'){
      d3.select(that).style('stroke', '#bada55');
    }

    showNode = that;
    for (var i = 0; i < that.childNodes.length; i++) {
      d3.select(that.childNodes[i]).datum().hiliteLink = 'true'
    }
    d3.selectAll(".link").transition()
      .style("stroke", function(l) {
        if (l.source.element.hiliteLink === 'true' ||
            l.target.element.hiliteLink === 'true') {
              return "black";
        }
        else {
          return "#999";
        }
      })
      .style("stroke-opacity", function(l) {
        if (l.source.element.hiliteLink === 'true' ||
            l.target.element.hiliteLink === 'true') {
              return 1.0;
        }
        else {
          return 0.1;
        }
    });
  };

  var hideNodeInfo = function() {
    var that = showNode;
    for (var i = 0; i < that.childNodes.length; i++) {
      d3.select(that.childNodes[i]).datum().hiliteLink = 'false'
    }
    d3.selectAll(".link").transition()
      .style("stroke", function(l) {
        if (l.source.element.hiliteLink === 'true' ||
            l.target.element.hiliteLink === 'true') {
              return "#999";
        }
      })
      .style("stroke-opacity", function(l) {
        if (l.source.element.hiliteLink === 'true' ||
            l.target.element.hiliteLink === 'true') {
              return 0.1;
        }
    });

    showNode = "";
  };



  setTimeout(function(){
    force.stop();

    var point = {};
    var point1 = {};
    var node = svg.selectAll(".node")
      .data(scope.nwdata.nodes)
      .enter().append("g")
      .classed('node', true)
      .on('mouseenter', function(d) {
        var that = this;
        showNodeInfo(d, that)})
      .on('mouseleave', hideNodeInfo);

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

    var addLink = function(a, b){
        linkDirectory[a + "," + b] = 1;
        linkDirectory[b + "," + a] = 1;
      };

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