'use strict';

define(['angular', 'angular-translate', 'allmighty-autocomplete', 'lodash'],
    function(angular, ngTranslate, _) {


        var app = angular.module('dispensa', ['ngLocale', 'pascalprecht.translate', 'autocomplete']);


        app.config(function($translateProvider) {
            $translateProvider.translations('en-US', {
                app: {
                    title: "Dispensa v2"
                },
                item: {
                    name: "Name",
                    store: "Store",
                    brand: "Brand",
                    label: "Label",
                    count: "Count",
                    price: "Price",
                    date: "Date",
                },
                action: {
                    save: "Save",
                    reset: "Reset"

                }
            });
            $translateProvider.preferredLanguage('en-US');
        });
        return app;
    });
