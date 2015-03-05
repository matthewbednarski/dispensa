'use strict';
require.config({
    paths: {
        // +AMD
        jquery: 'libs/jquery/dist/jquery',
        lodash: 'libs/lodash/lodash',
        moment: 'libs/moment/moment',
        i18next: 'libs/i18next/i18next.amd.withJQuery',
        offline: 'libs/offline/offline.min',

        // -AMD
        angular: 'libs/angular/angular',
        'angular-i18n': 'libs/angular-i18n/angular-locale_en-us',
        bootstrap: 'libs/bootstrap/dist/js/bootstrap',

    },
    shim: {
        angular: {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-i18n': {
            deps: ['angular']
        },
        bootstrap: {
            deps: ['jquery']
        }
    }
});




require(['app'], function(app) {
    console.log(app);
    app.controller('ctrl', ['$scope',
        function($scope) {
            $scope.greetMe = 'World';
        }
    ]);
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['dispensa']);
    });
});
