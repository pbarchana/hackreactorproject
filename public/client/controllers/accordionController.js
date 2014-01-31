// **********************************************************************
// Controller for search and side panel
// **********************************************************************

var angular = require('angular');

module.exports = angular.module('app')
.controller('accordionController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.oneAtATime = false;

  $scope.isPrimitive = function(value, key) {
    if (Array.isArray(value)) return false;
    if (typeof value === 'object') return false;
    if (key) {
      if (key[0] === '_') return false; // ignore hidden variables
    }
    return true;
  };

}]);

