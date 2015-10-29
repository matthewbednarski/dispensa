'use strict';

(function() {
    angular
        .module('dispensa')
        .controller('ItemsController', ['$scope', '$filter', '$state', 'receipts', 'receipt','item', 'lists', itemsCtrl]);
    function itemsCtrl($scope, $filter, $state, receipts, receipt, item, lists) {
        // $scope.model = itemsSvc.getModel();
		var ctl = this;
        this.items = lists.allItems();
        console.log(this.items);
        // $scope.receipts = receipts;
        this.itemsByPage = 15;
        this.filter = {
            is_receipt: false
        };

        this.isReceipt = function(value, index) {
            if (!ctl.filter.is_receipt) {
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

        this.setSelected = function(item) {
            ctl.itemsByPage += 1;
            console.log(ctl.itemsByPage);
            // receipts.resetItem();
            receipt.reset();
            receipt.current.store = item.store;
            receipt.current.store_label = item.store_label;
            receipt.current.city = item.city;
            receipt.current.receipt = item.receipt;

            $state.transitionTo('insert');
        };
        this.edit = function(item) {
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

        this.delete = function(item) {
            return receipts.remove(item);
        };
    }
})();
