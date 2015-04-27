'use strict';

function Graphic($scope, d3Svc, itemsSvc, reportingSvc) {
    this.itemsSvc = itemsSvc;
    this.svc = reportingSvc;
    this.items = itemsSvc.getItems();

	var ctrl = this.svc;
    this.svc.setupPropSelects();
    // this.svc.extractMonthYears();
}
var app = angular.module('dispensa');
app.controller('GraphicController', ['$scope', 'd3Svc', 'itemsSvc', 'reportingSvc', Graphic]);

app.factory('d3Svc', [

    function() {
        var _d3 = d3;
        var width = 960,
            height = 450,
            radius = Math.min(width, height) / 2;

        _d3.labels = function(data) {
            var labels = _.chain(data)
                .groupBy("label")
                .map(function(value, key) {
                    return [key, _.reduce(value, function(result, currentObject) {
                        return {
                            price: result.price + (currentObject.price * currentObject.count)
                        }
                    }, {
                        price: 0
                    })];
                })
                .object()
                .value();
            labels = _.chain(_.keys(labels))
                .map(function(key) {
                    return {
                        label: key,
                        price: labels[key].price
                    }
                })
                .value();
            return labels;
        };
        _d3.prepareData = function(data) {
            return _d3.labels(data);
        };
        _d3.setup = function(ele) {
            var svg = d3.select(ele)
                .append("svg")
                .attr("height", height)
                .attr("width", width)
                .append("g");

            svg.append("g")
                .attr("class", "slices");
            svg.append("g")
                .attr("class", "labels");
            svg.append("g")
                .attr("class", "lines");
            svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            return svg;
        };

        var pie = d3.layout.pie()
            .sort(function(d) {
                return d.label;
            })
            .value(function(d) {
                return d.price;
            });

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.95)
            .innerRadius(radius * 0.3);

        var outerArc = d3.svg.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        var key = function(d) {
            return d.data.label;
        };

        var color = d3.scale.category20();

        _d3.change = function(data, svg) {
            /* ------- PIE SLICES -------*/
            var slice = svg.select(".slices").selectAll("path.slice")
                .data(pie(data), key);

            slice.enter()
                .insert("path")
                .style("fill", function(d) {
                    return color(d.data.label);
                })
                .attr("class", "slice");

            slice
                .transition().duration(1000)
                .attrTween("d", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                });

            slice.exit()
                .remove();

            /* ------- TEXT LABELS -------*/

            var text = svg.select(".labels").selectAll("text")
                .data(pie(data), key);

            text.enter()
                .append("text")
                .attr("dy", ".35em")
                .text(function(d) {
                    return d.data.label;
                });

            function midAngle(d) {
                return d.startAngle + (d.endAngle - d.startAngle) / 2;
            }

            text.transition().duration(1000)
                .attrTween("transform", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate(" + pos + ")";
                    };
                })
                .styleTween("text-anchor", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start" : "end";
                    };
                });

            text.exit()
                .remove();

            /* ------- SLICE TO TEXT POLYLINES -------*/

            var polyline = svg.select(".lines").selectAll("polyline")
                .data(pie(data), key);

            polyline.enter()
                .append("polyline");

            polyline.transition().duration(1000)
                .attrTween("points", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arc.centroid(d2), outerArc.centroid(d2), pos];
                    };
                });

            polyline.exit()
                .remove();
        }
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
                scope.data = scope.$eval(scope.items);
                var svg = d3.setup(ele[0]);
                var d = d3.prepareData(scope.data);
                d3.change(d, svg);

                scope.$watch(function() {
                    return scope.items;
                }, function(nItems) {
                    scope.data = scope.$eval(nItems);
                    var d = d3.prepareData(scope.data);
                    d3.change(d, svg);
                });
            }
        }
    }
]);
// http://jonsadka.com/blog/how-to-create-adaptive-pie-charts-with-transitions-in-d3/
