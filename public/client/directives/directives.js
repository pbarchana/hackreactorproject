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
        var selectedMarker;
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
            if (selectedMarker) selectedMarker.setIcon(getCircle());
            selectedMarker = marker;
            marker.setIcon(getBlueCircle());
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

        scope.connections.forEach(function(connection) {
          debugger;
          var coordinates = [
            new google.maps.LatLng(connection[0][0], connection[0][1]),
            new google.maps.LatLng(connection[1][0], connection[1][1])
          ];
          var line = new google.maps.Polyline({
            path: coordinates,
            map: map,
            geodesic: true,
            strokeColor: '#7555DA',
            strokeOpacity: 0.6,
            strokeWeight: 2
          });
        });

        function getCircle() {
          var circle = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillOpacity: 1,
            fillColor: '#7555DA',
            strokeColor: 'black',
            strokeWeight: 1.5
          };
          return circle;
        }
        function getBlueCircle() {
          var circle = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillOpacity: 1,
            fillColor: 'BADA55',
            strokeColor: 'black',
            strokeWeight: 1.5
          };
          return circle;
        }
      }, 1000);
     
    }
  };
}]);
