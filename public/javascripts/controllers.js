app.controller('dataCtrl', function($scope, $http){
  $http({
    method: 'GET',
    url: '/all'
  }).success(function(data) {
    debugger;
    $scope.servers = data.results.servers;
    $scope.switches = data.results.switches;
  });
});