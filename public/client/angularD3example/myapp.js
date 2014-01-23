var app = angular.module('myApp', [])


app.directive('node', function () {
    return {
      restrict: 'EA',
      require: 'ngModel',
      scope: {
        'ngModel' : "="
      },
      link: function (scope, elem, attrs) {
        d3.json("./file.json", function(error, json) {

          var svg = d3.selectAll(elem)
                      .append('svg')
                      .attr('width', 400)
                      .attr('height', 400)
                      .append('g'); 

          var circle = svg.selectAll("circle")
                          .data(json.nodes)
                          .enter()
                          .append("circle")
                          .attr("cx", function(d, i) {
                              return d.x;
                          })
                        .attr("cy", 100)
                        .attr("r", function(d) {
                          return d.r;
                        });
        });
      }
    }
});






angular.module('myApp') .controller('MainController', function($scope) {
  $scope.chartData = [21,1,5];
  $scope.nodeData = [100, 200];
});