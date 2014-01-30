var d3 = require('d3');

module.exports.macToArcMapping = function(arc) {
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
                         {element: d3.select(n.childNodes[i]).datum(),
                          x: ptX,
                          y: ptY
                        });
            }
          });
          return arcMap;
      };

module.exports.definePie = function(){
  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return 1; });
    return pie;
}

module.exports.defineArc = function(radius){
  var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(2/3 * radius);
    return arc;
}

module.exports.createSvg = function(view, width, height){
  var svg =  d3.select(view)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr("pointer-events", "all")
      .append('g')
      .call(d3.behavior.zoom().on("zoom", module.exports.redraw))
      .append('g');
      return svg;
}

module.exports.redraw = function(view) {
  view.attr('transform', 'translate(' + d3.event.translate + ')'
    + ' scale(' + d3.event.scale + ')');
};

//Called on edge hover
module.exports.showLinkDetails = function(link){
  d3.select(this)
    .classed('link-hover', true);
};

//Called on edge mouse out
module.exports.hideLinkDetails = function(link){
  d3.select(this)
    .classed('link-hover', false);
};

//Called on edge click
module.exports.selectLink = function(link, i, selected_link){
  d3.select('body').selectAll('.d3-tip').remove();
  d3.select('body').selectAll('.arc-select').classed('arc-select', false);
  d3.select('body').selectAll('.link').classed('link-select', false);

  console.log('link link link source ', link.source);
  console.log('link link link target ', link.target);
  console.log('selected_link ------ ', selected_link)

  // console.log('lt lt lt lt ', lt)

  var linkSource = d3.selectAll('path').filter(function(d,i){
    return (link.source.element.data.mac === d.data.mac) ? d : null; });


  // var tarVend = linkTarget.each(function(d){ return d; });
  // var tarX = linkTarget.attr('cx');
  // var tarY = linkTarget.attr('cy');
  // console.log('linkTarget x ------ ', linkTarget.attributes);

  var linkTarget = d3.selectAll('path').filter(function(d,i){
    return (link.target.element.data.mac === d.data.mac) ? d : null; });

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

module.exports.createForceLayout =function(width, height){
  var force = d3.layout.force()
        .charge(-2000)
        .linkStrength(0.1)
        .linkDistance(70)
        .gravity(0.3)
        .size([width, height]);
  return force;
}

module.exports.redraw = function() {
      svg.attr('transform', 'translate(' + d3.event.translate + ')'
        + ' scale(' + d3.event.scale + ')');
    };

module.exports.showNodeInfo = function(node, that){
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


module.exports.hideNodeInfo = function() {
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
    }
