(function() {
    angular
        .module('dispensa')
        .factory('receipts', ['$rootScope', '$q', 'persist', 'uuid', 'api', 'receipt', 'item', Receipts]);

    function Receipts($rootScope, $q, persistSvc, uuid, api, receipt, item) {
        var list = [];
        var persist_key = 'dispensa';
        var inited = false;
        angular.element(document).ready(function() {
            // sync();
        });
        $rootScope.$on('logged-in', function(evt, data) {
            sync();
        });
        return {
            list: getItems,
            getItems: getItems,
            items: getItems,
            add: addReceipt,
            addReceipt: addReceipt,
            remove: remove,
            receiptService: receipt,
            itemService: item,
            persist: persist
        };


        function save(receiptToSave) {
            if (receiptToSave === undefined) {
                receiptToSave = receipt.current;
            }
            api.put(receiptToSave)
                .then(function() {
                    persist();
                });
        }

        function doFetch() {
        	return true;
        }

        function sync() {
            var defer = $q.defer();
            var currentId = receipt.current.id;
            api.get()
                .then(function(results) {
                    var res = _.chain(list)
                        .remove(function(item) {
                            var resKeys = _.chain(results)
                                .filter(function(rItem) {
                                    return rItem.id === item.id;
                                })
                                .value();
                            return resKeys !== undefined && resKeys.length > 0;
                        })
                        .value();

                    _.merge(list, results);
                    var toCurrent = _.chain(list)
                        .find(function(rec) {
                            return rec.id === currentId;
                        })
                        .value();
                    if (toCurrent !== undefined) {
                        receipt.setCurrent(newCurrent);
                    }
                    defer.resolve(list);
                })
                .catch(function(err) {
                    defer.reject(err);
                });
            return defer.promise;
        }

        function getItems() {
            if (doFetch()) {
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
                oRec = receipt.newReceipt();
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
                list.push(_.cloneDeep(oRec));
            }
            defer.resolve(oRec);
            return defer.promise;
        }

        function merge(arr1, arr2) {
            return _.assign(arr1, _.union(arr1, arr2));
        }
    }
})();
