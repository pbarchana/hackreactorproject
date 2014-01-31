// Directive for Geo View

var angular = require('angular');

// ============== Functions ====================

var dataCenterMap = (function() {

  var scope, map, selectedMarker, data;

  // --------------- Helpers -------------------
  var makeMap = function(element) {
    return new google.maps.Map(element, {
      zoom: 8,
      center: new google.maps.LatLng(37.76487, -122.41948),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });
  };

  var makeCircle = function(fillColor) {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillOpacity: 1,
      fillColor: fillColor,
      strokeColor: 'black',
      strokeWeight: 1.5
    };
  };

  var makeMarker = function(node) {
    return new google.maps.Marker({
      position: new google.maps.LatLng(node.latitude, node.longitude),
      map: map,
      icon: makeCircle('grey'),
    });
  };

  var selectOnClick = function(marker, node) {
    google.maps.event.addListener(marker, 'click', function(data) {
      if (selectedMarker) selectedMarker.setIcon(makeCircle('grey'));
      selectedMarker = marker;
      marker.setIcon(makeCircle('#BADA55'));
      scope.$apply(function() {
        scope.selectedNode = node;
      });
    });
  };

  var zoomOnDoubleClick = function(marker) {
    google.maps.event.addListener(marker, 'dblclick', function() {
      window.location = '/?id=' + node._id;
    });
  };

  // var drawConnections = function(connections) {
  //   connections.forEach(function(connection) {
  //     var coordinates = [
  //       new google.maps.LatLng(connection[0][0], connection[0][1]),
  //       new google.maps.LatLng(connection[1][0], connection[1][1])
  //     ];
  //     var line = new google.maps.Polyline({
  //       path: coordinates,
  //       map: map,
  //       geodesic: true,
  //       strokeColor: '#7555DA',
  //       strokeOpacity: 0.6,
  //       strokeWeight: 2
  //     });
  //   });
  // };

  // --------------- Initialize -------------------
  // generate map
  var init = function(initScope, element, attrs) {
    scope = initScope;
    map = makeMap(element[0]);
    selectedMarker = null;
    data = scope.nwdata;

    // Make each marker from the data
    data.forEach(function(node, i) {
      var marker = makeMarker(node);
      marker.setTitle(node.name);
      
      // Select data center marker when clicked
      selectOnClick(marker, node);

      // Zoom in to next view when double clicked
      zoomOnDoubleClick(marker);
    });

    scope.loading = false;
  };

  // --------------- Exposed Methods -------------------
  return {
    init: init
  };
}());


// ============== Directive ====================

var app = angular.module('app');
app.directive('map', [function() {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '=',
      selectedNode: '=',
      loading: '=',
      connections: '='
    },
    link: dataCenterMap.init
  };
}]);
