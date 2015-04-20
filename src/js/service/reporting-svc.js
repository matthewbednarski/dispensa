'use strict';

function ReportingService(itemsSvc) {
    var ctrl = this;
    this.filter = {
        date: {}
    };
    var props = ['brand', 'store', 'city', 'label', 'store_label'];
    this.month_years = [];
    this.brand_list = [];
    this.store_list = [];
    this.city_list = [];
    this.label_list = [];
    this.store_label_list = [];

    this.extractMonthYears = function() {
        var mY = _.chain(itemsSvc.getItems())
            .map(function(item) {
                return item.date;
            })
            .unique()
            .map(function(date) {
                return moment(date);
            })
            .map(function(moment) {
                var key = moment.format('YYYY-MM');
                var text = moment.format('MMM YYYY');
                return {
                    key: key,
                    text: text
                }
            })
            .unique(function(out) {
                return out.key;
            })
            .sortBy(function(out) {
                return out.key;
            })
            .value();

        _.assign(this.month_years, mY);
        return this.month_years;
    };
    this.extractProperty = function(prop, propValArrName) {
        var mY = _.chain(itemsSvc.getItems())
            .map(function(item) {
                return item[prop];
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

    this.itemFilter = function(item, index, array) {

        var fItem = item;
        for (var key in item) {
            if (key === 'date') {

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
angular
    .module('dispensa')
    .service('reportingSvc', ['itemsSvc', ReportingService]);
