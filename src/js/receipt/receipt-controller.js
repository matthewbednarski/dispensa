'use strict';
define(['angular', 'moment', 'lodash', 'app', 'items-svc'], function(angular, moment, _) {
    var app = angular.module('dispensa');
    app.controller('RecieptController', ['$scope', 'itemsSvc',
        function($scope, itemsSvc) {
            $scope.item = itemsSvc.getCurrentReciept();
            $scope.storeSelected = function(item) {
                var found = _.chain(itemsSvc.getStores())
                    .find(function(it) {
                        return it.key === item.store;
                    })
                    .value();
                if (found === undefined) {
                    found = _.chain(itemsSvc.getStores())
                        .find(function(it) {
                            return it.store === item.store;
                        })
                        .value();
                }
                if (found !== undefined) {
                    itemsSvc.getCurrentReciept().store = found.store;
                    itemsSvc.getCurrentReciept().store_label = found.store_label;
                    itemsSvc.getCurrentReciept().city = found.city;
                    $scope.item = itemsSvc.getCurrentReciept();
                }
            };
            $scope.reset = function() {
                itemsSvc.resetReciept();
                $scope.receiptForm.$setPristine();
            };
            $scope.cities = itemsSvc.getCities();
            $scope.store_labels = itemsSvc.getStoreLabels();
            $scope.stores = itemsSvc.getStores();
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
                return $scope.receiptForm.$valid;
            }, function(n, o) {
                if (n !== o) {
                    itemsSvc.canEditItem = n;
                }
            });


        }
    ]);
    return app;
});
