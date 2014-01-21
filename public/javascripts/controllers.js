app.controller('d3Controller', function($scope, NetworkDataService) {
  $rootScope.chartData = [21,1,5];
  $scope.nodeData = [100, 200];
});

app.controller('dataCtrl', function($scope, NetworkDataService){
  NetworkDataService.getAllFlattened()
  .then(function(data) {
    $scope.ctldata = data;
//    $scope.selNode = "ABC";
    $scope.nodes = data.nodes;
    $scope.links = data.links;
    $scope.selectedNode = data.nodes[0];
  }, function errorFunction(reason) {
    $scope.error = reason;
  });
});


app.controller('AccordionDemoCtrl', function($scope) {
  $scope.oneAtATime = false;

  $scope.isPrimitive = function(value) {
    if (Array.isArray(value)) return false;
    if (typeof value === 'object') return false;
    return true;
  };
});