'use strict';

function Receipts($scope, $q, $filter, $state, $route, itemsSvc) {
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

	$scope.watch(function(){

		return $scope.items;
	},function(n, o ){

	});
    var deleting = 0;
    $scope.delete = function(receipt) {
        var p = itemsSvc.deleteReceipt(receipt);
        deleting++;

        p.then(
            function(deleted_arr) {
                var deleted_ids = deleted_arr[0];
                var deleted_defereds = deleted_arr[1];
                var allSetteledCB = function(results) {
                    var res = _.chain(itemsSvc.getItems())
                        .remove(function(removeit) {
                            if (removeit.id === undefined) {
                                return false;
                            }
                            for (var i = 0; i < deleted_ids.length; i++) {
                                var did = deleted_ids[i];
                                if (removeit.id === did) {
                                    return true;
                                }
                            }
                            return false;
                        })
                        .value();
                    if (res !== undefined && res.length > 0) {
                        itemsSvc.persist();
                    }
                    $state.reload();
                };
                $q.allSettled(deleted_defereds)
                    .then(allSetteledCB, allSetteledCB);
            });
    }

    itemsSvc.loadReceipts();
}
var app = angular
    .module('dispensa')
    .controller('ReceiptsController', ['$scope', '$q', '$filter', '$state', '$route', 'itemsSvc', Receipts]);
