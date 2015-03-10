'use strict';
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
//
define(['angular', 'moment', 'lodash', 'persist-svc', 'app'], function(angular, moment, _) {
    var app = angular.module('dispensa');
    app.service('itemsSvc', ['$http', '$q', 'persistSvc',
        function($http, $q, persistSvc) {

            this.persist_key = 'items';
            this.getCurrentReciept = function() {
                if (this.getModel().reciept === undefined) {
                    this.getModel().reciept = {
                        store: undefined,
                        store_label: undefined,
                        date: moment().format('YYYY-MM-DD')
                    };
                }
                return this.getModel().reciept;
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
            this.getCurrentItem = function() {
                if (this.getModel().item === undefined) {
                    this.getModel().item = this.newItem();
                }
                return this.getModel().item;
            };
            this.resetItem = function() {
                _.assign(this.getItem(), this.newItem());
            };

            this.s4 = function() {
                console.log(Math.random());
                var b = Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
                return b;
            };
            this.uuid = function() {
                var s4 = this.s4;
                var a = s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
                return a;
            };

            function e2() {
                var u = '',
                    m = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
                    i = 0,
                    rb = Math.random() * 0xffffffff | 0;
                while (i++ < 36) {
                    var c = m[i - 1],
                        r = rb & 0xf,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    u += (c == '-' || c == '4') ? c : v.toString(16);
                    rb = i % 8 == 0 ? Math.random() * 0xffffffff | 0 : rb >> 4
                }
                return u
            };

            function generateUUID() {
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
                    id: generateUUID(),
                    name: undefined,
                    brand: undefined,
                    label: undefined,
                    count: 1,
                    price: 0.00
                };
                return item;
            };
            this.addItem = function(item) {
                var toAdd = _.cloneDeep(item);
                var r = this.getCurrentReciept();
                for (var p in r) {
                    if (p !== 'price') {
                        toAdd[p] = r[p];
                    }
                }
                toAdd.id = generateUUID();
                this.getItems().push(toAdd);
                persistSvc.store(this.persist_key, this.getModel());
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
                    persistSvc.store(this.persist_key, this.model);
                    // persistSvc.retrieve(this.persist_key)
                    //     .then(function(data) {
                    //         // model.items.push.apply(model.items, model.items.concat.apply( [], data.items));
                    //         // data.items = undefined;
                    //         // delete data.items;
                    //         _.assign(model.items, data.items);
                    //
                    //     });
                }
                return this.model;
            };
        }
    ]);
    return app;
});
