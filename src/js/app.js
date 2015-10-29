'use strict';


(function(){
	var app = angular.module('dispensa', 
			['mcbUuid','mcbPersist', 'mcbFocus', 'ngLocale', 'ui.router', 'ngRoute', 'pascalprecht.translate', 'autocomplete', 'smart-table']);
	app.config(function($stateProvider, $urlRouterProvider) {
		//
		// For any unmatched url, redirect to /state1
		$urlRouterProvider.otherwise("/insert");
		//
		// Now set up the states
		$stateProvider
			.state('logout', {
				url: "/logout",
				views: {
					'login': {
						templateUrl: "js/login/logout.html"
					}
				}
			})
		.state('login', {
			url: "/login",
			views: {
				'login': {
					templateUrl: "js/login/login.html",
					controller: 'LoginController',
					controllerAs: 'ctl'
				}
			}
		})
		.state('insert', {
			url: "/insert",
			views: {
				'items': {
					templateUrl: "js/receipt-items/receipt-items.html",
					controller: 'ReceiptItemsController',
					controllerAs: 'receipt'
				},
				'item': {
					templateUrl: "js/item/item.html",
					controller: 'ItemController',
					controllerAs: 'ctl'
				},
				'receipt': {
					templateUrl: "js/receipt/receipt.html",
					controller: 'ReceiptController',
					controllerAs: 'ctl'
				}
			},
			onEnter: function(lists) {
				lists.getStores();
				lists.getCities();
				lists.getStoreLabels();
			}
		})
		.state('table', {
			url: "/list",
			views: {
				'items': {
					templateUrl: "js/items/items.html",
					controller: 'ItemsController',
					controllerAs: 'ctl'
				}
			},
			onEnter: function($timeout, receipts) {
				console.log(receipts);
			}
		})
		.state('receipts', {
			url: "/receipts",
			views: {
				'receipts': {
					templateUrl: "js/receipts/receipts.html",
					controller: 'ReceiptsController'
				}
			}
		})
		.state('report', {
			url: "/graphic",
			views: {
				'graphic': {
					templateUrl: "js/graphic/graphic.html",
					controller: 'GraphicController',
					controllerAs: 'ctrl'
				}
			}
		});
	});
	app.config(['$provide',
			function($provide) {
				$provide.decorator('$q', ['$delegate',
						function($delegate) {
							var $q = $delegate;

							// Extention for q
							$q.allSettled = $q.allSettled || function(promises) {
								var deferred = $q.defer();
								if (angular.isArray(promises)) {
									var states = [];
									var results = [];
									var didAPromiseFail = false;

									// First create an array for all promises with their state
									angular.forEach(promises, function(promise, key) {
										states[key] = false;
									});

									// Helper to check if all states are finished
									var checkStates = function(states, results, deferred, failed) {
										var allFinished = true;
										angular.forEach(states, function(state, key) {
											if (!state) {
												allFinished = false;
											}
										});
										if (allFinished) {
											if (failed) {
												deferred.reject(results);
											} else {
												deferred.resolve(results);
											}
										}
									}

									// Loop through the promises
									// a second loop to be sure that checkStates is called when all states are set to false first
									angular.forEach(promises, function(promise, key) {
										$q.when(promise).then(function(result) {
											states[key] = true;
											results[key] = result;
											checkStates(states, results, deferred, didAPromiseFail);
										}, function(reason) {
											states[key] = true;
											results[key] = reason;
											didAPromiseFail = true;
											checkStates(states, results, deferred, didAPromiseFail);
										});
									});
								} else {
									throw 'allSettled can only handle an array of promises (for now)';
								}

								return deferred.promise;
							};

							return $q;
						}
				]);
			}
	]);

	app.config(function($translateProvider) {
		$translateProvider.translations('en-US', {
			app: {
				title: "Dispensa v2",
				home: "Home",
				insert: "Insert Receipt",
				new: "New Receipt",
				receipt: "Receipt",
				item: "Article",
				view: "All Items",
				graphic: "View Graphic",
				login: "Login",
				logout: "Logout",
				"logout.success": "You've been successfully logged out!",
				items: "Items",
				search_store: "Filter stores",
				search_global: "Filter by any text",
			},
			item: {
				id: "Id",
				name: "Name",
				city: "City",
				store: "Store",
				brand: "Brand",
				label: "Label",
				store_label: "Label",
				count: "Units",
				price: "Unit Price",
				total_price: "Price Paid",
				receipt: "Rec. #",
				date: "Date",
				on_deal: "On Deal",
				notes: "Notes",
				is_receipt: "Show receipt"
			},
			text: {
				begin: "Begin",
				end: "End  ",
				city: "City",
				store: "Store",
				brand: "Brand",
				label: "Label",
				store_type: "Store Type"
			},
			symbol: {
				currency: "€"
			},
			action: {
				actions: "Actions",
				save: "Save",
				delete: "Delete",
				reset: "Reset",
				new: "Create New",
				check: "Done",
				edit: "Edit"

			}
		});
		$translateProvider.preferredLanguage('en-US');
	});
})();
// console.log('1.) %s', app);
