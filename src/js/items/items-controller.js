'use strict';
define(['angular', 'moment', 'lodash', 'app', 'items-svc'],
    function(angular, moment, _) {
        var app = angular.module('dispensa');
        app
            .controller('ItemsController', ['$scope', '$filter', 'itemsSvc',
                function($scope, $filter, itemsSvc) {
                    // var orderBy = $filter('orderBy');
                    $scope.model = itemsSvc.getModel();
                    $scope.items = itemsSvc.getItems();
                    $scope.itemsSvc = itemsSvc;
                    $scope.itemsByPage = 15;
                    $scope.setSelected = function(item) {
                        itemsSvc.getCurrentReciept().date = item.date;
                        itemsSvc.getCurrentReciept().store = item.store;
                        itemsSvc.getCurrentReciept().store_label = item.store_label;
                        itemsSvc.getCurrentReciept().city = item.city;
                        itemsSvc.getCurrentReciept().receipt = item.receipt;
                        itemsSvc.getCurrentItem().name = item.name;
                        itemsSvc.getCurrentItem().brand = item.brand;
                        itemsSvc.getCurrentItem().label = item.label;
                        itemsSvc.getCurrentItem().count = item.count;
                        itemsSvc.getCurrentItem().price = item.price;
                        itemsSvc.getCurrentItem().on_deal = item.on_deal;
                    };

                    $scope.delete = function(item) {
                        return itemsSvc.deleteItem(item);
                    };
                    $scope.edit = function(item) {
                        itemsSvc.setCurrentItem(item);
                    };
                }
            ]);
        return app;
    });
