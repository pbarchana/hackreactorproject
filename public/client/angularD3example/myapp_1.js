var app = angular.module('myApp', [])


app.directive('node', function () {
    return {
      restrict: 'EA',
      require: 'ngModel',
      scope: {
        'ngModel' : "=",
        'onclick' : "&",

      },
      link: function (scope, elem, attrs) {
        //d3.json("./file.json", function(error, json) {
          // var nodeData = {
          //   nodes: [
          //     {name: "Blue", x: "90", r: "25"}
          //   ]
          // };

          console.log("Scope", scope.ngModel.nodes[0]);
          var svg = d3.selectAll(elem)
                      .append('svg')
                      .attr('width', 400)
                      .attr('height', 400)
                      .append('g'); 

          var circle = svg.selectAll("circle")
                          .data(scope.ngModel.nodes)
                          .enter()
                          .append("circle")
                          .attr("cx", function(d, i) {
                              return d.x;
                          })
                        .on("click", function(d) {
                          if (d.test === undefined) {
                            console.log("need to get d.test");
                          }
                        })
                        .attr("cy", 100)
                        .attr("r", function(d) {
                          return d.r;
                        });

          var test = d3.selectAll("circle")
          console.log(test.datum()["name"]);
      }
    }
});






angular.module('myApp') .controller('MainController', function($scope) {
  $scope.chartData = [21,1,5];
  //$scope.nodeData = [100, 200];
  $scope.nodeData = {
    nodes: [
              {name: "Blue", x: "90", r: "25"}
          ]
  }

  $scope.testclick = function() {
    console.log('Clicked');
  }
});
