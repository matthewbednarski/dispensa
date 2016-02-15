(function() {
    angular
        .module('dispensa')
        .factory('api', ['$rootScope', '$http', '$q', '$state', RestApi]);

    function RestApi($rootScope, $http, $q, $state) {
        var url = 'api/item';
        return {
            remove: remove,
            put: put,
            get: get
        };

        function remove(item) {
            var defer = $q.defer();
            $http({
                    method: 'DELETE',
                    url: url + '/' + item.id
                })
                .success(function(results) {
                    defer.resolve(item);
                    console.log(results);
                })
                .error(function(err, status, e2, e3) {
                    if (status !== undefined && (status === 401 || status === 403)) {
                        $state.go('login');
                    }
                    console.error(err);
                    defer.reject([err, status, e2, e3]);
                });
            return defer.promise;
        }

        function put(item) {
            var defer = $q.defer();
            $http({
                    method: 'PUT',
                    url: url + '/' + item.id,
                    data: item
                })
                .success(function(item) {
                    var res = _.chain(receipts.getItems())
                        .remove(function(it) {
                            return item.id === it.id;
                        })
                        .value();
                    item.sync = true;
                    receipts.add(item);
                    defer.resolve(item);
                })
                .error(function(err, status, e2, e3) {
                    if (status !== undefined && (status === 401 || status === 403)) {
                        $state.go('login');
                    }
                    console.error(err);
                    defer.reject([err, status, e2, e3]);
                });
            return defer.promise;
        }

        function get() {
            var defer = $q.defer();
            $http({
                    method: 'GET',
                    url: url
                })
                .success(function(results) {
                    defer.resolve(results);
                })
                .error(function(err, status, e2, e3) {
                    if (status !== undefined && (status === 401 || status === 403)) {
                        $state.go('login');
                    }
                    // console.error(err);
                    defer.reject([err, status, e2, e3]);
                });
            return defer.promise;
        }

        function merge(arr1, arr2) {
            return _.assign(arr1, _.union(arr1, arr2));
        }
    }
})();
