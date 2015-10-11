'use strict';

function NavController($scope, $state, $location, login, receipt) {
	this.login = login;
    this.name = 'test';
    this.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };
    this.newReceipt = function(){
		receipt.reset();
    	$state.go('insert');
	};
}

NavController.$inject = ['$scope', '$state', '$location', 'login', 'receipt'];

angular
    .module('dispensa')
    .controller('NavbarController', NavController);
