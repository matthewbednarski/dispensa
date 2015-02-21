/*jshint unused: vars */
define(['angular', 'controllers/main', 'controllers/about'] /*deps*/ , function(angular, MainCtrl, AboutCtrl) /*invoke*/ {
    'use strict';

    /**
     * @ngdoc overview
     * @name dispensaApp
     * @description
     * # dispensaApp
     *
     * Main module of the application.
     */
    return angular
        .module('dispensaApp', ['dispensaApp.controllers.MainCtrl',
            'dispensaApp.controllers.AboutCtrl',
            /*angJSDeps*/
            'ngCookies',
            'ngMessages',
            'ngResource',
            'ngSanitize',
            'ngRoute',
            'ngAnimate',
            'ngTouch',
            'pascalprecht.translate',
            'angular-growl'
        ])
        .config(function($translateProvider) {
            // register translation table
            $translateProvider.translations( 'en', {
                'HEADLINE_TEXT': 'Hey Guys, this is a headline!',
                'SOME_TEXT': 'A text anywhere in the app.',
                'HI_THERE': 'Hi there!!!'
            });
            $translateProvider.preferredLanguage('en');
        })
        .config(function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                })
                .when('/about', {
                    templateUrl: 'views/about.html',
                    controller: 'AboutCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        });
});
