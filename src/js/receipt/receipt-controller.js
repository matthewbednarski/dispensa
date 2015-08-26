'use strict';

function receiptCtrl($scope, $state, focus, itemsSvc) {
    this.item = itemsSvc.getCurrentReceipt();
    this.storeSelected = function(item) {
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
            focus('receipt-date');
            itemsSvc.getCurrentReceipt().store = found.store;
            itemsSvc.getCurrentReceipt().store_label = found.store_label;
            itemsSvc.getCurrentReceipt().city = found.city;
        }
    };
    this.save = function() {
        itemsSvc.addReceipt(itemsSvc.getCurrentReceipt());
        $scope.receiptForm.$setPristine();
        focus('receipt-div');
        focus('receipt-start');
    };
    this.reset = function() {
        itemsSvc.resetReceipt();
        $scope.receiptForm.$setPristine();
        focus('receipt-div');
        focus('receipt-start');
    };
    this.cities = itemsSvc.getCities();
    this.store_labels = itemsSvc.getStoreLabels();
    this.stores = itemsSvc.getStores();

    this.receiptTotal = function() {
        var total = _.reduce(itemsSvc.getCurrentReceipt().items, function(memo, item) {
            if (memo.price === undefined) {
                memo.price = 0;
            }
            var p = item.count * item.price;
            memo.price += p;
            return memo;
        }, {});
        return total.price;
    };
    var c = 0;
    $scope.$watch(function() {
        return $state.is('insert');
    }, function(n, o) {
        if (n) {
            console.log("Is $state.insert: " + n);
            console.log(++c);
            focus('receipt-div');
            focus('receipt-start');
        }
    });
    $scope.$watch(function() {
        return $scope.receiptForm.$valid;
    }, function(n, o) {
        itemsSvc.canEditItem = n;
        if (!n && n !== o) {
            itemsSvc.isEditItem = false;
        }
    });
    this.toArticle = function() {
        if (itemsSvc.canEditItem) {
            itemsSvc.isEditItem = itemsSvc.canEditItem;
            focus('item-div');
            focus('item-start');
        }
    }
}
angular
    .module('dispensa')
    .controller('ReceiptController', ['$scope', '$state', 'focus', 'itemsSvc', receiptCtrl]);
