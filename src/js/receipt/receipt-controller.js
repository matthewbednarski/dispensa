'use strict';
(function(){
	angular
		.module('dispensa')
		.controller('ReceiptController', ['$scope', '$state', 'focus', 'receipt', 'receipts','lists', receiptCtrl]);
	function receiptCtrl($scope, $state, focus, receipt, receipts, lists) {
		this.item = receipt.current;
		this.storeSelected = function(item) {
			var found = _.chain(lists.getStores())
				.find(function(it) {
					return it.key === item.store;
				})
			.value();
			if (found === undefined) {
				found = _.chain(lists.getStores())
					.find(function(it) {
						return it.store === item.store;
					})
				.value();
			}
			if (found !== undefined) {
				focus('receipt-date');
				receipt.current.store = found.store;
				receipt.current.store_label = found.store_label;
				receipt.current.city = found.city;
			}
		};
		this.save = function() {
			receipts.addReceipt(receipt.current);
			console.log(receipt.current);
			$scope.receiptForm.$setPristine();
			$state.go('receipts');
		};
		this.reset = function() {
			receipt.reset();
			$scope.receiptForm.$setPristine();
			focus('receipt-div');
			focus('receipt-start');
		};
		this.cities = lists.getCities();
		this.store_labels = lists.getStoreLabels();
		this.stores = lists.getStores();

		this.receiptTotal = function() {
			var total = _.reduce(receipt.current.items, function(memo, item) {
				if (memo.price === undefined) {
					memo.price = 0;
				}
				var p = item.count * item.price;
				memo.price += p;
				return memo;
			}, {});
			return total.price;
		};
		var c = 0;
		$scope.$watch(function() {
			return $state.is('insert');
		}, function(n, o) {
			if (n) {
				console.log("Is $state.insert: " + n);
				console.log(++c);
				focus('receipt-div');
				focus('receipt-start');
			}
		});
		$scope.$watch(function() {
			return $scope.receiptForm.$valid;
		}, function(n, o) {
			receipt.canEditItem = n;
			if (!n && n !== o) {
				receipt.canEditItem = false;
			}
		});
		this.toArticle = function() {
			if (receipt.canEditItem) {
				focus('item-div');
				focus('item-start');
			}
		}
	}

})();
