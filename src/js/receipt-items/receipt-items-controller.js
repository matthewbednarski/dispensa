'use strict';


(function() {
    var app = angular
        .module('dispensa')
        .controller('ReceiptItemsController', ['$scope', '$filter', '$state', 'receipt', 'item', 'lists',  ReceiptItems]);

    function ReceiptItems($scope, $filter, $state, receipt, item, lists ) {
        // var orderBy = $filter('orderBy');
        // $scope.model = itemsSvc.getModel();
        this.receipt = receipt.current;
        var ctl = this;
        $scope.items = receipt.items();
        $scope.$on('receipt.set.current', function(e, rec) {
            ctl.receipt = receipt.current;
            $scope.items = receipt.items();
        });

        $scope.edit = function(it) {
            item.setCurrent(it);
            focus('item-div');
            focus('item-start');
            lists.getNames();
            lists.getBrands();
            lists.getLabels();
        };


        $scope.delete = function(oItem) {
            return receipt.remove(oItem);
        }
    }
})();
