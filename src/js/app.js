'use strict';

define(['angular',
        'angular-translate',
        'lodash',
        'angular-route',
        'angular-ui-router',
        'angular-smart-table',
        'allmighty-autocomplete'
    ],
    function(angular, ngTranslate, _) {
        var app = angular.module('dispensa', ['ngLocale', 'ui.router', 'ngRoute', 'pascalprecht.translate', 'autocomplete', 'smart-table']);
        app.config(function($translateProvider) {
            $translateProvider.translations('en-US', {
                app: {
                    title: "Dispensa v2",
                    home: "Home",
                    insert: "Insert Reciept",
                    receipt: "Reciept",
                    item: "Article",
                    view: "View Table",
                    graphic: "View Graphic",
                    login: "Login",
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
                    is_receipt: "Show receipt"
                },
                symbol: {
                    currency: "€"
                },
                action: {
                    actions: "Actions",
                    save: "Save",
                    delete: "Delete",
                    reset: "Reset",
                    new: "Create New"

                }
            });
            $translateProvider.preferredLanguage('en-US');
        });
        app.config(function($stateProvider, $urlRouterProvider) {
            //
            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/");
            //
            // Now set up the states
            $stateProvider
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
                            controller: 'RecieptController',
                            controllerAs: 'ctl'
                        }
                    }
                })
                .state('table', {
                    url: "/",
                    views: {
                        'items': {
                            templateUrl: "js/items/items.html",
                            controller: 'ItemsController'
                        }
                    }
                })
                .state('table.receipts', {
                    url: "/receipts",
                    views: {
                        'receipts': {
                            templateUrl: "js/receipt-items/receipt-items.html",
                            controller: 'ReceiptItemsController'
                        }
                    }
                })
                .state('report', {
                    url: "/graphic",
                    views: {
                        'graphic': {
                            templateUrl: "js/graphic/graphic.html",
                            controller: 'GraphicController'
                        }
                    }
                });
        });
        console.log('1.) ' + app);
        return app;
    });
