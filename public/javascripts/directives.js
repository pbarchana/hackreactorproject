var bootstrapd3 = function(scope, element, attrs, d3Service) {
  setTimeout(function(){
    var d3serve = d3Service.d3().then(function(d3) {
      console.log("Inside directive");
      //View window width and height
      var viewWidth = window.innerWidth; //set to a percentage for dynamic resizing
      var viewHeight = window.innerHeight;
      var linkDirectory = {};
      var selected_link = null; 
      var link;
      var node;

      d3.select(window)
        .on('keydown', keydown);
        
      var force = d3.layout.force()
        .charge(-2000)
        .linkStrength(0.2)
        .linkDistance(200)
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

      //adds stringified link to directory
      var addLink = function(a, b){
        linkDirectory[a + "," + b] = 1;
        linkDirectory[b + "," + a] = 1;
      };

      //find all nodes connected to selected node
      var neighbors = function(target, source){
        return linkDirectory[target + "," + source] ||
          linkDirectory[source + "," + target];
      };

      var resetSelection = function(svg){
        console.log('BOOM!');
      };

      var selectNode = function(node, i){
        svg.selectAll('.node').attr('nodeSelected', false)
        .style('stroke', 'white')
        .style('stroke-width', '3px');

        d3.select(this)
        .attr('nodeSelected', true)
        .transition()
        .style('stroke', '#bada55')
        .style('stroke-width', '5px');
      };

      var selectLink = function(link, i){
          
          if (selected_link !== null) {
            d3.select(".linkSelected")
            .transition()
            .style("stroke", "#ddd")
            .style("stroke-opacity", 0.3)
            .style("stroke-width", "2px")
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
          .attr('class', 'linkSelected')
          .transition()
          .style('stroke', 'black')
          .style("stroke-dasharray", ("3, 3"))
          .style('stroke-width', '6px');
        };

        function keydown(d) {
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
        }
      var showDetails = function(node){
        var selected = d3.select(this).attr('nodeSelected');

        if(selected === 'false'){
          d3.select(this).style('stroke', '#bada55');
        }

        d3.selectAll(".link").transition()
          .style("stroke", function(l) {
            if (l.source === node || l.target === node) {
              return "black";
            } else {
              return "#ddd";
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

      var hideDetails = function(node){
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

      function redraw() {
        svg.attr('transform', 'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')');
      }

      //function to map MAC address of nic to containing host
      var mapMac = function(nodes) {
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

      //map mac addresses to nodes
      var map = mapMac(scope.nwdata.nodes);

      //set link source and target to node instead of mac address
      scope.nwdata.links.forEach(function(l){
        addLink(l.source, l.target);
        l.source = map.get(l.source);
        l.target = map.get(l.target);
      });

      // Start the force physics

      force
        .links(scope.nwdata.links)
        .nodes(scope.nwdata.nodes)
        .start();

      for(var i = scope.nwdata.nodes * scope.nwdata.nodes; i > 0; --i) {
        force.tick();
      }
      // use a timeout to allow the rest of the page to load first
      setTimeout(function(){
        force.stop();
        link = svg.append('g').selectAll(".link");
        link.data(force.links())
          .enter().append("path")
          .attr('d', function(d){
            var dx = d.target.x - d.source.x,
                 dy = d.target.y - d.source.y,
                 dr = Math.sqrt(dx * dx + dy * dy);
             return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
          })
          .attr('fill', 'none')
          .attr("class", "link")
          .on('click', selectLink);

        node = svg.append('g').selectAll(".node");
        node.data(force.nodes())
          .enter().append("circle")
          .attr("class", "node")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", 15)
          .attr('nodeSelected', 'false')
          .on('click.selectNode', selectNode)
          .on("click", function(d) {
            scope.$apply(function () {
              scope.$parent.selectedNode1 = scope.$parent.selectedNode;
              scope.$parent.selectedNode =d ;
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
                         dr = Math.sqrt(dx * dx + dy * dy);
                     return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                  })
                  .attr('fill', 'none')
                  .attr("class", "link");

                showDetails(d);
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
          .on('mouseover', showDetails)
          .on('mouseout', hideDetails)
          .append("title").text(function(d, i) {
            var retString =
              "Vendor: " + d.attributes["vendor"] + "\n" +
              "UUID: "   + d.attributes["UUID"];
            return retString;
          });

        scope.$apply(function() {
          scope.loading = false;
        });
      }, 500);

      // Browser onresize event
      window.onresize = function() {
        scope.$apply();
      };
    });

  }, 300);

};

app.directive('networkGraph', ['d3Service', function(d3Service) {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '=',
      loading: '='
    },
    link: function(scope, element, attrs) {
      bootstrapd3(scope, element, attrs, d3Service);
    }
  };
}]);

