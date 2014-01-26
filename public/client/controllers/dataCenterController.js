var angular = require('angular');

module.exports = angular.module('app')
.controller('dataCenterController', function($scope, $location, NetworkDataService){
  $scope.loading = true;

  NetworkDataService.getAllDataCenters()
  .then(function(data) {
    // $scope.selectedNode = data.dataCenters[0];
    $scope.ctldata = data.dataCenters;
    $scope.connections = data.connections;
  }, function errorFunction(reason) {
    $scope.error = reason;
  });

  $scope.select = function(node) {
    $scope.selectedNode = node;
    $scope.liveSearch = '';
  };
});