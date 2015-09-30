'use strict';

(function() {

    angular
        .module('dispensa')
        .service('reportingSvc', ['receipts','receipt','item','lists',  ReportingService]);

    function ReportingService(receipts, receipt, item, lists) {
        var ctrl = this;
        this.filter = {
            date: {
                begin: moment().subtract(3, 'months').format('DD MMMM YYYY'),
                end: moment().format('DD MMMM YYYY')
            },
            moment: {
                begin: moment().subtract(3, 'months'),
                end: moment()
            }
        };
        var props = ['brand', 'store', 'city', 'label', 'store_label'];
        this.month_years = [];
        this.brand_list = [];
        this.store_list = [];
        this.city_list = [];
        this.label_list = [];
        this.store_label_list = [];

        this.dateChange = function(filter, type, newVal) {
            var m = moment(newVal);
            filter.moment[type] = m;
            filter.date[type] = m.format('DD MMMM YYYY');
        };
        this.extractProperty = function(prop, propValArrName) {
            var mY = _.chain(receipts.items())
                .map(function(item) {
                    return item[prop];
                })
                .filter(function(item) {
                    return item !== undefined && item !== "";
                })
                .unique()
                .map(function(item) {
                    var key = item;
                    var text = item;
                    return {
                        key: key,
                        text: text
                    }
                })
                .sortBy(function(out) {
                    return out.key;
                })
                .value();

            if (propValArrName === undefined) {
                propValArrName = prop + '_list';
            }
            _.assign(this[propValArrName], mY);
            return this[propValArrName];
        };
        this.setupPropSelects = function() {
            for (var i = 0; i < props.length; i++) {
                var propValArrName = props[i] + '_list';
                if (this[propValArrName] === undefined) {
                    this[propValArrName] = [];
                }
                this.extractProperty(props[i]);
            }
        };

        this.filterDate = function(date) {
            var min = ctrl.filter.moment.begin;
            var max = ctrl.filter.moment.end;
            var d = moment(date);

            return d.isBetween(min, max);
        };
        this.itemFilter = function(item, index, array) {

            var fItem = item;
            for (var key in item) {
                if (key === 'date') {
                    if (!ctrl.filterDate(item[key])) {
                        return;
                    }
                } else if (ctrl.filter[key] !== undefined &&
                    ctrl.filter[key].key !== undefined) {
                    if (item[key] !== ctrl.filter[key].key) {
                        return;
                    }
                }
            }
            return fItem;
        };
    }
})();
