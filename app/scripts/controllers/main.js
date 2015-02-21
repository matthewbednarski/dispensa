define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name dispensaApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the dispensaApp
   */
  angular.module('dispensaApp.controllers.MainCtrl', [ 'angular-growl'])
    .controller('MainCtrl', function ($scope, growl) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
      $scope.ctl = {};
      var ctl = $scope.ctl;
      $scope.ctl.test = "HI_THERE";

	  $scope.ctl.toMod = 0;
	  $scope.ctl.msg = function(){
	  	  var mod = $scope.ctl.toMod % 2;
		  $scope.ctl.toMod++;
		  if (mod > 0 ){
		  	  growl.info("SOME_TEXT");
		  }else{
		  	  growl.warning("HI_THERE");
		  }

	  };
    });
});
