/*jshint unused: vars */
require.config({
    paths: {
        angular: '../../bower_components/angular/angular',
        'angular-animate': '../../bower_components/angular-animate/angular-animate',
        'angular-cookies': '../../bower_components/angular-cookies/angular-cookies',
        'angular-messages': '../../bower_components/angular-messages/angular-messages',
        'angular-mocks': '../../bower_components/angular-mocks/angular-mocks',
        'angular-resource': '../../bower_components/angular-resource/angular-resource',
        'angular-route': '../../bower_components/angular-route/angular-route',
        'angular-sanitize': '../../bower_components/angular-sanitize/angular-sanitize',
        'angular-touch': '../../bower_components/angular-touch/angular-touch',
        'angular-translate': '../../bower_components/angular-translate/angular-translate',
        'angular-translate-loader-static-files': '../../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files',
        'angular-translate-storage-cookie': '../../bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie',
        bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap',
        pouchdb: '../../bower_components/pouchdb/dist/pouchdb',
        'angular-growl-v2': '../../bower_components/angular-growl-v2/build/angular-growl'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        'angular-route': [
            'angular'
        ],
        'angular-cookies': [
            'angular'
        ],
        'angular-messages': [
            'angular'
        ],
        'angular-sanitize': [
            'angular'
        ],
        'angular-resource': [
            'angular'
        ],
        'angular-animate': [
            'angular'
        ],
        'angular-touch': [
            'angular'
        ],
        'angular-translate': [
            'angular'
        ],
        'angular-translate-loader-static-files': [
            'angular-translate'
        ],
        'angular-translate-storage-cookies': [
            'angular-translate',
            'angular-cookies'
        ],
        'angular-growl-v2': [
            'angular-translate'
        ],
        'angular-mocks': {
            deps: [
                'angular'
            ],
            exports: 'angular.mock'
        }
    },
    priority: [
        'angular',
        'angular-translate'
    ],
    packages: [

    ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
    'angular',
    'app',
    'angular-route',
    'angular-cookies',
    'angular-messages',
    'angular-sanitize',
    'angular-resource',
    'angular-animate',
    'angular-touch',
    'angular-growl-v2',
    'angular-translate',
    'pouchdb'
], function(angular, app, ngRoutes, ngCookies, ngMessages,
    ngSanitize, ngResource, ngAnimate, ngTouch, ngGrowl, ngTranslate, pouchdb) {
    'use strict';
    window.PouchDB = pouchdb;
    window.growl = ngGrowl;
    window.translate = ngTranslate;
    /* jshint ignore:start */
    var $html = angular.element(document.getElementsByTagName('html')[0]);
    /* jshint ignore:end */
    angular.element().ready(function() {
        angular.resumeBootstrap([app.name]);
    });
});
