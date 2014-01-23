var bootstrapd3 = function(scope, element, attrs, d3Service) {
  setTimeout(function(){
    var d3serve = d3Service.d3().then(function(d3) {
      console.log("Inside directive");
      //View window width and height
      var viewWidth = window.innerWidth; //set to a percentage for dynamic resizing
      var viewHeight = window.innerHeight;
      var linkDirectory = {};
      var link;
      var node;

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
        .style('stroke', 'black')
        .style('stroke-width', '6px');
      };

      var showDetails = function(node){
        console.log(d3.select(this).attr('nodeSelected'));

        if(!d3.select(this).attr('nodeSelected')){
          d3.select(this).style('stroke', 'grey');
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
        if(!d3.select(this).attr('nodeSelected')){
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
          .enter().append("line")
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; })
          .attr("class", "link");
        node = svg.append('g').selectAll(".node");
        node.data(force.nodes())
          .enter().append("circle")
          .attr("class", "node")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", 15)
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
                  .enter().insert("line", ".node")
                  .attr("x1", function(d) { return d.source.x; })
                  .attr("y1", function(d) { return d.source.y; })
                  .attr("x2", function(d) { return d.target.x; })
                  .attr("y2", function(d) { return d.target.y; })
                  .attr("class", "link");

                showDetails(d);
              }
            });
          })
          .attr("fill", function(d, i){
            if (d.type === 'server') {
              return "#ca8142";
            } else {
            return "#428bca";
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

