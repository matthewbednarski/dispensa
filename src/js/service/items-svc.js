'use strict';
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
//
(function() {

    angular
        .module('dispensa')
        .service('itemsSvc', ['$q', '$state', 'receiptsSvc', itemsService]);

    function itemsService($q, $state, receiptsSvc) {
        var service = this;
        this.deleteItem = function(item) {
            var defer = $q.defer();
            var remed = _.chain(receiptsSvc.getCurrentReceipt().items)
                .filter(function(citem) {
                    return citem.id === item.id;
                })
                .remove(function(citem) {
                    return citem;
                })
                .value();

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
            var found = _.chain(this.getCurrentReciept().items)
                .find(function(item) {
                    return item.id === toAdd.id;
                })
                .value();
            if (found) {
                _.assign(found, toAdd);
            } else {
                this.getCurrentReciept().items.push(toAdd);
            }
            this.persist();
            var promise = this.putItemRest(this.getCurrentReciept());
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
                    id: UUID(),
                    store: undefined,
                    store_label: undefined,
                    receipt: undefined,
                    city: undefined,
                    date: moment().format('YYYY-MM-DD'),
                    items: []
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
                id: UUID(),
                store: undefined,
                store_label: undefined,
                receipt: undefined,
                city: undefined,
                date: moment().format('YYYY-MM-DD'),
                items: []
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
            var store = this.getCurrentReciept().store;
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
            var store = this.getCurrentReciept().store;
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
                    return item;
                })
                .sortBy('date')
                .map(function(item) {
                    var price = _.chain(item.items)
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
})();
