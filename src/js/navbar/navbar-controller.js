'use strict';

function NavController($scope, $location, login) {

	this.login = login;
    this.name = 'test';
    this.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };
}

NavController.$inject = ['$scope', '$location', 'login'];

angular
    .module('dispensa')
    .controller('NavbarController', NavController);
