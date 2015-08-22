'use strict';

function itemCtrl($scope, $timeout, focus, itemsSvc) {
    this.itemsSvc = itemsSvc;
    var ctl = this;
    this.item = itemsSvc.newItem();
    $scope.$on('itemChanged', function(e, item){
    	_.assign(ctl.item, item);
	});
    this.update = function(item) {
        itemsSvc.addItem(item)
            .then(function() {
            	ctl.reset();	
                // itemsSvc.resetItem();
                $scope.itemForm.$setPristine();
                focus('item-start');
            });
    };
    this.reset = function() {
        this.item =  {};
        // itemsSvc.resetItem();
        $scope.itemForm.$setPristine();
        focus('item-start');
    };
    this.names = itemsSvc.getNames();
    this.brands = itemsSvc.getBrands();
    this.labels = itemsSvc.getLabels();

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
        return itemsSvc.getCurrentReceipt().store;
    }, function() {
        itemsSvc.loadNames();
        itemsSvc.loadBrands();
        itemsSvc.loadLabels();
    });
    $scope.$watch(function() {
        return itemsSvc.model.items.length;
    }, function() {
        itemsSvc.loadNames();
        itemsSvc.loadBrands();
        itemsSvc.loadLabels();
    });
    $timeout(function(){
        itemsSvc.loadNames();
        itemsSvc.loadBrands();
        itemsSvc.loadStoreLabels();
        itemsSvc.loadLabels();
	});
}

    angular
        .module('dispensa')
        .controller('ItemController', ['$scope', '$timeout', 'focus', 'itemsSvc', itemCtrl]);
