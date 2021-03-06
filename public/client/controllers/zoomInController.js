// **********************************************************************
// Controller for zoomed in network view
// **********************************************************************

var angular = require('angular');

 module.exports = angular.module('app')
.controller('zoomInController', ['$scope', '$location', 'data', function($scope, $location, data){
	//alert("Inside zoomInController");
	$scope.loading = true;
  $scope.ctldata  = JSON.parse(JSON.stringify(data));

  $scope.formatUUID = function(UUID) {
    return UUID.split('-')[0];
  };

  $scope.select = function(node) {
    $scope.selectedNode = node;
    $scope.liveSearch = "";
  };
}]);
