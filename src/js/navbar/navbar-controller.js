'use strict';

function NavbarController($scope, $location) {

    this.name = 'test';
	this.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
}


define(['angular', 'moment', 'lodash', 'app', 'items-svc'],
    function(angular, moment, _) {
        angular
            .module('dispensa')
            .controller('NavbarController', ['$scope', '$location', NavbarController]);
    });
