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
        'reciept-controller': 'reciept/reciept-controller',

        // -AMD
        angular: 'libs/angular/angular',
        'angular-translate': 'libs/angular-translate/angular-translate',
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
        }
    }
});




require(['app', 'moment', 'bootstrap', 'bootstrap-datepicker'], function(app, moment) {
    require(['persist-svc', 'items-svc'], function(app, moment) {
        var myApp = require(['app', 'items-controller', 'reciept-controller', 'item-controller'], function(app) {
            var app = angular.module('dispensa');
            app.config(function($stateProvider, $urlRouterProvider) {
                //
                // For any unmatched url, redirect to /state1
                $urlRouterProvider.otherwise("/");
                //
                // Now set up the states
                $stateProvider
                    .state('state1', {
                        url: "/",
                        views: {
                            'items': {
                                templateUrl: "js/items/items.html",
                                controller: 'ItemsController'
                            },
                            'item': {
                                templateUrl: "js/item/item.html",
                                controller: 'ItemController'
                            },
                            'reciept': {
                                templateUrl: "js/reciept/reciept.html",
                                controller: 'RecieptController'
                            }
                        }
                    })
            });

            console.log('2.) ' + app);
            angular.element(document).ready(function() {
                angular.bootstrap(document, ['dispensa']);
            });
            return app;
        });
    });
});
