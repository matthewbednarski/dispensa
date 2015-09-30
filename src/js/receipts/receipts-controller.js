'use strict';


(function() {
    var app = angular
        .module('dispensa')
        .controller('ReceiptsController', 
        		['$scope', '$q', '$filter', '$state', '$route', 'receipts', Receipts]);

    function Receipts($scope, $q, $filter, $state, $route, receipts) {
        // var orderBy = $filter('orderBy');
        // $scope.model = itemsSvc.getModel();
        $scope.items = receipts.getItems();


        $scope.setSelected = function(item) {

            receipts.receiptService().setCurrent(item);

            $state.transitionTo('insert');
        };

        var deleting = 0;
        $scope.delete = function(receipt) {
            var p = receipts.remove(receipt);
            deleting++;
        }
    }
})();
