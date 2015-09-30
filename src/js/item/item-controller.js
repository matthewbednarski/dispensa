'use strict';
(function() {

    angular
        .module('dispensa')
        .controller('ItemController', ['$scope', '$timeout', 'focus', 'item', 'receipt', 'lists', itemCtrl]);
    function itemCtrl($scope, $timeout, focus, item, receipt, lists) {
        this.itemsSvc = item;
        var ctl = this;
        this.item = item.current;
        // $scope.$on('itemChanged', function(e, item) {
        //     _.assign(ctl.item, item);
        // });
        this.update = function(item) {
            receipt.addItem(item)
                .then(function() {
                    item.reset();
                    // itemsSvc.resetItem();
                    $scope.itemForm.$setPristine();
                    focus('item-start');
                });
        };
        this.reset = function() {
            this.item = {};
            item.reset();
            // itemsSvc.resetItem();
            $scope.itemForm.$setPristine();
            focus('item-start');
        };
        this.names = lists.getNames();
        this.brands = lists.getBrands();
        this.labels = lists.getLabels();

        this.nameSelected = function(item) {
            // if(item === undefined){
            // 	return;
            // }
            // var found = _.chain(itemsSvc.getItems())
            //     .find(function(it) {
            //         return it.name === item.name;
            //     })
            //     .value();
            // if (found !== undefined) {
            //     itemsSvc.getCurrentItem().brand = found.brand;
            //     itemsSvc.getCurrentItem().label = found.label;
            //     itemsSvc.getCurrentItem().price = parseFloat(found.price);
            //     itemsSvc.getCurrentItem().count = parseFloat(found.count);
            //     itemsSvc.getCurrentItem().on_deal = found.on_deal;
            // 	focus('item-price');
            // }
        };
        $scope.$watch(function() {
            return receipt.current.store;
        }, function() {
            lists.loadNames();
            lists.loadBrands();
            lists.loadLabels();
        });
        $scope.$watch(function() {
            return receipt.items().length;
        }, function() {
            lists.loadNames();
            lists.loadBrands();
            lists.loadLabels();
        });
        $timeout(function() {
            lists.loadNames();
            lists.loadBrands();
            lists.loadStoreLabels();
            lists.loadLabels();
        });
    }

})();
