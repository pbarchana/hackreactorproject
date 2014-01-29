var d3 = require('d3');

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

  var linkTarget = d3.selectAll('.node').filter(function(d,i){
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

  toolTip(linkTarget);
  toolTip(linkSource);

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