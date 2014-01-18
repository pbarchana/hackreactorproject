

app.controller('d3Controller', function($scope, NetworkDataService) {
  $rootScope.chartData = [21,1,5];
  $scope.nodeData = [100, 200];
});



app.controller('dataCtrl', function($scope, NetworkDataService){
  NetworkDataService.getAll()
  .then(function(data) {
    $scope.servers = data.results.servers;
    $scope.switches = data.results.switches;
  }, function errorFunction(reason) {
    $scope.error = reason;
  })
});