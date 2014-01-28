var angular = require('angular');

module.exports = angular.module('app')
.controller('mainController', function($scope, $location, NetworkDataService){
  $scope.loading = true;

  NetworkDataService.getAllFlattened()
  .then(function(data) {
    $scope.ctldata = data;
    console.log(data);
    $scope.nodes = data.nodes;
    $scope.links = data.links;
  }, function errorFunction(reason) {
    $scope.error = reason;
  });

  $scope.formatUUID = function(UUID) {
    if (!UUID) return '';
    return UUID.split('-')[0];
  };

  $scope.select = function(node) {
    $scope.selectedNode = node;
    $scope.liveSearch = "";
  };
});
