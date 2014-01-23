app.controller('AccordionCtrl', function($scope) {
  $scope.oneAtATime = false;

  $scope.isPrimitive = function(value) {
    if (Array.isArray(value)) return false;
    if (typeof value === 'object') return false;
    return true;
  };

});

