'use strict';

function receiptCtrl($scope, $state, focus, itemsSvc) {
    this.item = itemsSvc.getCurrentReciept();
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
            focus('receipt-city');
            itemsSvc.getCurrentReciept().store = found.store;
            itemsSvc.getCurrentReciept().store_label = found.store_label;
            itemsSvc.getCurrentReciept().city = found.city;
        }
    };
    this.reset = function() {
        itemsSvc.resetReciept();
        $scope.receiptForm.$setPristine();
        focus('receipt-div');
        focus('receipt-start');
    };
    this.cities = itemsSvc.getCities();
    this.store_labels = itemsSvc.getStoreLabels();
    this.stores = itemsSvc.getStores();

    this.receiptTotal = function() {
        var total = _.chain(itemsSvc.getItems())
            .filter(function(item) {
                var props = ['store', 'date', 'city', 'receipt'];
                var receipt = itemsSvc.getCurrentReciept();
                var isReceipt = true;
                for (var i = 0; i < props.length; i++) {
                    var prop = props[i];
                    if (item[prop] !== receipt[prop]) {
                        isReceipt = false;
                        break;
                    }
                }
                return isReceipt;
            })
            .reduce(function(memo, item, index, col) {
                if (memo === undefined) {
                    memo = {};

                }
                if (memo.price === undefined) {
                    memo.price = 0;
                }
                var p = item.count * item.price;
                memo.price += p;
                return memo;
            }, {})
            .value();
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
        if (n && n !== o) {
            focus('item-div');
            focus('item-start');
        }
    });
}
angular
    .module('dispensa')
    .controller('RecieptController', ['$scope', '$state', 'focus', 'itemsSvc', receiptCtrl]);
