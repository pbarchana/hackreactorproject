var bootstrapd3 = function(scope,  element, attrs, d3Service) {
  setTimeout(function(){
    var d3serve = d3Service.d3().then(function(d3) {

 function redraw() {
          svg.attr('transform', 'translate(' +
            d3.event.translate + ')' +
          ' scale(' + d3.event.scale + ')');
        }


      console.log("Inside directive");
      //View window width and height
      var viewWidth = window.innerWidth;
      var viewHeight = window.innerHeight;
      var linkDirectory = {};
      var selected_link = null;
      var link;
      var node;

      d3.select('link')
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


      //map mac addresses to nodes
      var map = mapMac(scope.nwdata.nodes);

      //set link source and target to node instead of mac address
      scope.nwdata.links.forEach(function(l){
        addLink(l.source, l.target, linkDirectory);
        l.source = map.get(l.source);
        l.target = map.get(l.target);
      });

      // This function is an attempt to set a fixed position on all
      // switch nodes ... not yet working. It should take the node array
      // and return an array with only the switch nodes value 'fixed'
      // set to true. It will be passed into the force.nodes method below
      var allNodes = function(){
        console.log(scope.nwdata.nodes);
        var nodes = scope.nwdata.nodes;
        var result = [];
        var switches = [];
        // nodes.forEach(function(node, i){
        //   if(node.type === 'switch'){
        //     switches.push(node);
        //   }
        // });

        // switches.forEach(function(s, i){
        //   console.log(s, i);
        //   node.fixed = true;
        //   node.cx = viewWidth / 2;
        //   node.cy = (viewHeight / nodes.length) * i;
        //   console.log('PYPYPY ',node.cy);
        //   result.push(s);
        // });

        nodes.forEach(function(n){
          result.push(n);
        });
        console.log('result ------ ', result);
        return result;
      };

      // Start the force physics
      force
        .links(scope.nwdata.links)
        .nodes(scope.nwdata.nodes)
        .start();

      for(var i = scope.nwdata.nodes + scope.nwdata.nodes; i > 0; --i) {
        force.tick();
      }
      // use a timeout to allow the rest of the page to load first
      setTimeout(function(){
        force.stop();

        link = svg.append('g').selectAll(".link")
        drawLinks(link, force);

        node = svg.append('g').selectAll(".node");
        drawNodes(node, link, force, scope);

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

