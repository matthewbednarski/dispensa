'use strict';

function Login(login) {
    // var orderBy = $filter('orderBy');
    var ctl = this;
    this.submit = function() {
        var promise = login.login(ctl.username, ctl.password);

        promise
            .then(function() {
                ctl.password = undefined;
            })
            .catch(function() {
                ctl.password = undefined;
            })
        return promise;
    };
}
var app = angular
    .module('dispensa')
    .controller('LoginController', ['login', Login]);
