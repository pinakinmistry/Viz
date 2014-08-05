angular.module('app.controllers')
	.controller('BeadChartCtrl', function ($scope, Beads, $timeout) {
 
		var chartData;
		setChartData();

		function setChartData(){
			chartData = getChartData();
			$scope.beadsTable = Beads.getBeadsTable(chartData);
		}

		// setInterval(function(){
		// 	$timeout(setChartData, 100);
		// }, 7900);
		

  });

function getChartData() {
	var data = [];
	for(var x = 0; x < 10; x++){
		for(var y = 0; y < 10; y++){
			var dataPoint = {}, 
				value = parseInt(Math.random() * 100);
			dataPoint.x = x;
			dataPoint.y = y;
			dataPoint.value = value;
			data.push(dataPoint);
		}
	}
	return data;
}


