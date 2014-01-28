var angular = require('angular');

 module.exports = angular.module('app')
.controller('zoomInController', function($scope, $location, NetworkDataService){
	//alert("Inside zoomInController");
	$scope.loading = true;

  NetworkDataService.getAllZoomed()
  .then(function(data) {
    $scope.ctldata = data;
  
  }, function errorFunction(reason) {
    $scope.error = reason;
  });

  $scope.formatUUID = function(UUID) {
    return UUID.split('-')[0];
  };

  $scope.select = function(node) {
    $scope.selectedNode = node;
    $scope.liveSearch = "";
  };
});
