'use strict';
require.config({
    paths: {
        // +AMD jquery: 'libs/jquery/dist/jquery',
        jquery: 'libs/jquery/dist/jquery',
        lodash: 'libs/lodash/lodash',
        moment: 'libs/moment/moment',
        i18next: 'libs/i18next/i18next.amd.withJQuery',
        offline: 'libs/offline/offline.min',
        pouchdb: 'libs/pouchdb/dist/pouchdb',

        // -AMD
        angular: 'libs/angular/angular',
        'angular-translate': 'libs/angular-translate/angular-translate',
        'angular-i18n': 'libs/angular-i18n/angular-locale_en-us',
        bootstrap: 'libs/bootstrap/dist/js/bootstrap',
        'bootstrap-datepicker': 'libs/bootstrap-datepicker/js/bootstrap-datepicker',
        'allmighty-autocomplete': 'libs/allmighty-autocomplete/script/autocomplete'

    },
    shim: {
        angular: {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-i18n': {
            deps: ['angular']
        },
        'allmighty-autocomplete': {
            deps: ['angular']
        },
        'angular-translate': {
            deps: ['angular']
        },
        bootstrap: {
            deps: ['jquery']
        },
        'bootstrap-datepicker': {
            deps: ['bootstrap']
        }
    }
});




