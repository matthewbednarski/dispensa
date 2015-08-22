'use strict';

function itemsCtrl($scope, $filter, $state, itemsSvc) {
    $scope.model = itemsSvc.getModel();
    $scope.items = itemsSvc.getCurrentReceipt().items;
    $scope.itemsSvc = itemsSvc;
    $scope.itemsByPage = 15;
    $scope.filter = {
        is_receipt: false
    };

    $scope.isReceipt = function(value, index) {
        if (!$scope.filter.is_receipt) {
            return true;
        }
        var props = ['store', 'date', 'city', 'receipt'];
        var receipt = itemsSvc.getCurrentReceipt();
        var isReceipt = true;
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (value[prop] !== receipt[prop]) {
                isReceipt = false;
                break;
            }
        }
        return isReceipt;
    };

    $scope.setSelected = function(item) {
        $scope.itemsByPage += 1;
        console.log($scope.itemsByPage);
        // itemsSvc.resetItem();
        itemsSvc.resetReceipt();
        itemsSvc.getCurrentReceipt().store = item.store;
        itemsSvc.getCurrentReceipt().store_label = item.store_label;
        itemsSvc.getCurrentReceipt().city = item.city;
        itemsSvc.getCurrentReceipt().receipt = item.receipt;
        // itemsSvc.getCurrentItem().name = item.name;
        // itemsSvc.getCurrentItem().brand = item.brand;
        // itemsSvc.getCurrentItem().label = item.label;
        // itemsSvc.getCurrentItem().count = parseFloat(item.count);
        // itemsSvc.getCurrentItem().price = parseFloat(item.price);
        // itemsSvc.getCurrentItem().on_deal = item.on_deal;
        $state.transitionTo('insert');
    };
    $scope.edit = function(item) {
        itemsSvc.getCurrentReceipt().date = item.date;
        itemsSvc.getCurrentReceipt().store = item.store;
        itemsSvc.getCurrentReceipt().store_label = item.store_label;
        itemsSvc.getCurrentReceipt().city = item.city;
        itemsSvc.getCurrentReceipt().receipt = item.receipt;
        itemsSvc.getCurrentItem().name = item.name;
        itemsSvc.getCurrentItem().id = item.id;
        itemsSvc.getCurrentItem().brand = item.brand;
        itemsSvc.getCurrentItem().label = item.label;
        itemsSvc.getCurrentItem().count = parseFloat(item.count);
        itemsSvc.getCurrentItem().price = parseFloat(item.price);
        itemsSvc.getCurrentItem().on_deal = item.on_deal;
        $state.transitionTo('insert');
    };


    $scope.delete = function(item) {
        return itemsSvc.deleteItem(item);
    };
}
        angular
            .module('dispensa')
            .controller('ItemsController', ['$scope', '$filter', '$state', 'itemsSvc', itemsCtrl ]);
