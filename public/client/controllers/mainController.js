var angular = require('angular');

var app = angular.module('app');
app.controller('mainController', function($scope, $location, data){
  $scope.loading = true;
  $scope.changeToZoomInView = false;

  $scope.ctldata = JSON.parse(JSON.stringify(data));
  console.log("Data = ", data);
  $scope.nodes = JSON.parse(JSON.stringify(data.nodes));
  $scope.links = JSON.parse(JSON.stringify(data.links));

  $scope.formatUUID = function(UUID) {
    if (!UUID) return '';
    return UUID.split('-')[0];
  };

  // Custom filter
  // Searches all links for ones containing the selected id
  // Choose the ones that are not the selected id
  $scope.select = function(node) {
    $scope.selectedNode = node;
    $scope.liveSearch = "";
  };

  $scope.$watch('changeToZoomInView', function(newValue, oldValue) {
    if (newValue === true) {
      $scope.changeToZoomInView = false;
      $location.path('/zoomIn');
    }
  });
});
