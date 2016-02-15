(function() {
    console.log("Creating module dsdd");
    var app = angular.module('mcbChart', ['chart.js'])
        .factory('chartable', Chartable);

    function Chartable() {
        var data = [];
        var series = [];
        var chart_labels = [];
        var labels = [];
        var datasets = {};

        return {
            data: data,
            labels: labels,
            legend: true,
            datasets: datasets,
            series: series,
            chart_labels: chart_labels,
            update: update,
            init: init
        };


        function init(tableData) {
            var tmp = _.chain(tableData.items)
                .sortBy(function(item) {
                    return item.date;
                })
                .map(function(item) {
                    item.year_month = item.date_moment.format('YYYY-MM');
                    return item
                })
                .groupBy('year_month')
                .value();
            _.assign(datasets, tmp);
            _.remove(series);
            series.push(tableData.name);
			update();
        }

        function update(inkey) {
            _.remove(data);
            _.remove(chart_labels);
            var dataset = undefined;
            if(inkey !== undefined){
            	dataset = getDataset(inkey, 'store');
			}else{
				dataset = datasets;
			}
            var dMap = _.chain(_.keys(dataset))
                .map(function(key) {
                    var prices = _.chain(dataset[key])
                        .map(function(item) {
                            return item.price * item.count
                        })
                        .value();
                    var total = _.reduce(prices, function(sum, p) {
                        return sum + p;
                    }, 0);
                    return total >= 0 ? round(total) : 0;
                })
                .value();
            _.assign(chart_labels, _.keys(dataset));
            _.assign(data, dMap);
        }

        function getDataset(inkey, groupBy) {
            var tmp = _.chain(datasets[inkey])
                .sortBy(function(item) {
                    return item.date;
                })
                .groupBy(groupBy)
                .value();

            return tmp;
        }

        function round(num) {
            return (Math.round((num + 0.00001) * 100) / 100);
        }
    }

})();
