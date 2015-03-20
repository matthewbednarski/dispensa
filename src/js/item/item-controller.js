'use strict';

define(['angular', 'moment', 'lodash', 'app', 'items-svc'],
    function(angular, moment, _) {
        var app = angular.module('dispensa');
        app.controller('ItemController', ['$scope', 'itemsSvc',
            function($scope, itemsSvc) {
                $scope.names = ['test', 'test2', 'abc', 'bd'];
                $scope.item = itemsSvc.getCurrentItem();
                $scope.itemsSvc = itemsSvc;
                $scope.update = function(item) {
                    itemsSvc.addItem(item)
                        .then(function() {
                            itemsSvc.resetItem();
                        });
                };
                $scope.reset = function() {
                    $scope.item = itemsSvc.resetItem();
                    $scope.itemForm.$setPristine();
                };
                $scope.names = itemsSvc.getNames();
                $scope.brands = itemsSvc.getBrands();

                // $scope.$watch(function() {
                //     return itemsSvc.model.item.name;
                // }, function() {
                //     var _items = $scope.findPreviousItem();
                //     if (_items.length > 0) {
                //         var it = _items[0];
                //         itemsSvc.model.item.brand = it.brand;
                //         itemsSvc.model.item.count = it.count;
                //         itemsSvc.model.item.label = it.label;
                //         itemsSvc.model.item.price = it.price;
                //     }
                // });
                $scope.nameSelected = function(item) {
                    var found = _.chain(itemsSvc.getItems())
                        .find(function(it) {
                            return it.name === item.name;
                        })
                        .value();
                    if (found !== undefined) {
                        itemsSvc.getCurrentItem().brand = found.brand;
                        itemsSvc.getCurrentItem().label = found.label;
                        itemsSvc.getCurrentItem().price = parseFloat(found.price);
                        itemsSvc.getCurrentItem().count = parseFloat(found.count);
                        itemsSvc.getCurrentItem().on_deal = found.on_deal;
                    }
                };
                $scope.$watch(function() {
                    return itemsSvc.getCurrentReciept().store;
                }, function() {
                    itemsSvc.loadNames();
                    itemsSvc.loadBrands();
                });
                $scope.$watch(function() {
                    return itemsSvc.model.items.length;
                }, function() {
                    itemsSvc.loadNames();
                    itemsSvc.loadBrands();
                });
            }
        ]);
        return app;
    });
