app.directive('networkGraph', ['d3Service', function(d3Service) {
  return {
    restrict: 'EA',
    scope: {
      data: '='
    },
    link: function(scope, element, attrs) {
      d3Service.d3().then(function(d3) {
        //View window width and height
        var viewWidth = 1200; //set to a percentage for dynamic resizing
        var viewHeight = 800;

        var force = d3.layout.force()
            .charge(-1500)
            .linkDistance(300)
            .size([viewWidth, viewHeight]);

        //Create view window SVG
        // elemnt[0] selects containing element
        var svg =  d3.select(document.body)
                      .append('svg')
                      .attr('width', viewWidth)
                      .attr('height', viewHeight);
                      // .call(d3.behavior.zoom().on("zoom", redraw));

        var data = scope.data;

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
        var map = mapMac(data.nodes);

        //set link source and target to node instead of mac address
        data.links.forEach(function(l){
          l.source = map.get(l.source);
          l.target = map.get(l.target);
        });

        // Start the force physics
        force
          .nodes(data.nodes)
          .links(data.links)
          .start();

        var links = svg.append('g').selectAll(".link")
              .data(force.links())
              .enter().append("line")
              .attr("class", "link");


        var nodes = svg.append('g').selectAll(".node")
              .data(force.nodes())
              .enter().append("circle")
              .attr("class", "node")
              .attr("r", 15)
              .attr("fill", "blue")
              .call(force.drag);


        force.on("tick", function() {
            links.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            nodes.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });

        // Browser onresize event
        window.onresize = function() {
          scope.$apply();
        };

        // Watch for resize event
        // scope.$watch(function() {
        //   return angular.element($window)[0].innerWidth;
        // }, function() {
        //   scope.render(scope.data);
        // });

      });
    }
  };
}]);

