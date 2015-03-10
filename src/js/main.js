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




require(['app', 'moment', 'persist-svc', 'items-svc', 'bootstrap', 'bootstrap-datepicker'], function(app, moment) {
    var r = require(['app', 'items-controller', 'reciept-controller', 'item-controller'], function(app) {
        app.config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.when('/', {
                    templateUrl: 'js/item/item.html',
                    controller: 'ItemController'
                });

                $routeProvider.otherwise({
                    redirectTo: '/'
                });
            }
        ]);
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['dispensa']);
        });
        return app;
    });
});
