angular.module('app')
.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		controller: 'mainController',
		templateUrl: 'javascripts/views/main.html'
	})
	.when('/zoomIn', {
		controller: 'zoomInController',
		templateUrl: 'javascripts/views/zoomIn.html'
	})
})