'use strict';

function ReceiptItems($scope, $filter, itemsSvc) {
    // var orderBy = $filter('orderBy');
    $scope.model = itemsSvc.getModel();
    $scope.items = itemsSvc.getReceipts();
    $scope.itemsSvc = itemsSvc;


    $scope.setSelected = function(item) {
        $scope.itemsByPage += 1;
        console.log($scope.itemsByPage);
        itemsSvc.resetItem();
        itemsSvc.resetReciept();
        itemsSvc.getCurrentReciept().store = item.store;
        itemsSvc.getCurrentReciept().store_label = item.store_label;
        itemsSvc.getCurrentReciept().city = item.city;
        itemsSvc.getCurrentReciept().receipt = item.receipt;
        itemsSvc.getCurrentItem().name = item.name;
        itemsSvc.getCurrentItem().brand = item.brand;
        itemsSvc.getCurrentItem().label = item.label;
        itemsSvc.getCurrentItem().count = parseFloat(item.count);
        itemsSvc.getCurrentItem().price = parseFloat(item.price);
        itemsSvc.getCurrentItem().on_deal = item.on_deal;
    };
    $scope.edit = function(item) {
        itemsSvc.getCurrentReciept().date = item.date;
        itemsSvc.getCurrentReciept().store = item.store;
        itemsSvc.getCurrentReciept().store_label = item.store_label;
        itemsSvc.getCurrentReciept().city = item.city;
        itemsSvc.getCurrentReciept().receipt = item.receipt;
        itemsSvc.getCurrentItem().name = item.name;
        itemsSvc.getCurrentItem().id = item.id;
        itemsSvc.getCurrentItem().brand = item.brand;
        itemsSvc.getCurrentItem().label = item.label;
        itemsSvc.getCurrentItem().count = parseFloat(item.count);
        itemsSvc.getCurrentItem().price = parseFloat(item.price);
        itemsSvc.getCurrentItem().on_deal = item.on_deal;
    };

    $scope.delete = function(item) {
        return itemsSvc.deleteItem(item);
    };

}
var app = angular
    .module('dispensa')
    .controller('ReceiptItemsController', ['$scope', '$filter', 'itemsSvc', ReceiptItems]);
