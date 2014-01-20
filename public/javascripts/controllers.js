app.controller('d3Controller', function($scope, NetworkDataService) {
  $rootScope.chartData = [21,1,5];
  $scope.nodeData = [100, 200];
});

app.controller('dataCtrl', function($scope, NetworkDataService){
  NetworkDataService.getAllFlattened()
  .then(function(data) {
    $scope.nodes = data.nodes;
    $scope.links = data.links;
  }, function errorFunction(reason) {
    $scope.error = reason;
  });
});