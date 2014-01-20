app.directive('networkGraph', ['d3Service', function(d3Service) {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '='
    },
    link: function(scope, element, attrs) {
      d3Service.d3().then(function(d3) {
        //View window width and height
        var viewWidth = 1200; //set to a percentage for dynamic resizing
        var viewHeight = 800;

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
                      .attr('height', viewHeight);
                      // .call(d3.behavior.zoom().on("zoom", redraw));

        //display simulating text before loading graph
        var loading = svg.append("text")
            .attr("x", viewWidth / 2)
            .attr("y", viewHeight / 2)
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text("Simulating. One moment please…");

        // var data = scope.nwdata;

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


          var links = svg.append('g').selectAll(".link")
                .data(force.links())
                .enter().append("line")
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; })
                .attr("class", "link");


          var nodes = svg.append('g').selectAll(".node")
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
                .call(force.drag);

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

      });
    }
  };
}]);

