var angular = require('angular');

 module.exports = angular.module('app')
.controller('zoomInController', function($scope, $location, data){

	$scope.loading = true;
  $scope.ctldata = JSON.parse(JSON.stringify(data));
 
  $scope.formatUUID = function(UUID) {
    return UUID.split('-')[0];
  };

  $scope.select = function(node) {
    $scope.selectedNode = node;
    $scope.liveSearch = "";
  };
});
