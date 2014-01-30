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
    }

module.exports.nodeActions = function(scope, force, pie, arc, svg){
      var point = {}, prevArc, currentSelectedArc;
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
            .classed('link', true)
       }
      })
      .append("title").text(function(d, i) { return "MAC: " + d.data.mac; })
      .style("fill", function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
      node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
    };
    
module.exports.drawLinks = function(scope, svg){

   var link = svg.selectAll(".link")
        .data(scope.nwdata.links)
        .enter().append("line")
        .classed('link', true)
        .style("stroke-width", "1px")
        .style("stroke", "black")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  return link;
};











