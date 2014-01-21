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

  $scope.groups = [
    {
      title: "Dynamic Group Header - 1",
      content: "Dynamic Group Body - 1"
    },
    {
      title: "Dynamic Group Header - 2",
      content: "Dynamic Group Body - 2"
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };
});