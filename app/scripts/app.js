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

			$translateProvider.useStaticFilesLoader({
				prefix: 'i18n/texts_',
				suffix: '.json'
			});

            $translateProvider.preferredLanguage('en_US');
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
