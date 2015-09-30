'use strict';

(function() {
    angular
        .module('dispensa')
        .controller('ItemsController', ['$scope', '$filter', '$state', 'receipts', 'receipt','item', itemsCtrl]);
    function itemsCtrl($scope, $filter, $state, receipts, receipt, item) {
        // $scope.model = itemsSvc.getModel();
        $scope.items = receipt.items();
        $scope.receipts = receipts;
        $scope.itemsByPage = 15;
        $scope.filter = {
            is_receipt: false
        };

        $scope.isReceipt = function(value, index) {
            if (!$scope.filter.is_receipt) {
                return true;
            }
            var props = ['store', 'date', 'city', 'receipt'];
            var receipt = receipt.current;
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
            // receipts.resetItem();
            receipt.reset();
            receipt.current.store = item.store;
            receipt.current.store_label = item.store_label;
            receipt.current.city = item.city;
            receipt.current.receipt = item.receipt;

            $state.transitionTo('insert');
        };
        $scope.edit = function(item) {
            receipt.current.date = item.date;
            receipt.current.store = item.store;
            receipt.current.store_label = item.store_label;
            receipt.current.city = item.city;
            receipt.current.receipt = item.receipt;
            item.current.name = item.name;
            item.current.id = item.id;
            item.current.brand = item.brand;
            item.current.label = item.label;
            item.current.count = parseFloat(item.count);
            item.current.price = parseFloat(item.price);
            item.current.on_deal = item.on_deal;
            $state.transitionTo('insert');
        };


        $scope.delete = function(item) {
            return receipts.remove(item);
        };
    }
})();
