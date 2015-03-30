'use strict';

function NavController($scope, $location) {

    this.name = 'test';
    this.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };
}

NavController.$inject = ['$scope', '$location'];

angular
    .module('dispensa')
    .controller('NavbarController', NavController);