require(['app', 'pouchdb', 'moment', 'bootstrap', 'bootstrap-datepicker'], function(app, pouchdb, moment) {
    app
        .controller('ctrl', ['$scope',
            function($scope) {
                $scope.greetMe = 'World';
            }
        ])
    app.service('persistSvc', ['$q',
        function($q) {
        	var persist = this;
            this.getDb = function() {
                if (this.db === undefined) {
                    this.db = new pouchdb("dispensa");
                }
                return this.db;
            };
            this.remove = function(key) {
                var defer = $q.defer();
                this.getDb().get(key)
                    .then(function(doc) {
						persist.getDb().remove(doc)
							.then(defer.resolve)
							.catch(defer.reject);
                    })
                    .catch(function(error) {
                        defer.resolve( "No doc with id: " + key + ' found');
                    });
                return defer.promise;
            };
            this.store = function(key, obj) {
                var defer = $q.defer();
                var sData = JSON.stringify(obj);
                this.getDb().get(key)
                    .then(function(doc) {
                    	doc.data = sData;
                        persist.getDb().put(doc)
                        	.then(defer.resolve)
                        	.catch(defer.reject);
                    })
                    .catch(function(error) {
                        persist.getDb().put({
                            '_id': key,
                            'data': sData
                        })
                        .then(defer.resolve)
						.catch(defer.reject);
                    });
                return defer.promise;
            };
            this.retrieve = function(key) {
                var defer = $q.defer();
                this.getDb().get(key)
                    .then(function(doc) {
                        if (doc.hasOwnProperty('data')) {
                            var data = JSON.parse(doc.data);
                            defer.resolve(data);
                        } else {
                            defer.resolve(doc);
                        }
                    })
                    .catch(function(error) {
                        defer.reject(error);
                    });
                return defer.promise;
            };
        }
    ])

    .service('itemsSvc', ['$http', '$q', 'persistSvc',
            function($http, $q, persistSvc) {

				this.persist_key = 'items';
                this.getCurrentReciept = function() {
                    if (this.getModel().reciept === undefined) {
                        this.getModel().reciept = {
                            store: undefined,
                            store_label: undefined,
                            date: moment().format('YYYY-MM-DD')
                        }
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

                function convertToUtc(str) {
                    var date = new Date(str);
                    var year = date.getUTCFullYear();
                    var month = date.getUTCMonth() + 1;
                    var dd = dategetUTCDate();
                    var hh = date.getUTCHours();
                    var mi = date.getUTCMinutes();
                    var sec = date.getUTCSeconds();

                    // 2010-11-12T13:14:15Z
                    theDate = year + "-" + (month[1] ? month : "0" + month[0]) + "-" +
                        (dd[1] ? dd : "0" + dd[0]);
                    theTime = (hh[1] ? hh : "0" + hh[0]) + ":" + (mi[1] ? mi : "0" + mi[0]);
                    return [theDate, theTime].join("T");
                }
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
                        	.then(function(data){
                        		// model.items.push.apply(model.items, model.items.concat.apply( [], data.items));
                        		// data.items = undefined;
                        		// delete data.items;
                        		_.assign(model.items, data.items);
                        		
							});
                    }
                    return this.model;
                };
            }
        ])
        .controller('RecieptController', ['$scope', 'itemsSvc',
            function($scope, itemsSvc) {
                $scope.item = itemsSvc.getCurrentReciept();
                $scope.reset = function() {
                    itemsSvc.resetReciept();
                };
                $scope.loadType = function(type, field) {
                    var vals = _.chain(itemsSvc.getItems())
                        .map(function(item) {
                            return item[field];
                        })
                        .unique()
                        .sort()
                        .value();
                    while ($scope[type].length > 0) {
                        $scope[type].pop();
                    }
                    _.forEach(vals, function(item) {
                        if (this.indexOf(item) < 0) {
                            this.push(item);
                        }
                    }, $scope[type]);
                    return $scope[type];
                };
                $scope.store_labels = [];
                $scope.loadStoreLabels = function() {
                    return $scope.loadType('store_labels', 'store_label');
                };
                $scope.stores = [];
                $scope.loadStores = function() {
                    return $scope.loadType('stores', 'store');
                };
                $scope.findPreviousLabel = function() {
                    var r = itemsSvc.getCurrentReciept();
                    var hasReciept = (r.store !== undefined && r.store !== "") ? true : false;
                    var vals = _.chain(itemsSvc.getItems())
                        .filter(function(item) {
                            if (hasReciept) {
                                return item.store === r.store;
                            }
                            return item.store_label !== undefined && item.store_label !== '';
                        })
                        .map(function(item) {
                            return item.store_label;
                        })
                        .value();

                    return vals;
                };
                $scope.$watch(function() {
                    return itemsSvc.model.reciept.store;
                }, function() {
                    var _i = $scope.findPreviousLabel();
                    if (_i.length > 0) {
                        itemsSvc.model.reciept.store_label = _i[0];
                    }
                });
                $scope.$watch(function() {
                    return itemsSvc.model.items.length;
                }, function() {
                    $scope.loadStores();
                    $scope.loadStoreLabels();
                });

            }
        ])
        .controller('ItemController', ['$scope', 'itemsSvc',
            function($scope, itemsSvc) {
                $scope.names = ['test', 'test2', 'abc', 'bd'];
                $scope.item = itemsSvc.getCurrentItem();
                $scope.update = function(item) {
                    itemsSvc.addItem(item);
                };
                $scope.reset = function() {
                    $scope.item = itemsSvc.resetItem();
                };
                $scope.names = [];
                $scope.loadNames = function() {
                    var r = itemsSvc.getCurrentReciept();
                    var hasStore = (r.store !== undefined && r.store !== "") ? true : false;
                    var vals = _.chain(itemsSvc.getItems())
                        .filter(function(item) {
                            if (hasStore) {
                                return item.store === r.store;
                            }
                            return true;
                        })
                        .map(function(item) {
                            return item.name;
                        })
                        .unique()
                        .sort()
                        .value();
                    while ($scope.names.length > 0) {
                        $scope.names.pop();
                    }
                    _.forEach(vals, function(item) {
                        if (this.indexOf(item) < 0) {
                            this.push(item);
                        }
                    }, $scope.names);
                    return $scope.names;
                };
                $scope.findPreviousItem = function() {
                    var i = itemsSvc.getCurrentItem();
                    var r = itemsSvc.getCurrentReciept();
                    var hasItem = (r.name !== undefined && r.name !== "") ? true : false;
                    var hasReciept = (r.store !== undefined && r.store !== "") ? true : false;
                    var vals = _.chain(itemsSvc.getItems())
                        .filter(function(item) {
                            if (hasItem && hasReciept) {
                                return item.name === i.name && item.store === r.store;
                            }
                            return false;
                        })
                        .value();

                    return vals;
                };
                $scope.brands = [];
                $scope.loadBrands = function() {
                    var r = itemsSvc.getCurrentItem();
                    var hasItem = (r.name !== undefined && r.name !== "") ? true : false;
                    var vals = _.chain(itemsSvc.getItems())
                        .filter(function(item) {
                            if (hasItem) {
                                return item.name === r.name;
                            }
                            return true;
                        })
                        .map(function(item) {
                            return item.brand;
                        })
                        .unique()
                        .sort()
                        .value();
                    while ($scope.brands.length > 0) {
                        $scope.brands.pop();
                    }
                    _.forEach(vals, function(item) {
                        if (this.indexOf(item) < 0) {
                            this.push(item);
                        }
                    }, $scope.brands);
                    return $scope.brands;
                };
                $scope.$watch(function() {
                    return itemsSvc.model.item.name;
                }, function() {
                    var _items = $scope.findPreviousItem();
                    if (_items.length > 0) {
                        var it = _items[0];
                        itemsSvc.model.item.brand = it.brand;
                        itemsSvc.model.item.count = it.count;
                        itemsSvc.model.item.label = it.label;
                        itemsSvc.model.item.price = it.price;
                    }
                });
                $scope.$watch(function() {
                    return itemsSvc.model.reciept.store;
                }, function() {
                    $scope.loadNames();
                });
                $scope.$watch(function() {
                    return itemsSvc.model.items.length;
                }, function() {
                    $scope.loadNames();
                });
            }
        ])
        .controller('ItemsController', ['$scope', '$filter', 'itemsSvc',
            function($scope, $filter, itemsSvc) {
                var orderBy = $filter('orderBy');
                $scope.model = itemsSvc.getModel();
                $scope.items = itemsSvc.getItems();
                $scope.order = function(predicate, reverse) {
                    $scope.items = orderBy($scope.items, predicate, reverse);
                };
                $scope.setSelected = function(item) {
                    itemsSvc.getCurrentReciept().date = item.date;
                    itemsSvc.getCurrentReciept().store = item.store;
                    itemsSvc.getCurrentReciept().store_label = item.store_label;
                    itemsSvc.getCurrentItem().name = item.name;
                    itemsSvc.getCurrentItem().brand = item.brand;
                    itemsSvc.getCurrentItem().label = item.label;
                    itemsSvc.getCurrentItem().count = item.count;
                    itemsSvc.getCurrentItem().price = item.price;
                };
                // $scope.order('-name', false);
            }
        ]);
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['dispensa']);
    });
});
