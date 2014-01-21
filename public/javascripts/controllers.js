app.controller('d3Controller', function($scope, NetworkDataService) {
  $rootScope.chartData = [21,1,5];
  $scope.nodeData = [100, 200];
});

app.controller('dataCtrl', function($scope, NetworkDataService){
  console.log("Inside dataCtrl");
  NetworkDataService.getAllFlattened()
  .then(function(data) {
    $scope.ctldata = data;
    $scope.nodes = data.nodes;
    $scope.links = data.links;
    // $scope.selectedNode = data.nodes[0];
  }, function errorFunction(reason) {
    $scope.error = reason;
  });

  $scope.select = function(node) {
    debugger;
    $scope.selectedNode = node;
    $scope.liveSearch = "";
  };
});


app.controller('AccordionCtrl', function($scope) {
  $scope.oneAtATime = false;

  $scope.isPrimitive = function(value) {
    if (Array.isArray(value)) return false;
    if (typeof value === 'object') return false;
    return true;
  };
});