app.controller('dataCtrl', function($scope, $http){
  $http({
    method: 'GET',
    url: '/all-flattened'
  }).success(function(data) {
    $scope.nodes = data.nodes;
    $scope.links = data.links;
  });
});