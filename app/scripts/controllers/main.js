define(['angular'], function(angular) {
    'use strict';

    /**
     * @ngdoc function
     * @name dispensaApp.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the dispensaApp
     */
    angular.module('dispensaApp.controllers.MainCtrl', ['angular-growl'])
        .service('itemsSvc', function($http, $q) {
            this.url = '/restify/item';
            this.persistence_key = 'items';

            var service = this;
            this.getModel = function() {
                if (this.model === undefined) {
                    this.model = {
                        items: []
                    };
                }
                return this.model;
            };
            this.del = function( item ) {
            	var key = item;
            	if( item.hasOwnProperty('key')){
            		key = item.key;
				}
                var defer = $q.defer();
                var service = this;
                $http({
                    method: 'DELETE',
                    url: service.url + "/" + key,
                }).success(function(data) {
                    defer.resolve(data);
                    return data;
                })
                return defer.promise;
            };
            this.get = function( item ) {
            	var key = item;
            	if( item.hasOwnProperty('key')){
            		key = item.key;
				}
                var defer = $q.defer();
                var service = this;
                $http({
                    method: 'GET',
                    url: service.url + "/" + key,
                }).success(function(payload) {
                    defer.resolve(payload);
                    return payload;
                })
                return defer.promise;
            };
            this.getAll = function() {
                var defer = $q.defer();
                var service = this;
                $http({
                    method: 'GET',
                    url: service.url
                }).success(function(payload) {
                    service.swap(payload);
                    defer.resolve(service.model);
                    return service.model;
                })
                return defer.promise;
            };
            this.put = function( item ) {
                var defer = $q.defer();
                var service = this;
                $http({
                    method: 'PUT',
                    url: service.url + "/" + item.key,
                    data: JSON.stringify(item),
                    headers: {
						'Content-Type': 'text/plain'
					}
                }).success(function(payload) {
                    defer.resolve(payload);
                    return payload;
                })
                return defer.promise;
            };
            this.post = function( item ) {
                var defer = $q.defer();
                var service = this;
                $http({
                    method: 'POST',
                    url: service.url,
                    data: JSON.stringify(item),
                    headers: {
						'Content-Type': 'text/plain'
					}
                }).success(function(payload) {
                    defer.resolve(payload);
                    return payload;
                })
                return defer.promise;
            };
            this.swap = function(arr2) {
                this.clear();
                var arr = this.model.items;
                while (arr2.length > 0) {
                    arr.push(arr2.shift());
                }
                return arr;
            };
            this.clear = function() {
                var arr = this.model.items;
                while (arr.length > 0) {
                    arr.pop();
                }
                return arr;
            };

        })
        .controller('MainCtrl', function($scope, growl, itemsSvc) {

            $scope.master = {};
            $scope.model = itemsSvc.getModel();
            $scope.update = function(item) {
                $scope.master = angular.copy(item);
                return itemsSvc.post(item)
                	.then(itemsSvc.getAll);
            };

            $scope.reset = function() {
                $scope.item = angular.copy($scope.master);
            };

            $scope.reset();
        });
});
