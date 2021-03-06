// Helpers for Network Zoomed In View

var d3 = require('d3');

//function to map MAC address to each arc on the pie chart
// required for drawing the links in d3 force layout
module.exports.macToArcMapping = function(arc) {
  var arcMap = d3.map();
  var allNodes = d3.selectAll(".node");
  var node;
  allNodes[0].forEach(function(n){

    node = d3.select(n);
    // the center of the pie chart and the centroid of the arc
    // together provide the location for the beggining of links
    var centerX = d3.select(n)[0][0].__data__.x;
    var centerY = d3.select(n)[0][0].__data__.y;
    
    for (var i = 0; i < n.childNodes.length; i++) {
      var segment = d3.select(n.childNodes[i]);
      var seg = segment[0][0].__data__;
      var centroidX = arc.centroid(seg)[0];
      var centroidY = arc.centroid(seg)[1];
      arcMap.set(d3.select(n.childNodes[i]).datum().data.mac,
                 {element: d3.select(n.childNodes[i]).datum(),
                  x: centroidX + centerX,
                  y: centroidY + centerY
                });
    }
  });
  return arcMap;
};

// each switch and server is visualized as a pie chart
module.exports.definePie = function(){
  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return 1; });
    return pie;
};

// each mac is visualized as an arc on the pie chart
module.exports.defineArc = function(radius){
  var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(2/3 * radius);
    return arc;
};

// create the SVG element
module.exports.createSvg = function(view, width, height){
  var svg =  d3.select(view)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr("pointer-events", "all")
      .append('g');
      return svg;
};


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
  // d3.select('body').selectAll('.d3-tip').remove();
  d3.select('body').selectAll('.arc-select').classed('arc-select', false);
  d3.select('body').selectAll('.link').classed('link-select', false);

  var linkSource = d3.selectAll('path').filter(function(d,i){
    return (link.source.element.data.mac === d.data.mac) ? d : null; });

  var linkTarget = d3.selectAll('path').filter(function(d,i){
    return (link.target.element.data.mac === d.data.mac) ? d : null; });

  // Unused tooltip function, formating not complete to implement uncomment
  // lines 78, 103 and 104
  var toolTip = function(link){
    d3.select('body')
      .append('div')
      .classed('d3-tip', true)
      .html('Interface: ' + link.element.data.interface)
      .style('top', (parseInt(link.x) + 13) + 'px')
      .style('left', (parseInt(link.y) + 13) + 'px');
  };

  var tarVend = linkTarget.each(function(d){ return d; });
  var tarX = linkTarget.attr('cx');
  var tarY = linkTarget.attr('cy');
  //toolTip(link.target);
  //toolTip(link.source);

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

// drawing the force layout
module.exports.createForceLayout =function(width, height){
  var force = d3.layout.force()
        .charge(-2000)
        .linkStrength(0.1)
        .linkDistance(70)
        .gravity(0.3)
        .size([width, height]);
  return force;
};

// determines all the links originating from the  node
// and highlights them
var showNodeInfo = function(node, that){
  showNode = that;
  for (var i = 0; i < that.childNodes.length; i++) {
    d3.select(that.childNodes[i]).datum().hiliteLink = 'true';
  }
  d3.selectAll(".link").transition()
    .style("stroke", function(l) {
      if (l.source.element.hiliteLink === 'true' ||
          l.target.element.hiliteLink === 'true') {
            return "black";
      }
      else { return "#999"; }
    })
    .style("stroke-opacity", function(l) {
      if (l.source.element.hiliteLink === 'true' ||
          l.target.element.hiliteLink === 'true') {
            return 1.0;
      }
      else { return 0.1; }
  });
};

//Called on node click, removes previous selected nodes
//'nodeSelected' attribute from all nodes
//then adds appropriate 'node-select' css class to clicked node
var highlightSelectedNode = function(svg, node, that){
  var selected = d3.select(that).attr('nodeSelected');
  if(selected === 'false'){
    d3.select(that).style('stroke', '#bada55');
  }
  d3.selectAll('.node')
  .attr('nodeSelected', false)
  .classed('node-select', false)
  .classed('node-hover', false);

  d3.select(that)
  .attr('nodeSelected', true)
  .classed('node-select', true)
  .classed('node-hover', true);
};

//remove the highlight from the node when the mouse moves over
var removeHighlightfromNode = function(node){
  d3.select(node)
    .attr('nodeSelected', false)
    .classed('node-hover', false)
    .classed('node-select', false);

  var selected = d3.select(node).attr('nodeSelected');
  if(selected === 'false'){
    d3.select(node).style('stroke', '#fff');
  }

};

// removes all the highlights from the links and reverts back to 
// the original state for the node highlighted in showNodeInfo
var hideNodeInfo = function() {
  var that = showNode;
  removeHighlightfromNode(showNode);
  for (var i = 0; i < that.childNodes.length; i++) {
    d3.select(that.childNodes[i]).datum().hiliteLink = 'false';
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

// Draw force layout nodes and apply events like
// mouseenter and mouseleave on them
module.exports.nodeActions = function(scope, force, pie, arc, svg){
  var point = {}, prevArc, currentSelectedArc;
  var showNode;
  var node = svg.selectAll(".node")
    .data(scope.nwdata.nodes)
    .enter().append("g")
    .classed('node', true)
    .on('mouseenter', function(d) {
      var that = this;
      showNodeInfo(d, that);
      highlightSelectedNode(svg, d, that);

      scope.$apply(function () {
        scope.$parent.select(d);
      });
    })
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
      prevArc = currentSelectedArc;
      currentSelectedArc  = d;

    if (currentSelectedArc !== undefined && prevArc !== undefined && prevArc !== currentSelectedArc) {
      var testLink = {};
      testLink.source = prevArc;
      testLink.source.x = point.x;
      testLink.source.y = point.y;
      testLink.target = currentSelectedArc;
      testLink.target.x = centerX + centroidX;
      testLink.target.y = centerY + centroidY;
      point = testLink.target;

      force.links().push(testLink);
      svg.append('g').selectAll(".link")
      .data([testLink])
      .enter().insert("line", ".node")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      .classed('link', true);
    }
  })
  .append("title").text(function(d, i) { return "MAC: " + d.data.mac; })
  .style("fill", function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
  node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
};

// draw links for the force layout
module.exports.drawLinks = function(scope, svg){
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
    .attr("y2", function(d) { return d.target.y; });
    return link;
};