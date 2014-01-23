angular.module('app')
.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		controller: 'mainController',
		templateUrl: 'javascripts/views/main.html'
	})
	.when('/zoomedIn', {
		controller: 'zoomInController',
		templateUrl: 'javascripts/views/zoomIn.html'
	})
})