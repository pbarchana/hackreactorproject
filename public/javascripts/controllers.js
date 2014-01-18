app.controller('dataCtrl', function($scope, $http){
  $http({
    method: 'GET',
    url: '/all-flattened'
  }).success(function(data) {
    debugger;
    $scope.nodes = data;
    // debugger;
    // $scope.servers = data.results.servers;
    // $scope.switches = data.results.switches;
  });
});