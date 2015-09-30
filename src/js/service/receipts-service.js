(function() {
    angular
        .module('dispensa')
        .factory('api', ['$rootScope', '$http', '$q', '$state', 'receipts', RestApi])
        .factory('item', ['$rootScope', 'persist', 'uuid', Item])
        .factory('receipt', ['$rootScope', '$q', 'persist', 'uuid', 'item', Receipt])
        .factory('receipts', ['$rootScope', '$q', 'persist', 'uuid', 'api', 'receipt', 'item', Receipts]);

    function Receipts($rootScope, $http, $q, persistSvc, uuid, api, receipt, item) {
        var list = [receipt.current];
        var persist_key = 'dispensa';

		var inited = false;

        return {
            list: list,
            getItems: getItems,
            items: getItems,
            add: addReceipt,
            addReceipt: addReceipt,
            remove: remove,
            receiptService: receipt,
            itemService: item,
            persist: persist
        };

		function doFetch(){
			if(inited){

			}
		}
		function sync(){
            var currentId = receipt.current.id;
            api.get()
                .then(function() {
                    var toCurrent = _.chain(receipts.list)
                        .find(function(rec) {
                            return rec.id === currentId;
                        })
                        .value();
                    if (toCurrent !== undefined) {
                        receipt.setCurrent(newCurrent);
                    }
                });
		}
        function getItems() {
        	if( doFetch() ){
        		sync();
			}
            return list;
        }

        function persist() {
            return persistSvc.store(persist_key, {
                items: list
            });
        }

        function restore() {
            var defer = $q.defer();
            persistSvc.retrieve(persist_key)
                .then(function(data) {
                    _.assign(list, data.items);
                    defer.resolve(list);
                }).catch(function(err) {
                    defer.reject(err);
                    console.error(err);
                });
            return defer.promise;
        }

        function remove(oRec) {
            var defer = $q.defer();
            oRec.is_delete = true;
            var it = oRec;

            var res = _.chain(list)
                .remove(function(it) {
                    return it.id === oRec.id;
                })
                .value();
            if (res !== undefined && res.length > 0) {
                persist();
                defer.resolve(res);
            } else {
                defer.reject(new Error('Nothing to remove'));
            }
            return defer.promise;
        };

        function addReceipt(oRec) {
            var defer = $q.defer();
            if (oRec === undefined) {
                oRec = receipt.new();
            }
            var existing = _.chain(list)
                .filter(function(existing) {
                    return existing.id === item.id;
                })
                .first()
                .value();
            if (existing !== undefined && existing.id === oRec.id) {
                _.assign(existing, oRec);
            } else {
                //todo: add check if item exists
                list.push(oRec);
            }
            defer.resolve(current);
            return defer.promise;
        }
    }

    function RestApi($rootScope, $http, $q, $state, receipts) {
        var url = 'api/item';
        return {
            delete: deleteRest,
            put: put,
            get: get
        };

        function delete(item) {
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
                    var res = _.chain(receipts.getItems())
                        .remove(function(item) {
                            var resKeys = _.chain(results)
                                .filter(function(rItem) {
                                    return rItem.id === item.id;
                                })
                                .value();
                            return resKeys !== undefined && resKeys.length > 0;
                        })
                        .value();

                    merge(receipts.getItems(), results);
                    defer.resolve(receipts.getItems());
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

        function merge(arr1, arr2) {
            return _.assign(arr1, _.union(arr1, arr2));
        }

    }


    function Item($rootScope, persist, uuid) {
        var current = _new();
        return {
            current: current,
            setCurrent: setCurrent,
            reset: reset,
            new: _new
        };

        function setCurrent(item) {
            item.type = 'item';
            _.merge(current, item);
            $rootScope.$broadcast('item.set.current', current);
        }

        function reset() {
            setCurrent(_new());
        }

        function _new() {
            var item = {
                type: 'item',
                id: uuid.newUuid(),
                name: undefined,
                brand: undefined,
                label: undefined,
                count: undefined,
                price: undefined,
            };
            return item;
        }
    }

    function Receipt($rootScope, $q, persist, uuid, item) {

        var current = _new();

        return {
            current: current,
            items: currentItems,
            setCurrent: setCurrent,
            new: _new,
            remove: remove,
            addItem: addItem,
            reset: reset
        };

        function addItem(oItem) {
            var defer = $q.defer();
            if (oItem === undefined) {
                oItem = item.new();
            }
            var existing = _.chain(current.items)
                .filter(function(existing) {
                    return existing.id === item.id;
                })
                .first()
                .value();
            if (existing !== undefined && existing.id === oItem.id) {
                _.assign(existing, oItem);
            } else {
                //todo: add check if item exists
                current.items.push(oItem);
            }
            defer.resolve(current);
            return defer.promise;
        }


        function remove(oItem) {
            var defer = $q.defer();
            oItem.is_delete = true;
            var it = oItem;

            var res = _.chain(list)
                .remove(function(it) {
                    return it.id === oItem.id;
                })
                .value();
            if (res !== undefined && res.length > 0) {
                persist();
                defer.resolve(res);
            } else {
                defer.reject(new Error('Nothing to remove'));
            }
            return defer.promise;
        };


        function reset() {
            setCurrent(_new());
        }

        function setCurrent(receipt) {
            receipt.type = 'receipt';
            _.assign(current.items, receipt.items);
            _.merge(current, receipt);
            item.setCurrent(current.items[0]);
            $rootScope.$broadcast('receipt.set.current', current);
        }

        function _new() {
            var receipt = {
                type: 'receipt',
                id: uuid.newUuid(),
                store: undefined,
                store_label: undefined,
                receipt: undefined,
                city: undefined,
                date: moment().format('YYYY-MM-DD'),
                items: [item.new()]
            };
            return receipt;
        }


        function currentItems() {
            return current.items;
        }
    }
})();
