app.directive('networkGraph', ['d3Service', function(d3Service) {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '='
    },
    link: function(scope, element, attrs) {
      d3Service.d3().then(function(d3) {
        //View window width and height
        var viewWidth = window.innerWidth; //set to a percentage for dynamic resizing
        var viewHeight = window.innerHeight;
        var linkDirectory = {};
        var links;
        var nodes;

        var force = d3.layout.force()
            .charge(-2000)
            .linkStrength(0.2)
            // .gravity(0.1)
            .linkDistance(200)
            .size([viewWidth, viewHeight]);

        //Create view window SVG
        // elemnt[0] selects containing element
        var svg =  d3.select(document.body)
                      .append('svg')
                      .attr('width', viewWidth)
                      .attr('height', viewHeight)
                      .attr("pointer-events", "all")
                      .append('g')
                       .call(d3.behavior.zoom().on("zoom", redraw))
                      .append('g');

        //display simulating text before loading graph
        var loading = svg.append("text")
            .attr("x", viewWidth / 2)
            .attr("y", viewHeight / 2)
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text("Simulating. One moment please…");

        // var data = scope.nwdata;

        //adds stringified link to directory
        var addLink = function(a, b){
          linkDirectory["'" + a + "," + b + "'"] = 1;
          linkDirectory["'" + b + "," + a + "'"] = 1;
        };

        var neighbors = function(node){

        };

        var showDetails = function(node){

          // if(links){
          //   links.attr('stroke-opacity', 0.8);
          // }

          if (links) {
            links.style("stroke", function(l) {
              if (l.source === node || l.target === node) {
                console.log('if ----- yes ', l);
                return "black";
              } else {
                return "#ddd";
              }
            }).style("stroke-opacity", function(l) {
              if (l.source === node || l.target === node) {
                return 1.0;
              } else {
                return 0.5;
              }
            }).style('z-index', '9999');
          }
        };

        function redraw() {
          svg.attr('transform', 'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')');
        }

        //function to map MAC address of nic to containing host
        var mapMac = function(nodes) {
          var nodesMap = d3.map();
          nodes.forEach(function(n){
            var node = n;
            var nics = n.components.nics;
            nics.forEach(function(n){
              nodesMap.set(n.mac, node);
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
          .nodes(scope.nwdata.nodes)
          .links(scope.nwdata.links);
          // .start();

        force.start();
        for(var i = scope.nwdata.nodes * scope.nwdata.nodes; i > 0; --i){
          force.tick();
        }
        // use a timeout to allow the rest of the page to load first
        setTimeout(function(){
          force.stop();


          links = svg.append('g').selectAll(".link")
                .data(force.links())
                .enter().append("line")
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; })
                .attr("class", "link");


          nodes = svg.append('g').selectAll(".node")
                .data(force.nodes())
                .enter().append("circle")
                .attr("class", "node")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", 15)
                .attr("fill", function(d, i){
                  if (d.type === 'server') {
                    return "red";
                  } else {
                    return "blue";
                  }
                })
                .on('mouseover', showDetails);
                // .call(force.drag);

          // var tick = 0;

          // force.on("tick", function() {
          //     tick++;
          //     console.log(tick);
          //     links.attr("x1", function(d) { return d.source.x; })
          //         .attr("y1", function(d) { return d.source.y; })
          //         .attr("x2", function(d) { return d.target.x; })
          //         .attr("y2", function(d) { return d.target.y; });

          //     nodes.attr("cx", function(d) { return d.x; })
          //         .attr("cy", function(d) { return d.y; });
          // });

          loading.remove();
        }, 1000);

        // Browser onresize event
        window.onresize = function() {
          scope.$apply();
        };

        // Watch for resize event
        // scope.$watch(function() {
        //   return angular.element($window)[0].innerWidth;
        // }, function() {
        //   scope.render(scope.nwdata);
        // });

      // zoom function
      // function redraw(){
      //   console.log("translate: ", d3.event.translate, "scale:", d3.event.scale);
      //   svg.selectAll('nodes').selectAll('link').attr("transform",
      //         "translate(" + d3.event.translate + ")" +
      //         " scale(" + d3.event.scale + ")");
      // }

      console.log(linkDirectory);
      });
    }
  };
}]);

