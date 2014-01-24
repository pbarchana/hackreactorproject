angular.module('app')
.controller('accordionController', function($scope, $rootScope) {
  $scope.oneAtATime = false;

  $scope.isPrimitive = function(value, key) {
    if (Array.isArray(value)) return false;
    if (typeof value === 'object') return false;
    if (key[0] === '_') return false; // ignore hidden variables
    return true;
  };

});

