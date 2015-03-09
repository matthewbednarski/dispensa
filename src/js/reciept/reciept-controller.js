'use strict';
require(['app', 'moment', 'lodash', 'items-svc'], function(app, moment, _) {
    app
        .controller('RecieptController', ['$scope', 'itemsSvc',
            function($scope, itemsSvc) {
                $scope.item = itemsSvc.getCurrentReciept();
                $scope.reset = function() {
                    itemsSvc.resetReciept();
                };
                $scope.loadType = function(type, field) {
                    var vals = _.chain(itemsSvc.getItems())
                        .map(function(item) {
                            return item[field];
                        })
                        .unique()
                        .sort()
                        .value();
                    while ($scope[type].length > 0) {
                        $scope[type].pop();
                    }
                    _.forEach(vals, function(item) {
                        if (this.indexOf(item) < 0) {
                            this.push(item);
                        }
                    }, $scope[type]);
                    return $scope[type];
                };
                $scope.store_labels = [];
                $scope.loadStoreLabels = function() {
                    return $scope.loadType('store_labels', 'store_label');
                };
                $scope.stores = [];
                $scope.loadStores = function() {
                    return $scope.loadType('stores', 'store');
                };
                $scope.findPreviousLabel = function() {
                    var r = itemsSvc.getCurrentReciept();
                    var hasReciept = (r.store !== undefined && r.store !== "") ? true : false;
                    var vals = _.chain(itemsSvc.getItems())
                        .filter(function(item) {
                            if (hasReciept) {
                                return item.store === r.store;
                            }
                            return item.store_label !== undefined && item.store_label !== '';
                        })
                        .map(function(item) {
                            return item.store_label;
                        })
                        .value();

                    return vals;
                };
                $scope.$watch(function() {
                    return itemsSvc.model.reciept.store;
                }, function() {
                    var _i = $scope.findPreviousLabel();
                    if (_i.length > 0) {
                        itemsSvc.model.reciept.store_label = _i[0];
                    }
                });
                $scope.$watch(function() {
                    return itemsSvc.model.items.length;
                }, function() {
                    $scope.loadStores();
                    $scope.loadStoreLabels();
                });

            }
        ]);
});
