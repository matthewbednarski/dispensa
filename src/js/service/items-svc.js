'use strict';
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
//
function itemsService($http, $q, $state, persistSvc) {

    this.url = 'api/item';
    var service = this;
    this.deleteReceipt = function(receipt) {
        // { "date", "store", "store_label", "city", "receipt"}
        var defer = $q.defer();
        var items_to_delete = _.chain(service.getItems())
            .filter(function(item) {
                return item.date === receipt.date;
            })
            .filter(function(item) {
                return item.store === receipt.store;
            })
            .filter(function(item) {
                return item.city === receipt.city;
            })
            .filter(function(item) {
                return item.receipt === receipt.receipt;
            })
            .value();

        var deleted_ids = _.chain(items_to_delete)
            .map(function(item) {
                return item.id;
            })
            .value();
        var deleted_defereds = _.chain(items_to_delete)
            .map(function(item) {
                return service.deleteItem(item);
            })
            .value();

        defer.resolve([deleted_ids, deleted_defereds]);
        return defer.promise;
    };
    this.deleteItem = function(item) {
        var defer = $q.defer();
        item.is_delete = true;
        var it = item;
        // var res = _.chain(service.getItems())
        //     .filter(function(it) {
        //         return it.is_delete;
        //     })
        //     .value();
        var toDelete = this.deleteItemRest(item);
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
    this.deleteItemRest = function(item) {
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
    this.getItemsRest = function() {
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
            .error(function(err, status) {
                console.error(err);
                if (status !== undefined && (status === 401 || status === 403)) {
                    $state.go('login');
                }
                defer.reject(err);
            });
        return defer.promise;
    };
    this.addItem = function(item) {
        var toAdd = _.cloneDeep(item);
        var r = this.getCurrentReciept();
        for (var p in r) {
            if (p !== 'price') {
                toAdd[p] = r[p];
            }
        }
        // toAdd.id = UUID();
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
        var promise = this.putItemRest(toAdd);
        promise.then(function(item) {
            return service.loadStores();
        });
        return promise;
    };
    this.putItemRest = function(item) {
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

    function merge(arr1, arr2) {
        return _.assign(arr1, _.union(arr1, arr2));

    }
    this.persist = _.bind(function() {
        return persistSvc.store(this.persist_key, this.getModel());

    }, this);


    this.persist_key = 'items';
    this.getCurrentReciept = function() {
        if (this.getModel().receipt === undefined) {
            this.getModel().receipt = {
                store: undefined,
                store_label: undefined,
                receipt: undefined,
                city: undefined,
                date: moment().format('YYYY-MM-DD')
            };
        }
        return this.getModel().receipt;
    };
    this.setCurrentReciept = function(item) {
        this.getModel().receipt = item;
    };
    this.resetReciept = function() {
        var r = this.getCurrentReciept();
        var new_r = {
            store: undefined,
            store_label: undefined,
            receipt: undefined,
            city: undefined,
            date: moment().format('YYYY-MM-DD')
        };
        _.assign(this.getModel().receipt, new_r);
        return this.getCurrentReciept();
    };
    this.setCurrentItem = function(item) {
        this.getModel().item = item;
    };
    this.getCurrentItem = function() {
        if (this.getModel().item === undefined) {
            this.getModel().item = this.newItem();
        }
        return this.getModel().item;
    };
    this.resetItem = function() {
        _.assign(this.getCurrentItem(), this.newItem());
        return this.getCurrentItem();
    };



    function UUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };
    this.newItem = function() {
        var item = {
            id: UUID(),
            name: undefined,
            brand: undefined,
            label: undefined,
            count: undefined,
            price: undefined,
        };
        return item;
    };
    this.hasItem = function(item) {
        var existing = _.chain(this.getItems())
            .filter(function(lstItem) {
                var r = true;
                for (var k in lstItem) {
                    if (k === 'date') {
                        var lstD = moment(lstItem[k]);
                        var itD = moment(item[k]);
                        if (!lstD.isSame(itD, 'day')) {
                            return false;
                        }
                    } else if (k === 'label') {

                    } else {
                        if (lstItem[k] !== item[k]) {
                            return false;
                        }
                    }
                }
                return r;
            })
            .value();
        if (existing !== undefined && existing.length > 0) {
            return true;
        }
        return false;
    };

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
                    service.getItemsRest()
                        .
                    finally(function() {
                        console.log("got it no catch");
                        service.loadStores();
                        service.loadReceipts();
                    });
                })
                .
            catch(function(err) {
                service.getItemsRest()
                    .
                finally(function() {
                    console.log("got it catch");
                    service.loadStores();
                    service.loadReceipts();
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
        var store = this.getCurrentReciept().store;
        var brands = _.chain(this.getItems())
            .filter(function(item) {
                return item.store === store;
            })
            .uniq(function(item) {
                return item.brand;
            })
            .sortBy(function(item) {
                return item.brand;
            })
            .map(function(item) {
                return item.brand;
            })
            .value();
        _.assign(this.getModel().brands, brands);
        return this.getBrands();
    };
    this.loadNames = function() {
        var store = this.getCurrentReciept().store;
        var names = _.chain(this.getItems())
            .filter(function(item) {
                return item.store === store;
            })
            .uniq(function(item) {
                return item.name;
            })
            .sortBy(function(item) {
                return item.name;
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
        return this.loadType('labels', 'label');
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
    this.getReceipts = function() {
        if (this.getModel().receipts === undefined) {
            this.getModel().receipts = [];
        }
        return this.getModel().receipts;
    };
    this.loadReceipts = function() {
        var r = this.receipts();
        _.assign(this.getModel().receipts, r);
    };
    this.receipts = function() {
        var items = this.getItems();
        var r = _.chain(items)
            .map(function(item) {
                return {
                    'store': item.store,
                    'store_label': item.store_label,
                    'date': item.date,
                    'receipt': item.receipt,
                    'city': item.city,
                };
            })
            .uniq(function(item) {
                return JSON.stringify(item);
            })
            .sortBy('date')
            .map(function(item) {
                var price = _.chain(items)
                    .filter(function(receipt) {
                        var props = ['store', 'date', 'city', 'receipt'];
                        var isReceipt = true;
                        for (var i = 0; i < props.length; i++) {
                            var prop = props[i];
                            if (item[prop] !== receipt[prop]) {
                                isReceipt = false;
                                break;
                            }
                        }
                        return isReceipt;
                    })
                    .reduce(function(memo, r_item, index, col) {
                        var p = r_item.count * r_item.price;
                        memo += p;
                        return memo;
                    }, 0)
                    .value();
                item.price = price;
                return item;

            })
            .value();

        return r;
    };
}
angular
    .module('dispensa')
    .service('itemsSvc', ['$http', '$q', '$state', 'persistSvc', itemsService]);
