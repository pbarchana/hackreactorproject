
// Due to D3's inability to interpolate 'classed' values on transition()
// the .style() method must be used and each value set individually after
// using transition() :(


module.exports.drawLinks = function(link, force){
  link.data(force.links())
  .enter().append("path")
  .attr('d', function(d){
    var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy),
      rdr = -(dr);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  })
  .attr('pointer-events', 'stroke')
  .attr('fill', 'none')
  .attr("class", "link")
  .on('click', selectLink)
  .on('mouseover', showLinkDetails)
  .on('mouseout', hideLinkDetails);
};

module.exports.drawNodes = function(node, link, force, scope){
  node.data(force.nodes())
    .enter().append("circle")
    .attr("class", "node")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 15)
    .attr('nodeSelected', 'false')
    .on('click.selectNode', selectNode)
    .on("click", function(d){
      scope.$apply(function () {
        scope.$parent.selectedNode1 = scope.$parent.selectedNode;
        scope.$parent.selectedNode = d;
        scope.$parent.$parent.selectedNode  = d;
        if (scope.$parent.selectedNode !== undefined &&
          scope.$parent.selectedNode1 !== undefined &&
          scope.$parent.selectedNode1 !== scope.$parent.selectedNode) {
          console.log("node", scope.$parent.selectedNode);
          console.log("node1", scope.$parent.selectedNode1);

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
                   dr = Math.sqrt(dx * dx + dy * dy),
                   rdr = -(dr);
               return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
            })
            .attr('fill', 'none')
            .attr("class", "link");
          showNodeDetails(d);
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
    .on('mouseover', showNodeDetails)
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

 //find all nodes connected to selected node  -- NOT USED
var neighbors = function(target, source, linkDirectory){
  return linkDirectory[target + "," + source] ||
    linkDirectory[source + "," + target];
};

//Called on edge hover
var showLinkDetails = function(link){
  console.log('d target ', link.target);

  d3.select(this)
    .style('stroke-opacity', 1)
    .style('stroke', 'black');
};

//Called on edge mouse out
var hideLinkDetails = function(link){
  d3.select(this)
    .style('stroke-opacity', 0.3)
    .style('stroke', '#999');
};

var selectNode = function(node, i){
  d3.selectAll('.node')
  .attr('nodeSelected', false)
  .style('stroke', 'white')
  .style('stroke-width', '3px');

  d3.select(this)
  .attr('nodeSelected', true)
  .transition()
  .style('stroke', '#bada55')
  .style('stroke-width', '5px');
};

var selectLink = function(link, i, selected_link){
  if (selected_link !== null) {
    d3.select(".linkSelected")
    .transition()
    .style("stroke", "#999")
    .style("stroke-width", '2px')
    .style("stroke-opacity", 0.3)
    .style("stroke-dasharray", "none");
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
  .classed('linkSelected', true)
  .transition()
  .style('stroke', 'black')
  .style("stroke-dasharray", ("3, 3"))
  .style('stroke-width', '6px');
};

module.exports.keydown = function (d, selected_link) {
  d3.event.preventDefault();
  console.log("Inside keydown");
  // ctrl
  if(d3.event.keyCode === 17) {
  circle.call(force.drag);
  svg.classed('ctrl', true);
  }

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

var showNodeDetails = function(node){
  var selected = d3.select(this).attr('nodeSelected');

  if(selected === 'false'){
    d3.select(this).style('stroke', '#bada55');
  }

  d3.selectAll(".link").transition()
    .style("stroke", function(l) {
      if (l.source === node || l.target === node) {
        return "black";
      } else {
        return "#999";
      }
    })
    .style("stroke-opacity", function(l) {
      if (l.source === node || l.target === node) {
        return 1.0;
      } else {
        return 0.1;
      }
  });
};

var hideNodeDetails = function(node){
  var selected = d3.select(this).attr('nodeSelected');
  if(selected === 'false'){
    d3.select(this)
    .transition()
    .style('stroke', 'white');
  }
  d3.selectAll(".link").transition()
  .style("stroke", "#999")
  .style("stroke-opacity", '0.3');
};


//function to map MAC address of nic to containing host
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
