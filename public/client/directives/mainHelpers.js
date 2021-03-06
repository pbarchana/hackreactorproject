// Helpers for Network Main View

var d3 = require('d3');

// Unused tooltip function, formating not complete.
// to implement, uncomment lines 40, 50 and 51
var toolTip = function(node){
  d3.select('body')
    .append('div')
    .classed('d3-tip', true)
    .style('top', (parseInt(node.x) + 13) + 'px')
    .style('left', (parseInt(node.y) + 13) + 'px');
};

//Called on edge hover, adds 'link-hover' css class
var showLinkDetails = function(link){
  d3.select(this)
    .classed('link-hover', true);
};

//Called on edge mouse out, removes 'link-hover' css class
var hideLinkDetails = function(link){
  d3.select(this)
    .classed('link-hover', false);
};

//Called on node click, first removes 'nodeSelected' attribute from all nodes
//then adds appropriate 'node-select' css class to clicked node
var selectNode = function(node, i){
  d3.selectAll('.node')
  .attr('nodeSelected', false)
  .classed('node-select', false)
  .classed('node-hover', false);

  d3.select(this)
  .attr('nodeSelected', true)
  .classed('node-select', true);
};

//Called on edge click, resets all links and sends selected node info to sidebar
var selectLink = function(link, i, selected_link){
  // d3.select('body').selectAll('.d3-tip').remove(); // Removes tooltip from previous link click
  d3.select('body').selectAll('.node-link-select').classed('node-link-select', false);
  d3.select('body').selectAll('.link').classed('link-select', false);

  var linkTarget = d3.selectAll('.node').filter(function(d,i){
    return d === link.target ? d : null; });

  var linkSource = d3.selectAll('.node').filter(function(d,i){
    return d === link.source ? d : null; });

  // toolTip(linkTarget);
  // toolTip(linkSource);

  linkTarget
    .classed('node-link-select', true);

  linkSource
    .classed('node-link-select', true);

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

// Called on node hover
var showNodeDetails = function(node, that){
  var selected = d3.select(that).attr('nodeSelected');

  // If hovering over a non-selected node change the css styling
  // otherwise leave the selected node styling intact
  if(selected === 'false'){
    d3.select(that).classed('node-hover', true);
  }

  // Highlights all connected links and lightens any other links
  d3.selectAll(".link")
    .classed('link-hover', function(l){
      return (l.source === node || l.target === node) ? true : false;
    })
    .classed('link-lighter', function(l){
      return (l.source === node || l.target === node) ? false : true;
    });
};

// Called on node 'mouseout' event, resets css styling to original
var hideNodeDetails = function(node){
  var selected = d3.select(this).attr('nodeSelected');
  if(selected === 'false'){
    d3.select(this).classed('node-hover', false);
  }
  d3.selectAll(".link")
  .classed('link-lighter', false)
  .classed('link-hover', false);
};

// Initial function to draw the links on the SVG canvas
module.exports.drawLinks = function(link, force){
  link.data(force.links())
  .enter().append("path")
  .attr('d', function(d){
    var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  })
  .classed('link', true)
  .on('click', selectLink)
  .on('mouseover', showLinkDetails)
  .on('mouseout', hideLinkDetails);
};

// Initial function to draw the node on the SVG canvas
module.exports.drawNodes = function(node, link, force, scope){
  node.data(force.nodes())
    .enter().append("circle")
    .classed('node', true)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 15)
    .attr('nodeSelected', 'false')
    .on('dblclick', function(d) {
      scope.$apply(function() {
        scope.$parent.changeToZoomInView = true;
      });
    })
    .on('click.selectNode', selectNode)
    .on("click", function(d){
      var that = this;
      scope.$apply(function () {

        scope.$parent.selectedNode1 = scope.$parent.selectedNode;
        scope.$parent.select(d);
        if (scope.$parent.selectedNode !== undefined &&
          scope.$parent.selectedNode1 !== undefined &&
          scope.$parent.selectedNode1 !== scope.$parent.selectedNode) {

          var testLink = {};
          var testLinkArray = [];
          testLink.source = scope.$parent.selectedNode1;
          testLink.target = scope.$parent.selectedNode;
          testLinkArray.push(testLink);
          force.links().push(testLink);

          link
            .data(testLinkArray)
            .enter().insert("path", ".node")
            .attr('d', function(d){
              var dx = d.target.x - d.source.x,
                   dy = d.target.y - d.source.y,
                   dr = Math.sqrt(dx * dx + dy * dy);
               return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
            })
            .classed("link", true);
          showNodeDetails(d, that);
        }
      });
    })
    .attr("fill", function(d, i){
      if (d.type === 'server') {
        return "#444";
      } else {
      return "#888";
      }
    })
    .on('mouseover',  function(d) {
      var that = this;
      showNodeDetails(d, that);
    })
    .on('mouseout', hideNodeDetails)
    .append("title").text(function(d, i) {
      var retString =
        "Vendor: " + d.attributes.vendor + "\n" +
        "Platform: " + d.attributes.platform + "\n" +
        "UUID: " + (d.attributes.UUID.slice(0, 4)) + " ... " + (d.attributes.UUID.slice(-4));
      return retString;
    });
};

//adds stringified link to directory
module.exports.addLink = function(a, b, linkDirectory){
  linkDirectory[a + "," + b] = 1;
  linkDirectory[b + "," + a] = 1;
};

// deletes the selected link when delete or 
// backspace key is pressed
module.exports.keydown = function (d, selected_link) {
  d3.event.preventDefault();

  if(!selected_link) return;
  switch(d3.event.keyCode) {
    case 8: // backspace
    case 46: // delete
      if(selected_link) {
        var n = force.links().indexOf(selected_link);
        if(n >= 0) {
          force.links().splice(n, 1);
          d3.select(".linkSelected").remove();
        }
      }
      selected_link = null;
      break;
  }
};

//function to map MAC address of nic to containing host
// required for drawing the links in d3 force layout
module.exports.mapMac = function(nodes) {
  var tempNode;
  var nics;
  var nodesMap = d3.map();
  nodes.forEach(function(n){
    tempNode = n;
    nics = n.components.nics;
    nics.forEach(function(n){
      nodesMap.set(n.mac, tempNode);
    });
  });
  return nodesMap;
};
