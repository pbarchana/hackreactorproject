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
                         {arc: d3.select(n.childNodes[i]).datum(),
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
