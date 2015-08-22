'use strict';

(function() {
    var app = angular
        .module('dispensa')
        .service('login', ['$rootScope', '$state', '$http', '$q', 'persist', 'itemsSvc', Login]);

    function Login($rootScope, $state, $http, $q, persist, itemsSvc) {
        // var orderBy = $filter('orderBy');
        var ctl = this;
        ctl.isLoggedIn = false;
        this.login_promise = undefined;
        this.login = function(username, password) {
            var defer = $q.defer();
            var auth = btoa(username + ':' + password);
            auth = 'Basic ' + auth;
            $http({
                    method: 'GET',
                    url: '/api/item',
                    headers: {
                        Authorization: auth
                    }
                })
                .then(function(res) {
                    ctl.isLoggedIn = true;
                    $http.defaults.headers.common.Authorization = auth;
                    var nextState = $state.$previousState;
                    if (nextState === undefined || nextState === '' ||
                        nextState.name === '' ||
                        nextState.name === 'login') {
                        nextState = 'insert';
                    } else if (nextState.name !== undefined) {
                        nextState = nextState.name;
                    }
                    $state.go(nextState);
                    persist.store(ctl.persist_key, {
                        header: $http.defaults.headers.common.Authorization
                    });
                    defer.resolve(res);
                }).catch(function(err) {
                    console.error(err);
            		ctl.logout();
                    defer.reject(err);
                });
            ctl.login_promise = defer.promise;
            return defer.promise;
        };
        $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
            if (to.name === 'logout') {
            	ctl.logout();
            } else if (from.name !== 'logout') {
                $state.$previousState = from;
            }
        });
        this.logout = function() {
            $http.defaults.headers.common.Authorization = undefined;
            ctl.isLoggedIn = false;
            var p = persist.remove(ctl.persist_key);
            p.then(function(){
            	console.log("success");
			});
            p.catch(function(){
            	console.error("failure");
			});
            return p;
        };

        this.persist_key = 'creds';
        persist.retrieve(this.persist_key)
            .then(function(data) {
                if (data !== undefined && data.header !== undefined) {
                    $http.defaults.headers.common.Authorization = data.header;
                    ctl.isLoggedIn = true;
                }
            });
    }
})();
