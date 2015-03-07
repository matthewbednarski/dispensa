define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name dispensaApp.controller:AboutCtrl
   * @description
   * # AboutCtrl
   * Controller of the dispensaApp
   */
  angular.module('dispensaApp.controllers.AboutCtrl', [])
    .controller('AboutCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });
});
