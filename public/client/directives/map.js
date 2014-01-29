var angular = require('angular');

var createMap = function (scope, elem, attrs) {
  // generate map
  var mapOptions, map;
  mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(37.76487, -122.41948),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  map = new google.maps.Map(elem[0], mapOptions);

  // generate map overlay
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
      // debugger;
      // scope.zoomIn(node._id);
      window.location = '/?id=' + node._id;
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
      fillColor: 'grey',
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
  scope.loading = false;
 
};

var app = angular.module('app');
module.exports = app.directive('map', [function() {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '=',
      selectedNode: '=',
      loading: '=',
      connections: '='
    },
    link: createMap
  };
}]);
