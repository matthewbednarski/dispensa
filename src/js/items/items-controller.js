'use strict';
define(['angular', 'moment', 'lodash', 'app','items-svc'],
    function(angular, moment, _) {
        var app = angular.module('dispensa');
        app
            .controller('ItemsController', ['$scope', '$filter', 'itemsSvc',
                function($scope, $filter, itemsSvc) {
                    var orderBy = $filter('orderBy');
                    $scope.model = itemsSvc.getModel();
                    $scope.items = itemsSvc.getItems();
                    $scope.order = function(predicate, reverse) {
                        $scope.items = orderBy($scope.items, predicate, reverse);
                    };
                    $scope.setSelected = function(item) {
                        itemsSvc.getCurrentReciept().date = item.date;
                        itemsSvc.getCurrentReciept().store = item.store;
                        itemsSvc.getCurrentReciept().store_label = item.store_label;
                        itemsSvc.getCurrentItem().name = item.name;
                        itemsSvc.getCurrentItem().brand = item.brand;
                        itemsSvc.getCurrentItem().label = item.label;
                        itemsSvc.getCurrentItem().count = item.count;
                        itemsSvc.getCurrentItem().price = item.price;
                    };
                    // $scope.order('-name', false);
                }
            ]);
        return app;
    });
