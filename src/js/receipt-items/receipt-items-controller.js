'use strict';


(function() {
    var app = angular
        .module('dispensa')
        .controller('ReceiptItemsController', ['$scope', '$filter', '$state', 'receipt', 'item', ReceiptItems]);

    function ReceiptItems($scope, $filter, $state, receipt, item) {
        // var orderBy = $filter('orderBy');
        // $scope.model = itemsSvc.getModel();
        this.receipt = receipt.current;
        var ctl = this;
        $scope.items = receipt.items();
        $scope.$on('receipt.set.current', function(e, rec) {
            ctl.receipt = receipt.current;
            $scope.items = receipt.items();
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

        $scope.setSelected = function(it) {
            $scope.itemsByPage += 1;
            console.log($scope.itemsByPage);
            item.setCurrent(it)
        };
        $scope.edit = function(it) {
            item.setCurrent(it);
            // items.isEditItem = true;
            focus('item-div');
            focus('item-start');
        };


        $scope.delete = function(oItem) {
            return receipt.remove(oItem);
        }
    }
})();
