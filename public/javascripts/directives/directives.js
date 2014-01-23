var bootstrapd3 = function(scope, element, attrs, d3Service) {

  setTimeout(function(){
    var d3serve = d3Service.d3().then(function(d3) {

 function redraw() {
          svg.attr('transform', 'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')');
        };

      
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


      //map mac addresses to nodes
      var map = mapMac(scope.nwdata.nodes);

      //set link source and target to node instead of mac address
      scope.nwdata.links.forEach(function(l){
        addLink(l.source, l.target, linkDirectory);
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

// var bootstrapMap = function(scope, element, attrs, d3Service) {
//   // Create the Google Map…
//   debugger;
//   d3Service.d3().then(function(d3) {
//     debugger;
//     var map;
//     // var initialize = function() {
//       map = new google.maps.Map(d3.select(document.getElementById('map')), {
//         zoom: 8,
//         center: new google.maps.LatLng(37.76487, -122.41948),
//         mapTypeId: google.maps.MapTypeId.TERRAIN
//       });
//     // };

//     // google.maps.event.addDomListener(window, 'load', initialize);

//     // Load the station data. When the data comes back, create an overlay.
//   //   var data = scope.nwdata;
//   //   var overlay = new google.maps.OverlayView();

//   //   // Add the container when the overlay is added to the map.
//   //   overlay.onAdd = function() {
//   //     console.log('onadd');
//   //     var layer = d3.select(this.getPanes().overlayLayer).append("div")
//   //         .attr("class", "stations");

//   //     // Draw each marker as a separate SVG element.
//   //     // We could use a single SVG, but what size would it have?
//   //     overlay.draw = function() {
//   //       var projection = this.getProjection(),
//   //           padding = 10;

//   //       var marker = layer.selectAll("svg")
//   //           .data(d3.entries(data))
//   //           .each(transform) // update existing markers
//   //         .enter().append("svg:svg")
//   //           .each(transform)
//   //           .attr("class", "marker");

//   //       // Add a circle.
//   //       marker.append("svg:circle")
//   //           .attr("r", 4.5)
//   //           .attr("cx", padding)
//   //           .attr("cy", padding);

//   //       // Add a label.
//   //       marker.append("svg:text")
//   //           .attr("x", padding + 7)
//   //           .attr("y", padding)
//   //           .attr("dy", ".31em")
//   //           .text(function(d) { return d.key; });

//   //       // function transform(d) {
//   //       //   debugger;
//   //       //   d = new google.maps.LatLng(d.value[1], d.value[0]);
//   //       //   d = projection.fromLatLngToDivPixel(d);
//   //       //   return d3.select(this)
//   //       //       .style("left", (d.x - padding) + "px")
//   //       //       .style("top", (d.y - padding) + "px");
//   //       // }
//   //     };
//   //   };

//   //   // Bind our overlay to the map…
//   //   overlay.setMap(map);
//   });
// };

// app.directive('networkGraph', ['d3Service', function(d3Service) {
//   return {
//     restrict: 'EA',
//     scope: {
//       nwdata: '=',
//       loading: '='
//     },
//     link: function(scope, element, attrs) {
//       debugger;
//       setTimeout(function() {
//         bootstrapMap(scope, element, attrs, d3Service);
//       }, 1000);
//       // bootstrapd3(scope, element, attrs, d3Service);
//     }
//   };
// }]);

app.directive('helloMaps', function () {
  return function (scope, elem, attrs) {
    debugger;
    var mapOptions,
      latitude = attrs.latitude,
      longitude = attrs.longitude,
      map;

    latitude = latitude && parseFloat(latitude, 10) || 43.074688;
    longitude = longitude && parseFloat(longitude, 10) || -89.384294;

    mapOptions = {
      zoom: 8,
      center: new google.maps.LatLng(latitude, longitude)
    };

    map = new google.maps.Map(elem[0], mapOptions);
  };
});
