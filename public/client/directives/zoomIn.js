var angular = require('angular');
var helpers = require('./helpers.js');
var zoomhelpers = require('./zoomHelpers.js');
var d3 = require('d3');


var app = angular.module('app');
var bootstrapd3 = function(scope, element, attrs) {
  setTimeout(function(){
	function redraw() {
	  svg.attr('transform', 'translate(' +
	    d3.event.translate + ')' +
	  ' scale(' + d3.event.scale + ')');
	}
	 var svgWidth = element[0].offsetWidth;
   var svgHeight = element[0].offsetHeight;
   console.log("In zoom in directive");
  }, 300);

};

module.exports = app.directive('zoomIn', [function() {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '=',
      loading: '='
    },
    link: function(scope, element, attrs) {
      setTimeout(function() {
        bootstrapd3(scope, element, attrs);
      }, 1000);
    }
  };
}]);