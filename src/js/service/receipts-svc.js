'use strict';
(function() {
    angular
        .module('dispensa')
        .service('itemsSvc', ['$rootScope', '$http', '$q', '$state', 'persist', 'uuid', receiptsService]);

    function receiptsService($rootScope, $http, $q, $state, persistSvc, uuid) {
        this.url = 'api/item';
        var service = this;
        this.addReceipt = function(item) {
            var toAdd = _.cloneDeep(item);
            var r = this.getCurrentReceipt();
            var found = _.chain(this.getItems())
                .find(function(item) {
                    return item.id === toAdd.id;
                })
                .value();
            if (found) {
                _.assign(found, toAdd);
            } else {
                this.getItems().push(toAdd);
            }
            this.persist();
            var promise = this.putRest(toAdd);
            promise.then(function(item) {
            	service.setCurrentReceipt(item);
                return service.loadStores();
            });
            return promise;
        };
        this.addItem = function(item) {
            var defer = $q.defer();
            if (item === undefined) {
                item = service.newItem();
            }
            var existing = _.chain(this.getCurrentReceipt().items)
                .filter(function(existing) {
                    return existing.id === item.id;
                })
                .first()
                .value();
            if (existing !== undefined && existing.id === item.id) {
                _.assign(existing, item);
            } else {
                //todo: add check if item exists
                this.getCurrentReceipt().items.push(item);
            }
            defer.resolve(this.getCurrentReceipt());
            return defer.promise;
        };
        this.getRest = function() {
            var defer = $q.defer();
            $http({
                    method: 'GET',
                    url: this.url
                })
                .success(function(results) {
                    var res = _.chain(service.getItems())
                        .remove(function(item) {
                            var resKeys = _.chain(results)
                                .filter(function(rItem) {
                                    return rItem.id === item.id;
                                })
                                .value();
                            return resKeys !== undefined && resKeys.length > 0;
                        })
                        .value();

                    merge(service.getItems(), results);
                    defer.resolve(service.getItems());
                    service.persist();
                    //   console.log(results);
                })
                .error(function(err) {
                    console.error(err);
                    defer.reject(err);
                });
            return defer.promise;
        };
        this.deleteReceipt = function(item) {
            var defer = $q.defer();
            item.is_delete = true;
            var it = item;
            var toDelete = this.deleteRest(item);
            toDelete
                .then(function(item) {
                    var res = _.chain(service.getItems())
                        .remove(function(it) {
                            return it.id === item.id;
                        })
                        .value();
                    if (res !== undefined && res.length > 0) {
                        service.persist();
                    }
                })
                .catch(function(errorArr) {
                    console.log(errorArr);
                    if (errorArr.length > 1 && errorArr[1] === 404) {
                        console.log("Got 404 Not Found, deleting locally");
                    }
                });
            return toDelete;
        };
        this.deleteRest = function(item) {
            var defer = $q.defer();
            $http({
                    method: 'DELETE',
                    url: this.url + '/' + item.id
                })
                .success(function(results) {
                    defer.resolve(item);
                    console.log(results);
                })
                .error(function(err, status, e2, e3) {
                    if (status !== undefined && (status === 401 || status === 403)) {
                        $state.go('login');
                    }
                    defer.reject([err, status, e2, e3]);
                });
            return defer.promise;
        };

        this.putRest = function(item) {
            var defer = $q.defer();
            var p = $http({
                method: 'PUT',
                url: service.url + '/' + item.id,
                data: item
            });
            p.success(function(item) {
                var res = _.chain(service.getItems())
                    .remove(function(it) {
                        return item.id === it.id;
                    })
                    .value();
                item.sync = true;
                service.getItems().push(item);
                defer.resolve(item);
                service.persist();
            }).error(function(data, status) {
                if (status !== undefined && (status === 401 || status === 403)) {
                    $state.go('login');
                }
                defer.reject(data);
            });
            return defer.promise;
        };

        this.persist = _.bind(function() {
            return persistSvc.store(this.persist_key, this.getModel());

        }, this);


        this.persist_key = 'receipts';

        this.getCurrentItem = function() {
            if (this._current_item === undefined) {
                if (this.getCurrentReceipt().items.length === 0) {
                    this.addItem();
                }
                this._current_item = this.getCurrentReceipt().items[0];
            }
            return this._current_item;
        };
        this.setCurrentItem = function(item) {
            this._current_item = item;
            if (!_.isNaN(parseFloat(item.price))) {
                item.price = parseFloat(item.price);
            }
            if (!_.isNaN(parseFloat(item.count))) {
                item.count = parseFloat(item.count);
            }
            $rootScope.$broadcast('itemChanged', _.clone(item));
        };
        this.getCurrentReceipt = function() {
            if (this.getModel().receipt === undefined) {
                this.getModel().receipt = this.newReceipt();
            }
            return this.getModel().receipt;
        };
        this.setCurrentReceipt = function(item) {
            this.getModel().receipt = item;
            $rootScope.$broadcast('receiptChanged', item);
        };
        this.resetReceipt = function() {
            var r = this.getCurrentReceipt();
            // _.assign(this.getModel().receipt, this.newReceipt());
            this.getModel().receipt = this.newReceipt();
            $rootScope.$broadcast('receiptChanged', this.getModel().receipt);
            // return this.getCurrentReceipt();
        };

        this.newReceipt = function() {
            var receipt = {
                id: uuid.newUuid(),
                store: undefined,
                store_label: undefined,
                receipt: undefined,
                city: undefined,
                date: moment().format('YYYY-MM-DD'),
                items: []
            };
            // receipt.items.push(this.newItem());
            return receipt;
        };
        this.newItem = function() {
            var item = {
                id: uuid.newUuid(),
                name: undefined,
                brand: undefined,
                label: undefined,
                count: undefined,
                price: undefined,
            };
            return item;
        };

        function merge(arr1, arr2) {
            return _.assign(arr1, _.union(arr1, arr2));
        }

        // this.getReceipts = function() {
        //     return this.getModel().items;
        // };
        this.getItems = function() {
            return this.getModel().items;
        };
        this.getModel = function() {
            if (this.model === undefined) {
                this.model = {
                    items: []
                };
                var model = this.model;
                persistSvc.retrieve(this.persist_key)
                    .then(function(data) {
                        _.assign(model.items, data.items);
                        service.getRest()
                            .
                        finally(function() {
                            console.log("got it no catch");
                        });
                    })
                    .
                catch(function(err) {
                    service.getRest()
                        .
                    finally(function() {
                        console.log("got it catch");
                    });
                });
            }
            return this.model;
        };
        this.loadTypes = function(type, fields) {
            var vals = _.chain(this.getItems())
                .uniq(function(item) {
                    var o = "";
                    _.forEach(fields, function(field) {
                        if (this.hasOwnProperty(field)) {
                            o += this[field];
                        }
                    }, item);
                    return o;
                })
                .sortBy(function(item) {
                    var o = "";
                    _.forEach(fields, function(field) {
                        if (this.hasOwnProperty(field)) {
                            o += this[field];
                        }
                    }, item);
                    return o;
                })
                .map(function(item) {
                    var o = _.clone(item);
                    _.forEach(fields, function(field) {
                        if (this.hasOwnProperty(field)) {
                            if (o.key === undefined) {
                                o.key = this[field];
                            } else {
                                o.key += ' - ' + this[field];
                            }
                        }
                    }, item);
                    return o;
                })
                .value();
            _.assign(this.getModel()[type], vals);
            return this.getModel()[type];
        };
        this.loadItemType = function(type, field) {
            var vals = _.chain(this.getItems())
                .map(function(rec) {
                    return rec.items;
                })
                .flatten()
                .filter(function(item) {
                    if (item.hasOwnProperty(field)) {
                        return true;
                    }
                })
                .map(function(item) {
                    return item[field];
                })
                .uniq(function(item) {
                    return item;
                })
                .sortBy(function(item) {
                    return item;
                })
                .filter(function(item) {
                    return item !== undefined
                })
                .value();
            _.assign(this.getModel()[type], vals);
            return this.getModel()[type];
        };
        this.loadType = function(type, field) {
            var vals = _.chain(this.getItems())
                .filter(function(item) {
                    if (item.hasOwnProperty(field)) {
                        return true;
                    }
                })
                .map(function(item) {
                    return item[field];
                })
                .uniq(function(item) {
                    return item;
                })
                .sortBy(function(item) {
                    return item;
                })
                .filter(function(item) {
                    return item !== undefined
                })
                .value();
            _.assign(this.getModel()[type], vals);
            return this.getModel()[type];
        };
        this.getBrands = function() {
            if (this.getModel().brands === undefined) {
                this.getModel().brands = [];
            }
            return this.getModel().brands;
        };
        this.getNames = function() {
            if (this.getModel().names === undefined) {
                this.getModel().names = [];
            }
            return this.getModel().names;
        };
        this.getLabels = function() {
            if (this.getModel().labels === undefined) {
                this.getModel().labels = [];
            }
            return this.getModel().labels;
        };
        this.getCities = function() {
            if (this.getModel().cities === undefined) {
                this.getModel().cities = [];
            }
            return this.getModel().cities;
        };
        this.getStores = function() {
            if (this.getModel().stores === undefined) {
                this.getModel().stores = [];
            }
            return this.getModel().stores;
        };
        this.getStoreLabels = function() {
            if (this.getModel().store_labels === undefined) {
                this.getModel().store_labels = [];
            }
            return this.getModel().store_labels;
        };
        this.loadBrands = function() {
            var store = this.getCurrentReceipt().store;
            var brands = _.chain(this.getItems())
                .filter(function(item) {
                    return item.store === store;
                })
                .map(function(rec) {
                    return rec.items;
                })
                .flatten()
                .uniq(function(item) {
                    return item.brand;
                })
                .sortBy(function(item) {
                    return item.brand;
                })
                .filter(function(item) {
                    return item.brand !== undefined
                })
                .map(function(item) {
                    return item.brand;
                })
                .value();
            _.assign(this.getModel().brands, brands);
            return this.getBrands();
        };
        this.loadNames = function() {
            var store = this.getCurrentReceipt().store;
            var names = _.chain(this.getItems())
                .filter(function(item) {
                    return item.store === store;
                })
                .map(function(rec) {
                    return rec.items;
                })
                .flatten()
                .uniq(function(item) {
                    return item.name;
                })
                .sortBy(function(item) {
                    return item.name;
                })
                .filter(function(item) {
                    return item.name !== undefined
                })
                .map(function(item) {
                    return item.name;
                })
                .value();
            _.assign(this.getModel().names, names);
            return this.getNames();
        };
        this.loadCities = function() {
            return this.loadType('cities', 'city');
        };
        this.loadStoreLabels = function() {
            return this.loadType('store_labels', 'store_label');
        };
        this.loadLabels = function() {
            return this.loadItemType('labels', 'label');
        };
        this.loadStores = function() {
            return this.loadTypes('stores', ['store', 'city']);
        };
        this.getLabels = function() {
            if (this.getModel().labels === undefined) {
                this.getModel().labels = [];
            }
            return this.getModel().labels;
        };
        this.labels = function() {
            var labels = _.chain(this.getItems())
                .groupBy("label")
                .map(function(value, key) {
                    return [key, _.reduce(value, function(result, currentObject) {
                        return {
                            price: result.price + (currentObject.price * currentObject.count)
                        }
                    }, {
                        price: 0
                    })];
                })
                .object()
                .value();
            labels = _.chain(_.keys(labels))
                .map(function(key) {
                    return {
                        label: key,
                        price: labels[key].price
                    }
                })
                .value();
            _.assign(this.getLabels(), labels);
            return this.getLabels();
        };
    }
})();
