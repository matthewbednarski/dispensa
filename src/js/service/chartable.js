(function(){
	console.log("Creating module dsdd");
	var app = angular.module('mcbChart', [])
		.factory('chartable', Chartable);
	function Chartable() {
		var data = [];
		var series = [];
		var labels = [];

		return {
			data: data,
			legend: true,
			series: series,
			labels: labels,
			update: update
		};

		function update(tableData) {
			_.remove(data);
			_.remove(labels);
			_.remove(series);
			series.push('min');
			series.push('max');
			series.push(tableData.name);
			var min = tableData.items[0].min;
			var max = tableData.items[0].max;
			var dMap = _.chain(tableData.items)
				.map(function(item) {
					return [
						null, null, item.value
					];
				})
			.unzip()
				.value();
			dMap[0][0] = min;
			dMap[0][dMap[0].length - 1] = min;
			dMap[1][0] = max;
			dMap[1][dMap[1].length - 1] = max;
			console.log(dMap);

			_.assign(labels, _.range(1, dMap[2].length + 1, 1));
			_.assign(data, dMap);
		}
	}

})();
