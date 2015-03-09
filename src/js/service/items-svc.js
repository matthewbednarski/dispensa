'use strict';

require(['app', 'moment', 'lodash', 'persist-svc'], function(app, moment, _) {
    app
        .service('itemsSvc', ['$http', '$q', 'persistSvc',
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
                this.newItem = function() {
                    var item = {
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
                        persistSvc.retrieve(this.persist_key)
                            .then(function(data) {
                                // model.items.push.apply(model.items, model.items.concat.apply( [], data.items));
                                // data.items = undefined;
                                // delete data.items;
                                _.assign(model.items, data.items);

                            });
                    }
                    return this.model;
                };
            }
        ]);
});
