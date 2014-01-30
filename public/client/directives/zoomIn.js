var zoomHelpers = require('./zoomHelpers.js');
var angular = require('angular');
var d3 = require('d3');

var app = angular.module('app');

var bootstrapd3 = function(scope,  element, attrs) {

    var viewWidth = element[0].offsetWidth;
    var viewHeight = element[0].offsetHeight;

    var radius = 45;
    var color = d3.scale.category20c();

    var pie = zoomHelpers.definePie();
    var arc = zoomHelpers.defineArc(radius);
    var svg = zoomHelpers.createSvg(element[0], viewWidth, viewHeight);
    var force = zoomHelpers.createForceLayout(viewWidth-200, viewHeight-200);    

    force
    .links(scope.nwdata.links)
    .nodes(scope.nwdata.nodes)
    .start();

    for(var i = scope.nwdata.nodes * scope.nwdata.nodes; i > 0; --i) {
       force.tick();
    }

    setTimeout(function(){
      force.stop()

     zoomHelpers.nodeActions(scope, force, pie, arc, svg);
      
      var map = zoomHelpers.macToArcMapping(arc);

      for (var k = 0;  k < scope.nwdata.links.length; k++) {
        var l = scope.nwdata.links[k];
        var tempNode = l.source.arc;
        l.source["arc"] = map.get(tempNode).arc;
        l.source.x   = map.get(tempNode).x;
        l.source.y   = map.get(tempNode).y;
        tempNode = l.target.arc;

        l.target["arc"] = map.get(tempNode).arc;
        l.target.x   = map.get(tempNode).x;
        l.target.y   = map.get(tempNode).y;
      }

     var link = zoomHelpers.drawLinks(scope, svg);

      scope.$apply(function() {
        scope.loading = false;
      });
    }, 500);
    window.onresize = function() {
        scope.$apply();
      };

};

app.directive('zoomIn', [function() {
  return {
    restrict: 'EA',
    scope: {
      nwdata: '=',
      loading: '='
    },
     link: bootstrapd3
  };
}]);