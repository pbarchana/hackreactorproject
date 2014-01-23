app.controller('dataCtrl', function($scope, NetworkDataService){
  $scope.loading = true;
  console.log("Inside dataCtrl");
  NetworkDataService.getAllFlattened()
  .then(function(data) {
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
