var bootstrapd3 = function(scope, element, attrs, d3Service) {
  setTimeout(function(){
    var d3serve = d3Service.d3().then(function(d3) {

 function redraw() {
          svg.attr('transform', 'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')');
        }


      console.log("Inside directive");
      //View window width and height
      var viewWidth = window.innerWidth; //set to a percentage for dynamic resizing
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



app.directive('networkGraph', ['d3Service', function(d3Service) {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '=',
      loading: '='
    },
    link: function(scope, element, attrs) {
      setTimeout(function() {
        bootstrapd3(scope, element, attrs, d3Service);
      }, 1000);
      // bootstrapd3(scope, element, attrs, d3Service);
    }
  };
}]);

app.directive('helloMaps', [function() {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '=',
      selectedNode: '=',
      loading: '=',
      connections: '='
    },
    link: function (scope, elem, attrs) {
      // generate map
      var mapOptions, map;
      mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(37.76487, -122.41948),
        mapTypeId: google.maps.MapTypeId.TERRAIN
      };
      map = new google.maps.Map(elem[0], mapOptions);

      // generate map overlay
      setTimeout(function() {
        debugger;

        var data = scope.nwdata;
        data.forEach(function(node, i) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(node.latitude, node.longitude),
            map: map,
            icon: getCircle(),
          });
          marker.setTitle(node.name);
          // attachSecretMessage(marker, i);
          google.maps.event.addListener(marker, 'click', function(data) {
            scope.$apply(function() {
              scope.selectedNode = node;
            });

            // var infowindow = new google.maps.InfoWindow({
            //   content: node.name,
            //   size: new google.maps.Size(50,50)
            // });
            // infowindow.open(map, marker);
          });

          google.maps.event.addListener(marker, 'dblclick', function() {
            window.location = '/?id=' + node._id;
            // alert(JSON.stringify(node._id));
          });
        });

        // scope.connections.forEach(function(connection) {
        //   var link = new google.maps.LatLng(37.772323, -122.214897);
        // });

        // // Draw lines between data centers
        // var flightPlanCoordinates = [
        //     new google.maps.LatLng(37.772323, -122.214897),
        //     new google.maps.LatLng(21.291982, -157.821856),
        //     new google.maps.LatLng(-18.142599, 178.431),
        //     new google.maps.LatLng(-27.46758, 153.027892)
        //   ];
        // var flightPath = new google.maps.Polyline({
        //   path: flightPlanCoordinates,
        //   geodesic: true,
        //   strokeColor: '#FF0000',
        //   strokeOpacity: 1.0,
        //   strokeWeight: 2
        // });

        // flightPath.setMap(map);

        function attachData(data) {
          
          var message = ["This","is","the","secret","message"];
          var infowindow = new google.maps.InfoWindow(
              { content: message[number],
                size: new google.maps.Size(50,50)
              });
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });
        }

        function getCircle() {
          var circle = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillOpacity: 1,
            fillColor: 'red',
            strokeColor: 'black',
            strokeWeight: 1.5
          };
          return circle;
        }

        var coordinates = [
          new google.maps.LatLng(37.76, -121.16),
          new google.maps.LatLng(37.05, -120.19),
        ];
        var path = new google.maps.Polyline({
          path: coordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        path.setMap(map);

        
        // overlay.setMap(map);
      }, 1000);
     
    }
  };
}]);
