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
                    height = 500,
                    radius = Math.min(width, height) / 2;

                // var color = d3.scale.ordinal()
                //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

                var color = d3.scale.ordinal()
                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
                var arc = d3.svg.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(0);

                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) {
                        return d.price;
                    });

                var svg = d3.select(ele[0])
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                var d3path = svg.selectAll('path')
                    .data(pie(scope.data))
                    .enter()
                    .append('path');

                d3path.transition()
                    .duration(500)
                    .attr("d", arc)
                    .style("fill", function(d) {
                        return color(d.data.label);
                    })
                    .each(function(d) {
                        this._current = d;
                    });
                // store the initial angles
                // Store the displayed angles in _current.
                // Then, interpolate from _current to the new angles.
                // During the transition, _current is updated in -place by d3.interpolate.
                var d3change = function(data) {
                    d3path.data(pie(data));
                    d3path.transition()
                        .duration(750)
                        .attrTween("d", d3arcTween) // redraw the arcs
                        .attr("d", arc)
                        .style("fill", function(d) {
                        	console.log(d.data.label);
                            return color(d.data.label);
                        });

                };
                var d3arcTween = function(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function(t) {
                        return arc(i(t));
                    };
                };

                scope.$watch(function() {
                    return scope.items;
                }, function(nItems) {
                    scope.data = scope.$eval(nItems);
                    console.log(scope.data);
                    // var labels = itemsSvc.labels();
                    // var g = svg.selectAll(".arc")
                    //     .data(pie(labels))
                    //     .enter().append("g")
                    //     .attr("class", "arc");
                    //
                    // g.append("path")
                    //     .attr("d", arc)
                    //     .style("fill", function(d) {
                    //         return color(d.data.label);
                    //     });

                    // g.append("text")
                    //     .attr("transform", function(d) {
                    //         return "translate(" + arc.centroid(d) + ")";
                    //     })
                    //     .attr("dy", ".35em")
                    //     .style("text-anchor", "middle")
                    //     .text(function(d) {
                    //         return d.data.label;
                    //     });
                    d3change(scope.data);
                });
            }
        }
    }
]);
