(function() {
    var app = angular.module('dispensa')
        .controller('chart', ['$scope', 'chartable', 'lists', 'reportingSvc', Chart]);
    function Chart($scope, chartable, lists, reportingSvc) {
        // this.itemsSvc = receipts;
        this.svc = reportingSvc;
        var tableItems = _.chain(lists.allItems())
            .map(function(item) {
            	var tItem = {};
            	for(var key in item){
            		if(key !== 'items' && key.indexOf('excel') < 0){
						tItem[key] = item[key];
					}
					if(key === 'date'){
						tItem[key + '_moment'] = moment(item[key]);
						// console.log(tItem.date_moment.format());
					}
				}
            	return tItem;
            })
            .value();
        this.table = {
			name : 'Dispensa',
            items: tableItems
        };

        var ctrl = this.svc;
        this.svc.setupPropSelects();

        this.options = {
            // scaleShowVerticalLines: false,
            // scaleBeginAtZero: false
        };
        this.chartable = chartable;

        this._ = _;
        this.chartable.init( this.table);
        // this.chartable.labels = [ "test", "toost"];
        // this.chartable.data = [ 100, 50];
        console.log(this.chartable.datasets);

    }

})();
