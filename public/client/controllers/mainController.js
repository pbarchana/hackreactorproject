var angular = require('angular');

var app = angular.module('app');
module.exports.mainController = app.controller('mainController', function($scope, $location, NetworkDataService, data){
  $scope.loading = true;
  $scope.changeToZoomInView = false;
  debugger;
  // NetworkDataService.getAllFlattened()
  // .then(function(data) {
    $scope.ctldata = data;
    console.log(data);
    $scope.nodes = data.nodes;
    $scope.links = data.links;
  // }, function errorFunction(reason) {
  //   $scope.error = reason;
  // });

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
});

module.exports.mainController.resolve = {
  data: function(NetworkDataService) {
    return NetworkDataService.getAllFlattened();
  }
};
