var angular = require('angular');

var app = angular.module('app');
module.exports = app.factory('NetworkDataService', function($q, $http) {
  var service = {
    
    getAll: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/all'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getAllFlattened: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/all-flattened'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },
   
    getAllZoomed: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/all-zoomed'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },


   // Information required for drawing the network
    getInitialDrawData: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/d3data'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getAllServers: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/server'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getAllDataCenters: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/datacenter'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },
    getAllDataCenterConnections: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/dataCenterConnections'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getAllSwitches: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/switch'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getAllConnections: function() {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/connection'
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getTheServerInfo: function(id) {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/server/' + id
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    },

    getTheSwitchInfo: function(id) {
      var d = $q.defer();
      $http({
        method: 'GET',
        url: '/switch/'+id
      }).success(function(data) {
        d.resolve(data);
      }).error(function(reason) {
        d.reject(reason);
      });
      return d.promise;
    }
  };
  return service;
});


