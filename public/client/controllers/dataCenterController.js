// **********************************************************************
// Controller for geo location of datacenters
// **********************************************************************


var angular = require('angular');

module.exports = angular.module('app')

.controller('dataCenterController', ['$scope', '$location', 'data', function($scope, $location, data){
  $scope.loading = true;

  $scope.ctldata     = data.dataCenters;
  $scope.connections = data.connections;

  $scope.select = function(node) {
    $scope.selectedNode = node;
    $scope.liveSearch = '';
  };

  $scope.zoomIn = function(nodeId) {
    $location.path('/?id=' + nodeId);
    // window.location = '/?id=' + id;
  };

}]);
