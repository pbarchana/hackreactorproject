var angular = require('angular');

var app = angular.module('app');
app.controller('mainController', ['$scope', '$location', 'NetworkDataService', 'data', function($scope, $location, NetworkDataService, data){
  
  $scope.loading = true;
  $scope.changeToZoomInView = false;
  $scope.ctldata = data;
  console.log(data);
  $scope.nodes = data.nodes;
  $scope.links = data.links;

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
}]);
