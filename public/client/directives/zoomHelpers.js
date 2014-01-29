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
          if (l.source.arc.hiliteLink === 'true' ||
              l.target.arc.hiliteLink === 'true') {
                return "black";
          }
          else {
            return "#999";
          }
        })
        .style("stroke-opacity", function(l) {
          if (l.source.arc.hiliteLink === 'true' ||
              l.target.arc.hiliteLink === 'true') {
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
          if (l.source.arc.hiliteLink === 'true' ||
              l.target.arc.hiliteLink === 'true') {
                return "#999";
          }
        })
        .style("stroke-opacity", function(l) {
          if (l.source.arc.hiliteLink === 'true' ||
              l.target.arc.hiliteLink === 'true') {
                return 0.1;
          }
      });

      showNode = "";
    }

