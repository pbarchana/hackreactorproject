var angular = require('angular');

module.exports = angular.module('app')
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		controller: 'mainController',
		templateUrl: 'client/views/main.html',
		resolve: {
      data: function(NetworkDataService) {
        return NetworkDataService.getAllZoomed();
      }
    }
	})
	.when('/data-center', {
		controller: 'dataCenterController',
		templateUrl: 'client/views/dataCenter.html',
		resolve: {
      data: function(NetworkDataService) {
        return NetworkDataService.getAllDataCenters();
      }
    }
  })
	.when('/zoomIn', {
		controller: 'zoomInController',
		templateUrl: 'client/views/zoomIn.html',
		resolve: {
      data: function(NetworkDataService) {
        return NetworkDataService.getAllZoomed();
      }
    }
	});
}]);
