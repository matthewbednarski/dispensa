'use strict';

function Graphic($scope, d3Svc, itemsSvc, reportingSvc) {
    this.itemsSvc = itemsSvc;
    this.svc = reportingSvc;
    this.items = itemsSvc.getItems();

    this.svc.setupPropSelects();
    this.svc.extractMonthYears();

}
var app = angular.module('dispensa');
app.controller('GraphicController', ['$scope', 'd3Svc', 'itemsSvc', 'reportingSvc', Graphic]);

app.factory('d3Svc', [

    function() {
        var _d3 = d3;
        return _d3;
    }
]);
app.directive('d3Bars', ['d3Svc', 'itemsSvc',
    function(d3, itemsSvc) {
        return {
            restrict: 'EA',
            scope: {
                items: '@',
                total: '='
            },
            link: function(scope, ele, attrs) {
                // console.log(d3);

                scope.data = scope.$eval(scope.items);
                console.log(scope.data);


                var width = 960,
                    height = 500;

                var svg = d3.select(ele[0])
                    .append("svg")
                    .attr("height", height)
                    .attr("width", width);
                var g = svg
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var color = d3.scale.category20();

                var min = Math.min(width, height);
                var oRadius = min / 2 * 0.9;
                var iRadius = min / 2 * 0.85;
                // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) {
                        return d.price;
                    });

                var arc = d3.svg.arc()
                    .outerRadius(oRadius)
                    .innerRadius(iRadius);

                var path = g.datum(scope.data)
                    .selectAll('path')
                    .data(pie)
                    .enter()
                    .append('path')
                    .attr("class", "piechart")
                    .attr("fill", function(d, i) {
                        return color(i);
                    })
                    .attr("d", arc)
                    .each(function(d) {
                        this._current = d
                    });

                scope.$watch(function() {
                    return scope.items;
                }, function(nItems) {
                    scope.data = scope.$eval(nItems);
                    console.log(scope.data);
                });
            }
        }
    }
]);
// http://jonsadka.com/blog/how-to-create-adaptive-pie-charts-with-transitions-in-d3/
