'use strict';
require.config({
    paths: {
        // +AMD jquery: 'libs/jquery/dist/jquery',
        jquery: 'libs/jquery/dist/jquery',
        lodash: 'libs/lodash/lodash',
        moment: 'libs/moment/moment',
        i18next: 'libs/i18next/i18next.amd.withJQuery',
        offline: 'libs/offline/offline.min',
        pouchdb: 'libs/pouchdb/dist/pouchdb',
        'persist-svc': 'service/persist-svc',
        'items-svc': 'service/items-svc',
        'item-controller': 'item/item-controller',
        'items-controller': 'items/items-controller',
        'receipt-controller': 'receipt/receipt-controller',
        'graphic-controller': 'graphic/graphic-controller',
        'd3': 'libs/d3/d3',

        // -AMD
        angular: 'libs/angular/angular',
        'angular-translate': 'libs/angular-translate/angular-translate',
        'angular-smart-table': 'libs/angular-smart-table/dist/smart-table',
        'angular-route': 'libs/angular-route/angular-route',
        'angular-ui-router': 'libs/angular-ui-router/release/angular-ui-router',
        'angular-i18n': 'libs/angular-i18n/angular-locale_en-us',
        bootstrap: 'libs/bootstrap/dist/js/bootstrap',
        'bootstrap-datepicker': 'libs/bootstrap-datepicker/js/bootstrap-datepicker',
        'allmighty-autocomplete': 'libs/allmighty-autocomplete/script/autocomplete'

    },
    shim: {
        angular: {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-i18n': {
            deps: ['angular']
        },
        'allmighty-autocomplete': {
            deps: ['angular']
        },
        'angular-translate': {
            deps: ['angular']
        },
        bootstrap: {
            deps: ['jquery']
        },
        'bootstrap-datepicker': {
            deps: ['bootstrap']
        },
        'angular-smart-table': {
            deps: ['angular']
        }
    }
});




require(['app', 'moment', 'bootstrap', 'bootstrap-datepicker', 'd3'], function(app, moment) {
    require(['persist-svc', 'items-svc'], function(app, moment) {
        var myApp = require(['app', 'items-controller','graphic-controller', 'receipt-controller', 'item-controller'], function(app) {
            var app = angular.module('dispensa');
            app.config(function($stateProvider, $urlRouterProvider) {
                //
                // For any unmatched url, redirect to /state1
                $urlRouterProvider.otherwise("/");
                //
                // Now set up the states
                $stateProvider
                    .state('state1', {
                        url: "/insert",
                        views: {
                            'items': {
                                templateUrl: "js/items/items.html",
                                controller: 'ItemsController'
                            },
                            'item': {
                                templateUrl: "js/item/item.html",
                                controller: 'ItemController'
                            },
                            'receipt': {
                                templateUrl: "js/receipt/receipt.html",
                                controller: 'RecieptController'
                            }
                        }
                    })
                    .state('state2', {
                        url: "/",
                        views: {
                            'items': {
                                templateUrl: "js/items/items.html",
                                controller: 'ItemsController'
                            }
                        }
                    })
                    .state('state3', {
                        url: "/graphic",
                        views: {
                            'graphic': {
                                templateUrl: "js/graphic/graphic.html",
                                controller: 'GraphicController'
                            }
                        }
                    });
            });

            console.log('2.) ' + app);
            angular.element(document).ready(function() {
                angular.bootstrap(document, ['dispensa']);
            });
            return app;
        });
    });
});
