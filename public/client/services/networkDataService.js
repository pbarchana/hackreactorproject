var angular = require('angular');

var app = angular.module('app');

module.exports = app.factory('NetworkDataService', ['$q', '$http', function($q, $http) {
  var networkData;

  var service = {

    setData: function(data) {
      networkData = data;
    },

    getData: function() {
      return networkData;
    },

    clearDOMElements:  function() {
      require('d3').selectAll(".node").remove();
      require('d3').selectAll(".link").remove();
    },

    get: function(url) {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: url
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    }
    
  };

  return service;
}]);


