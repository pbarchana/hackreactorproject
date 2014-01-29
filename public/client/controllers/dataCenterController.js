var angular = require('angular');

module.exports = angular.module('app')
.controller('dataCenterController', function($scope, $location, data){
  $scope.loading = true;

  $scope.ctldata = data.dataCenters;
  $scope.connections = data.connections;

  $scope.select = function(node) {
    $scope.selectedNode = node;
    $scope.liveSearch = '';
  };
});