'use strict';

function Graphic($scope, d3Svc, itemsSvc) {
    this.itemsSvc = itemsSvc;
    this.items = itemsSvc.getItems();
    this.monthYears = [];
    var ctrl = this;
    var props = ['brand', 'store', 'city', 'label'];
    this.monthYearsF = function() {
        var mY = _.chain(itemsSvc.getItems())
            .map(function(item) {
                return item.date;
            })
            .unique()
            .map(function(date) {
                return moment(date);
            })
            .map(function(moment) {
                var key = moment.format('YYYY-MM');
                var text = moment.format('MMM YYYY');
                return {
                    key: key,
                    text: text
                }
            })
            .unique(function(out) {
                return out.key;
            })
            .sortBy(function(out) {
                return out.key;
            })
            .value();

        _.assign(this.monthYears, mY);
        console.log(this.monthYears);
        return this.monthYears;
    }
    this.propertyF = function(prop) {
        var mY = _.chain(itemsSvc.getItems())
            .map(function(item) {
                return item[prop];
            })
            .unique()
            .map(function(item) {
                var key = item;
                var text = item;
                return {
                    key: key,
                    text: text
                }
            })
            .sortBy(function(out) {
                return out.key;
            })
            .value();

        var propValArrName = prop + 's';
        if (prop.indexOf('y') === (prop.length - 1)) {
            var idx = prop.length - 1;
            prop = prop.slice(0, idx);
            prop += 'ies';
            propValArrName = prop;
        }
        if (this[propValArrName] === undefined) {
            this[propValArrName] = [];
        }
        _.assign(this[propValArrName], mY);
        return this[propValArrName];
    }
    this.setupPropSelects = function() {
        for (var i = 0; i < props.length; i++) {
            ctrl.propertyF(props[i]);
        }
    }

    $scope.watch(function() {
        return this.items.length;
    }, function() {
        ctrl.monthYearsF();
        ctrl.setupPropSelects();
    });
    this.monthYearsF();
    this.setupPropSelects();

}
var app = angular.module('dispensa');
app.controller('GraphicController', ['$scope', 'd3Svc', 'itemsSvc', Graphic]);

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
