var angular = require('angular');

module.exports = angular.module('app')
.controller('d3Controller', function($scope, NetworkDataService) {
  $rootScope.chartData = [21,1,5];
  $scope.nodeData = [100, 200];
});

