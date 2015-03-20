'use strict';

define(['angular', 'moment', 'lodash', 'd3', 'app', 'items-svc'],
    function(angular, moment, _, d3) {
        var app = angular.module('dispensa');
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
						data: '='
					},
                    link: function(scope, ele, attrs) {
                        console.log(d3);

                        // var vis = d3.select(ele[0])
                        //     .append("svg")
                        //     .style("color", "black")
                        //     .style("background-color", "orange");
                        var width = 960,
                            height = 500,
                            radius = Math.min(width, height) / 2;

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

                        scope.$watch(function() {
							return scope.data.length;
                        }, function() {
                        	var labels = itemsSvc.labels();
                        	console.log(labels);
                            var g = svg.selectAll(".arc")
                                .data(pie(labels))
                                .enter().append("g")
                                .attr("class", "arc");

                            g.append("path")
                                .attr("d", arc)
                                .style("fill", function(d) {
                                    return color(d.data.label);
                                });

                            g.append("text")
                                .attr("transform", function(d) {
                                    return "translate(" + arc.centroid(d) + ")";
                                })
                                .attr("dy", ".35em")
                                .style("text-anchor", "middle")
                                .text(function(d) {
                                    return d.data.label;
                                });
                        });

                    }
                }
            }
        ]);
        app.controller('GraphicController', ['$scope', 'd3Svc', 'itemsSvc',
            function($scope, d3Svc, itemsSvc) {
                $scope.itemsSvc = itemsSvc;
                $scope.items = itemsSvc.getItems();

            }
        ]);
        return app;
    });
