var RESET = { isReset: true};
angular.module('app.controllers')
  .controller('ChartCtrl', function ($scope, $rootScope, $location) {
  	  
	  $scope.chart = {zoom: 1};
	  $scope.reset = RESET;
	  $scope.$watch(function(){ return $scope.chart.zoom; }, function(value){
	   	$('.chartSVG').css({
	   		'transform': 'scale(' + value + ')',
	   		'-webkit-transform': 'scale(' + value + ')',
	   		'-moz-transform': 'scale(' + value + ')',
	   		'-ms-transform': 'scale(' + value + ')',
	   		'-o-transform': 'scale(' + value + ')'
	   	});
	  }, true);

	  $scope.noText = function(value){ return ''; }
	  
	  $scope.resetMarkers = function(settings) {
			drawChart(true);
			RESET.isReset = true;
	  }

	  function getDataDefinition(reset) {
  		var dataDefinition = getScatterPlotData();
  		//dataDefinition = dataPoints;
	  	$scope.dataDefinition = dataDefinition;
		}

		function getScatterPlotData(){
			var dataPoints = [];
			for (var point = 0; point < 100; point++){
				dataPoints[point] = {
					time: getTime(),
					y: 40 + parseInt(Math.random() * 60),
					n_points: parseInt(Math.random() * 1000),
					data: 'Data ' + (point % 2 + 1),
					moreData: parseInt(Math.random() * 1000)
				}
			}
			return dataPoints;
		}

		function getTime(){
			var hh = 4 + parseInt(Math.random()*20);
			var timeText = (hh.toString().length>1 ? hh : '0'+ hh) + '00';
			return timeText;
		}

		function drawChart(reset) {
			getDataDefinition(reset);
		}

		drawChart();
	  
  });
