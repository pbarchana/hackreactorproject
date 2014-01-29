var angular = require('angular');
//var helpers = require('./helpers.js');
var zoomHelpers = require('./zoomHelpers.js');
var d3 = require('d3');

var app = angular.module('app');

var bootstrapd3 = function(scope,  element, attrs) {
  setTimeout(function(){

    function redraw() {
      svg.attr('transform', 'translate(' + d3.event.translate + ')'
        + ' scale(' + d3.event.scale + ')');
    }

    //View window width and height
    var viewWidth = element[0].offsetWidth;
    var viewHeight = element[0].offsetHeight;
    var linkDirectory = {};
    var selected_link = null;
    var link;
    var node;

    var radius = 45;
    var color = d3.scale.category20c();

    var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return 1; });

    var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(2/3 * radius);

    // d3.select('link')
    //   .on('keydown', keydown);

    var force = d3.layout.force()
      .charge(-2000)
      .linkStrength(0.1)
      .linkDistance(70)
      .gravity(0.3)
      .size([viewWidth, viewHeight]);

    //Create view window SVG
    var svg =  d3.select(element[0])
      .append('svg')
      .attr('width', viewWidth)
      .attr('height', viewHeight)
      .attr("pointer-events", "all")
      .append('g')
      .call(d3.behavior.zoom().on("zoom", redraw))
      .append('g');

    var selectedArc;
    var selectedArc1;

    force
    .links(scope.nwdata.links)
    .nodes(scope.nwdata.nodes)
    .start();

    for(var i = scope.nwdata.nodes * scope.nwdata.nodes; i > 0; --i) {
       force.tick();
    }

    setTimeout(function(){
      force.stop()

      var point = {};
      var point1 = {};
      var node = svg.selectAll(".node")
        .data(scope.nwdata.nodes)
        .enter().append("g")
        .classed('node', true);

      node.selectAll("path")
        .data(function(d) {return pie(d.components.nics); })
        .enter().append("svg:path")
        .attr("d", arc)
        .classed('node', true)
        .on('click', function(d){
          var centerX = d3.select(this.parentNode).node().transform.animVal.getItem(0).matrix.e;
          var centerY = d3.select(this.parentNode).node().transform.animVal.getItem(0).matrix.f;
          var centroidX = arc.centroid(d)[0];
          var centroidY = arc.centroid(d)[1];

          console.log("Centroid X", centroidX);
          console.log("Centroid X", centroidY);
          console.log("Center X", centerX);
          console.log("Center Y", centerY);

          point1.x = point.x;
          point1.y = point.y;

          point.x = centerX + centroidX;
          point.y = centerY + centroidY;

          selectedArc1 = selectedArc;
          selectedArc  = d;

          if (selectedArc !== undefined && selectedArc1 !== undefined && selectedArc1 !== selectedArc) {
            console.log("Here");
            var testLink = {};
            var testLinkArray = [];
            testLink.source = selectedArc1
            testLink.target = selectedArc;
            testLink.source.x = point1.x;
            testLink.source.y = point1.y;

            testLink.target.x = point.x;
            testLink.target.y = point.y;

            console.log("Testlink", testLink);

            testLinkArray.push(testLink);
            force.links().push(testLink);
            console.log(testLinkArray);

            svg.append('g').selectAll(".link")
            .data(testLinkArray)
            .enter().insert("line", ".node")
            .attr("x1", function(d) { console.log("D", d); return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .classed('link', true)
          }

      })
      .style("fill", function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

      node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

      var addLink = function(a, b){
          linkDirectory[a + "," + b] = 1;
          linkDirectory[b + "," + a] = 1;
        };

      var macToArcMapping = function(nodes) {
          var arcMap = d3.map();
          var allNodes = d3.selectAll(".node");
          var node;
          allNodes[0].forEach(function(n){
            node = d3.select(n);

            var centerX = d3.select(n)[0][0].__data__.x;
            var centerY = d3.select(n)[0][0].__data__.y;
            var centroidX;
            var centroidY;
            var ptX;
            var ptY;

            for (var i = 0; i < n.childNodes.length; i++) {
              var segment = d3.select(n.childNodes[i]);
              var seg = segment[0][0].__data__;
              centroidX = arc.centroid(seg)[0];
              centroidY = arc.centroid(seg)[1];

              ptX = centroidX + centerX;
              ptY = centroidY + centerY;

              arcMap.set(d3.select(n.childNodes[i]).datum().data.mac,
                         {arc: d3.select(n.childNodes[i]).datum(),
                          x: ptX,
                          y: ptY
                        });
            }
          });
          return arcMap;
      };
      var map = macToArcMapping();
      var tempNode;

      for (var k = 0;  k < scope.nwdata.links.length; k++) {
        var l = scope.nwdata.links[k];
        console.log("l = ",l.source);
        tempNode = l.source.arc;
        console.log(" map = ",map," temp = ", tempNode);
        l.source["arc"] = map.get(tempNode).arc;
        l.source.x   = map.get(tempNode).x;
        l.source.y   = map.get(tempNode).y;
        tempNode = l.target.arc;

        l.target["arc"] = map.get(tempNode).arc;
        l.target.x   = map.get(tempNode).x;
        l.target.y   = map.get(tempNode).y;
      }
      console.log("s", scope.nwdata.links[0]);
      var link = svg.selectAll(".link")
        .data(scope.nwdata.links)
        .enter().append("line")
        .classed('link', true)
        .on('mouseover', showLinkDetails)
        .on('mouseout', hideLinkDetails)
        .on('click', selectLink)
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
  }, 500);
};

app.directive('zoomIn', [function() {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '=',
      loading: '='
    },
    link: function(scope, element, attrs) {
      setTimeout(function() {
        bootstrapd3(scope, element, attrs);
      }, 1000);
      // bootstrapd3(scope, element, attrs, d3Service);
    }
  };
}]);

//Called on edge hover
var showLinkDetails = function(link){
  d3.select(this)
    .classed('link-hover', true);
};

//Called on edge mouse out
var hideLinkDetails = function(link){
  d3.select(this)
    .classed('link-hover', false);
};

//Called on edge click
var selectLink = function(link, i, selected_link){
  d3.select('body').selectAll('.d3-tip').remove();
  d3.select('body').selectAll('.node-link-select').classed('node-link-select', false);
  d3.select('body').selectAll('.link').classed('link-select', false);

  console.log('link link link source ', link.source);
  console.log('link link link target ', link.target);

  var linkTarget = d3.selectAll('.node').selectAll('path').filter(function(d,i){
    if(i < 2){ console.log( d ); }
    return d === link.target ? d : null; });

  // var tarVend = linkTarget.each(function(d){ return d; });
  // var tarX = linkTarget.attr('cx');
  // var tarY = linkTarget.attr('cy');
  // console.log('linkTarget x ------ ', linkTarget.attributes);

  var linkSource = d3.selectAll('.node').filter(function(d,i){
    return d === link.source ? d : null; });

  // d3.select('body')
  //   .append('div')
  //   // .html('Vendor: ' + linkTarget.attributes.vendor)
  //   .classed('d3-tip', true)
  //   .style('top', (parseInt(tarY) + 13) + 'px')
  //   .style('left', (parseInt(tarX) + 13) + 'px');

  // toolTip(linkTarget);
  // toolTip(linkSource);

  linkTarget
    .classed('arc-select', true);

  linkSource
    .classed('arc-select', true);

  if (selected_link !== null) {
    d3.select('.linkSelected')
    .classed('linkSelected', false);
  }
  else if(selected_link === link){
    selected_link = null;
    return;
  } else {
    selected_link = link;
  }

  d3.select(this)
  .classed('link-select', true);
};