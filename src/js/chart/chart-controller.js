(function(){
	var app = angular.module('dispensa')
		.controller('chart',[ '$scope', 'chartable', Chart]);

  function Chart($scope, chartable) {
    this.options = {
      scaleShowVerticalLines: false,
      scaleBeginAtZero: false
    };
    this.chartable = chartable;
    this._ = _;
  }

})();
