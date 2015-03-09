'use strict';

require(['app', 'moment', 'lodash', 'items-svc'],
    function(app, moment, _) {
        app
            .controller('ItemController', ['$scope', 'itemsSvc',
                function($scope, itemsSvc) {
                    $scope.names = ['test', 'test2', 'abc', 'bd'];
                    $scope.item = itemsSvc.getCurrentItem();
                    $scope.update = function(item) {
                        itemsSvc.addItem(item);
                    };
                    $scope.reset = function() {
                        $scope.item = itemsSvc.resetItem();
                    };
                    $scope.names = [];
                    $scope.loadNames = function() {
                        var r = itemsSvc.getCurrentReciept();
                        var hasStore = (r.store !== undefined && r.store !== "") ? true : false;
                        var vals = _.chain(itemsSvc.getItems())
                            .filter(function(item) {
                                if (hasStore) {
                                    return item.store === r.store;
                                }
                                return true;
                            })
                            .map(function(item) {
                                return item.name;
                            })
                            .unique()
                            .sort()
                            .value();
                        while ($scope.names.length > 0) {
                            $scope.names.pop();
                        }
                        _.forEach(vals, function(item) {
                            if (this.indexOf(item) < 0) {
                                this.push(item);
                            }
                        }, $scope.names);
                        return $scope.names;
                    };
                    $scope.findPreviousItem = function() {
                        var i = itemsSvc.getCurrentItem();
                        var r = itemsSvc.getCurrentReciept();
                        var hasItem = (r.name !== undefined && r.name !== "") ? true : false;
                        var hasReciept = (r.store !== undefined && r.store !== "") ? true : false;
                        var vals = _.chain(itemsSvc.getItems())
                            .filter(function(item) {
                                if (hasItem && hasReciept) {
                                    return item.name === i.name && item.store === r.store;
                                }
                                return false;
                            })
                            .value();

                        return vals;
                    };
                    $scope.brands = [];
                    $scope.loadBrands = function() {
                        var r = itemsSvc.getCurrentItem();
                        var hasItem = (r.name !== undefined && r.name !== "") ? true : false;
                        var vals = _.chain(itemsSvc.getItems())
                            .filter(function(item) {
                                if (hasItem) {
                                    return item.name === r.name;
                                }
                                return true;
                            })
                            .map(function(item) {
                                return item.brand;
                            })
                            .unique()
                            .sort()
                            .value();
                        while ($scope.brands.length > 0) {
                            $scope.brands.pop();
                        }
                        _.forEach(vals, function(item) {
                            if (this.indexOf(item) < 0) {
                                this.push(item);
                            }
                        }, $scope.brands);
                        return $scope.brands;
                    };
                    $scope.$watch(function() {
                        return itemsSvc.model.item.name;
                    }, function() {
                        var _items = $scope.findPreviousItem();
                        if (_items.length > 0) {
                            var it = _items[0];
                            itemsSvc.model.item.brand = it.brand;
                            itemsSvc.model.item.count = it.count;
                            itemsSvc.model.item.label = it.label;
                            itemsSvc.model.item.price = it.price;
                        }
                    });
                    $scope.$watch(function() {
                        return itemsSvc.model.reciept.store;
                    }, function() {
                        $scope.loadNames();
                    });
                    $scope.$watch(function() {
                        return itemsSvc.model.items.length;
                    }, function() {
                        $scope.loadNames();
                    });
                }
            ]);
    });
