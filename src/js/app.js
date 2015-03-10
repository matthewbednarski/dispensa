'use strict';

define(['angular',
        'angular-translate',
        'lodash',
        'angular-route',
        'angular-ui-router',
        'allmighty-autocomplete'
    ],
    function(angular, ngTranslate, _) {
        var app = angular.module('dispensa', ['ngLocale', 'ui.router', 'ngRoute', 'pascalprecht.translate', 'autocomplete']);
        app.config(function($translateProvider) {
            $translateProvider.translations('en-US', {
                app: {
                    title: "Dispensa v2"
                },
                item: {
                    id: "Id",
                    name: "Name",
                    store: "Store",
                    brand: "Brand",
                    label: "Label",
                    count: "Count",
                    price: "Price",
                    reciept: "Rec. #",
                    date: "Date",
                },
                action: {
                    save: "Save",
                    reset: "Reset"

                }
            });
            $translateProvider.preferredLanguage('en-US');
        });
        console.log('1.) ' + app);
        return app;
    });
