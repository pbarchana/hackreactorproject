var angular = require('angular');
var d3 = require('d3');

module.exports = angular.module('app')
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		controller: 'mainController',
		templateUrl: 'client/views/main.html',
    resolve: {
      data: function(NetworkDataService) {
        NetworkDataService.clearDOMElements();
        if (NetworkDataService.getData() !== undefined) {
          return NetworkDataService.getData();
        }
        else {
          return NetworkDataService.get('/all-zoomed');
        }
      }
    }
	})
	.when('/data-center', {
		controller: 'dataCenterController',
		templateUrl: 'client/views/dataCenter.html',
		resolve: {
      data: function(NetworkDataService) {
        return NetworkDataService.get('/data-center');
      }
    }
  })
	.when('/zoomIn', {
		controller: 'zoomInController',
		templateUrl: 'client/views/zoomIn.html',
		resolve: {
      data: function(NetworkDataService) {
        NetworkDataService.clearDOMElements();
        if (NetworkDataService.getData() !== undefined) {
          return NetworkDataService.getData();
        }
        else {
          return NetworkDataService.get('/all-zoomed');
        }
      }
    }
	});
}]);
