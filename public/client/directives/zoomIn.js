var zoomHelpers = require('./zoomHelpers.js');
var angular = require('angular');
var d3 = require('d3');

var app = angular.module('app');



var bootstrapd3 = function(scope,  element, attrs) {

  var redraw = function () {
    svg.attr('transform', 'translate(' +
      d3.event.translate + ')' +
    ' scale(' + d3.event.scale + ')');
  }

    var viewWidth = element[0].offsetWidth;
    var viewHeight = element[0].offsetHeight;

    var radius = 45;
    var color = d3.scale.category20c();

    var pie = zoomHelpers.definePie();
    var arc = zoomHelpers.defineArc(radius);
    var svg = zoomHelpers.createSvg(element[0], viewWidth, viewHeight);
    var force = zoomHelpers.createForceLayout(viewWidth-200, viewHeight-200);

    svg.call(d3.behavior.zoom().on("zoom", redraw));

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
        tempNode = l.source.element;
        l.source["element"] = map.get(tempNode).element;
        l.source.x   = map.get(tempNode).x;
        l.source.y   = map.get(tempNode).y;

        tempNode = l.target.element;
        l.target["element"] = map.get(tempNode).element;
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