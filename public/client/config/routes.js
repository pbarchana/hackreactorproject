var angular = require('angular');
var mainController = require('../controllers/mainController').mainController;
debugger;

module.exports = angular.module('app')
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		controller: 'mainController',
		templateUrl: 'client/views/main.html',
		resolve: mainController.resolve
	})
	.when('/dataCenter', {
		controller: 'dataCenterController',
		templateUrl: 'client/views/dataCenter.html'
  })
	.when('/zoomIn', {
		controller: 'zoomInController',
		templateUrl: 'client/views/zoomIn.html'
	});
}]);