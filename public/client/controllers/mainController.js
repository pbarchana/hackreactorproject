angular.module('app')
.controller('mainController', function($scope, $location, NetworkDataService){
  $scope.loading = true;

  NetworkDataService.getAllFlattened()
  .then(function(data) {
    debugger;
    $scope.ctldata = data;
    console.log(data);
    $scope.nodes = data.nodes;
    $scope.links = data.links;
  }, function errorFunction(reason) {
    $scope.error = reason;
  });

  $scope.select = function(node) {
    $scope.selectedNode = node;
    $scope.liveSearch = "";
  };
});
