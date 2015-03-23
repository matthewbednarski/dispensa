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
                    view: "View Table",
                    graphic: "View Graphic",
                    items: "Items",
                    search_store : "Filter stores",
                    search_global : "Filter by any text",
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
        console.log('1.) ' + app);
        return app;
    });
