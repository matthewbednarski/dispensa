(function() {
    angular
        .module('dispensa')
        .service('lists', ['$rootScope', '$q', 'receipts', Lists]);


    function Lists($rootScope, $q, receipts) {

        var model = {
            brands: [],
            names: [],
            labels: [],
            cities: [],
            store_labels: [],
            stores: []
        };
        return {
            getStores: getStores,
            getStoreLabels: getStoreLabels,
            getCities: getCities,
            getNames: getNames,
            getBrands: getBrands,
            getLabels: getLabels,
            loadNames: loadNames,
            loadBrands: loadBrands,
            loadLabels: loadLabels,
            loadStoreLabels: loadStoreLabels,
            loadType: loadType,
            loadItemType: loadItemType,
            loadTypes: loadTypes
        };

        function getBrands() {
            return model.brands;
        }

        function getNames() {
            return model.names;
        }

        function getLabels() {
            return model.labels;
        }

        function getCities() {
            return model.cities;
        }

        function getStores() {
            return model.stores;
        }

        function getStoreLabels() {
            return model.store_labels;
        }

        function loadBrands() {
            var store = receipts.receiptService.current.store;
            var brands = _.chain(receipts.getItems())
                .filter(function(item) {
                    return item.type === 'receipt';
                })
                .filter(function(item) {
                    return item.store === store;
                })
                .filter(function(item) {
                    return item.items !== undefined && item.items.length > 0;
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
            _.assign(model.brands, brands);
            return getBrands();
        }

        function loadNames() {
            var store = receipts.receiptService.current.store;
            var nms = _.chain(receipts.getItems())
                .filter(function(item) {
                    return item.type === 'receipt';
                })
                .filter(function(item) {
                    return item.store === store;
                })
                .filter(function(item) {
                    return item.items !== undefined && item.items.length > 0;
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
            _.assign(model.names, nms);
            return getNames();
        }

        function loadCities() {
            return loadType('cities', 'city');
        }

        function loadStoreLabels() {
            return loadType('store_labels', 'store_label');
        }

        function loadLabels() {
            return loadItemType('labels', 'label');
        }

        function loadStores() {
            return loadTypes('stores', ['store', 'city']);
        }

        function loadType(type, field) {
            var vals = _.chain(receipts.receiptService.items())
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
            _.assign(model[type], vals);
            return model[type];
        }

        function loadTypes(type, fields) {
            var vals = _.chain(receipts.receiptService.items())
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
            _.assign(model[type], vals);
            return model[type];
        }
        function loadItemType(type, field) {
            var vals = _.chain(receipts.items())
                .filter(function(item) {
                    return item.type === 'receipt';
                })
                .filter(function(item) {
                    return item.items !== undefined && item.items.length > 0;
                })
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
            _.assign(model[type], vals);
            return model[type];
        }

    }
})();
