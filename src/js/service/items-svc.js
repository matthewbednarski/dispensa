'use strict';
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
//
define(['angular', 'moment', 'lodash', 'persist-svc', 'app'], function(angular, moment, _) {
    var app = angular.module('dispensa');
    app.service('itemsSvc', ['$http', '$q', 'persistSvc',
        function($http, $q, persistSvc) {

            this.url = 'rest/item';
            var service = this;
            this.deleteItem = function(item) {
                var defer = $q.defer();
                item.is_delete = true;
                var res = _.chain(service.getItems())
                    .filter(function(it) {
                        return it.is_delete;
                    })
                    .value();
                var p = [];
                _.forEach(res, function(it) {
                    var toDelete = this.deleteItemRest(it);
                    toDelete.then(function(item) {
                            var res = _.chain(service.getItems())
                                .remove(function(it) {
                                    return it.is_delete && it.id === item.id;
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
                                var res = _.chain(service.getItems())
                                    .remove(function(removeit) {
                                        return removeit.is_delete && removeit.id === it.id;
                                    })
                                    .value();
                                if (res !== undefined && res.length > 0) {
                                    service.persist();
                                }
                            }
                        });
                    p.push(toDelete);
                }, this);
                var pAll = $q.all(p);
                pAll.then(
                    function(it) {
                        console.log("Finished Deleting ");
                        defer.resolve("Finished Deleting ");
                    }).catch(
                    function(it) {
                        console.error("Finished Deleting: " + it);
                        defer.reject("Finished Deleting ");
                    }
                );
                return defer.promise;
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
                    .error(function(err, e1, e2, e3) {
                        defer.reject([err, e1, e2, e3]);
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
                        console.log(results);
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
                toAdd.id = UUID();
                this.getItems().push(toAdd);
                this.persist();
                return this.putItemRest(toAdd);
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
                }).error(function(data) {
                    defer.reject(new Error(data));
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
                if (this.getModel().reciept === undefined) {
                    this.getModel().reciept = {
                        store: undefined,
                        store_label: undefined,
                        reciept: undefined,
                        date: moment().format('YYYY-MM-DD')
                    };
                }
                return this.getModel().reciept;
            };
            this.setCurrentReciept = function(item) {
                this.getModel().reciept = item;
            };
            this.resetReciept = function() {
                var r = this.getCurrentReciept();
                for (var p in r) {
                    r[p] = undefined;
                    if (p === 'date') {
                        r[p] = moment().format('YYYY-MM-DD');
                    }
                }
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
                            service.getItemsRest();
                        });
                }
                return this.model;
            };
        }
    ]);
    return app;
});
