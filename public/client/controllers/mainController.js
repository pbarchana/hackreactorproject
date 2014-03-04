// **********************************************************************
// Controller for the network main view
// **********************************************************************

var angular = require('angular');

var app = angular.module('app');
app.controller('mainController', ['$scope', '$location', 'NetworkDataService', 'data', function($scope, $location, NetworkDataService, data){
  
  $scope.changeToZoomInView = false;

  NetworkDataService.setData(data);
  $scope.ctldata = JSON.parse(JSON.stringify(data));
  
  $scope.formatUUID = function(UUID) {
    if (!UUID) return '';
    return UUID.split('-')[0];
  };

  // Custom filter
  // Searches all links for ones containing the selected id
  // Choose the ones that are not the selected id
  $scope.select = function(node) {
    $scope.loading = true;
    if (node.type === 'server') {
      NetworkDataService.get('/server/' + node._id)
      .then(function(data) {
        $scope.selectedNode = data;
        $scope.liveSearch = "";
        $scope.loading = false;
      }, function errorFunction(reason) {
        $scope.error = reason;
      });
    }
    if (node.type === 'switch') {
      NetworkDataService.get('/switch/' + node._id)
      .then(function(data) {
        $scope.selectedNode = data;
        $scope.liveSearch = "";
        $scope.loading = false;
      }, function errorFunction(reason) {
        $scope.error = reason;
      });
    }
  };

  $scope.$watch('changeToZoomInView', function(newValue, oldValue) {
    if (newValue === true) {
      $scope.changeToZoomInView = false;
      $location.path('/zoomIn');
    }
  });
}]);
