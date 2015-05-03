'use strict';

function Receipts($scope, $filter, $state, itemsSvc) {
    // var orderBy = $filter('orderBy');
    $scope.model = itemsSvc.getModel();
    $scope.items = itemsSvc.getReceipts();
    $scope.itemsSvc = itemsSvc;


    $scope.setSelected = function(item) {
        itemsSvc.resetItem();
        itemsSvc.resetReciept();
        itemsSvc.getCurrentReciept().date = item.date;
        itemsSvc.getCurrentReciept().store = item.store;
        itemsSvc.getCurrentReciept().store_label = item.store_label;
        itemsSvc.getCurrentReciept().city = item.city;
        itemsSvc.getCurrentReciept().receipt = item.receipt;
        $state.transitionTo('insert');
    };

    $scope.delete = function(receipt) {
        return itemsSvc.deleteReceipt(receipt);
	}

	itemsSvc.loadReceipts();
}
var app = angular
    .module('dispensa')
    .controller('ReceiptsController', ['$scope', '$filter', '$state', 'itemsSvc', Receipts]);
