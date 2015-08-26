'use strict';

function ReceiptItems($scope, $filter, $state, itemsSvc) {
    // var orderBy = $filter('orderBy');
    $scope.model = itemsSvc.getModel();
    this.receipt = itemsSvc.getCurrentReceipt();
    var ctl = this;
    $scope.items = itemsSvc.getCurrentReceipt().items;
    $scope.itemsSvc = itemsSvc;
    $scope.$on('receiptChanged', function(e, receipt) {
        ctl.receipt = receipt;
        $scope.items = receipt.items;
    });


    // $scope.isReceipt = function(value, index) {
    //     var props = ['store', 'date', 'city', 'receipt'];
    //     var receipt = itemsSvc.getCurrentReceipt();
    //     var isReceipt = true;
    //     for (var i = 0; i < props.length; i++) {
    //         var prop = props[i];
    //         if (value[prop] !== receipt[prop]) {
    //             isReceipt = false;
    //             break;
    //         }
    //     }
    //     return isReceipt;
    // };

    $scope.setSelected = function(item) {
        $scope.itemsByPage += 1;
        console.log($scope.itemsByPage);
        itemsSvc.setCurrentItem(item)
    };
    $scope.edit = function(item) {
        itemsSvc.setCurrentItem(item);
        itemsSvc.isEditItem = true;
        focus('item-div');
        focus('item-start');
    };


    $scope.delete = function(receipt) {
        return itemsSvc.deleteReceipt(receipt);
    }
}
var app = angular
    .module('dispensa')
    .controller('ReceiptItemsController', ['$scope', '$filter', '$state', 'itemsSvc', ReceiptItems]);
