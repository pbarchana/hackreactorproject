var angular = require('angular');

module.exports = angular.module('app')
.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		controller: 'mainController',
		templateUrl: 'client/views/main.html'
	})
  .when('/dataCenter', {
		controller: 'dataCenterController',
		templateUrl: 'client/views/dataCenter.html'
  })
	.when('/zoomIn', {
		controller: 'zoomInController',
		templateUrl: 'client/views/zoomIn.html'
	});
});