'use strict';

function Receipts($scope, $q, $filter, $state, $route, itemsSvc) {
    // var orderBy = $filter('orderBy');
    $scope.model = itemsSvc.getModel();
    $scope.items = itemsSvc.getItems();
    $scope.itemsSvc = itemsSvc;


    $scope.setSelected = function(item) {
        // itemsSvc.resetItem();
        // itemsSvc.resetReceipt();
        itemsSvc.setCurrentReceipt(item);
        // itemsSvc.getCurrentReceipt().date = item.date;
        // itemsSvc.getCurrentReceipt().store = item.store;
        // itemsSvc.getCurrentReceipt().store_label = item.store_label;
        // itemsSvc.getCurrentReceipt().city = item.city;
        // itemsSvc.getCurrentReceipt().receipt = item.receipt;
        $state.transitionTo('insert');
    };

    var deleting = 0;
    $scope.delete = function(receipt) {
        var p = itemsSvc.deleteReceipt(receipt);
        deleting++;
    }
}
var app = angular
    .module('dispensa')
    .controller('ReceiptsController', ['$scope', '$q', '$filter', '$state', '$route', 'itemsSvc', Receipts]);
