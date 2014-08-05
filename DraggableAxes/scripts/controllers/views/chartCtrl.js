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
  		var dataDefinition = {};
  		if(!reset){
  			data = getScatterPlotData();
  		} else {
  			dataDefinition.resetedAt = Date();
  		}
	  	
	  	dataDefinition.dataPoints = data.dataPoints;
	  	dataDefinition.markers = data.markers; 
	  	$scope.dataDefinition = null;
	  	$scope.dataDefinition = dataDefinition;
		}

		function getScatterPlotData(){
			var scatterPlotData = {};
			scatterPlotData.markers = [50,75,45];
			scatterPlotData.dataPoints = [];
			for (var point = 0; point < 100; point++){
				scatterPlotData.dataPoints[point] = {
					x: parseInt(Math.random() * 100),
					y: parseInt(5 + Math.random() * 95),
					n_points: parseInt(Math.random() * 1000),
					data: 'Data ' + (point % 2 + 1),
					moreData1: parseInt(Math.random() * 1000),
					moreData2: parseInt(Math.random() * 1000)
				}
			}
			return scatterPlotData;
		}

		function drawChart(reset) {
			getDataDefinition(reset);
		}

		drawChart();
	  
  });
