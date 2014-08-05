angular.module('app.services').factory('Beads', ['$http', '$rootScope', function ($http, $rootScope) {

	function getBeadsTable(data) {
		
		var max = getMax(data);
		var min = getMin(data);
		//Get Top5 Bottom5 unique values for both way beads for each
		//of the data points (load factor, avg fare, etc.)
		var top5Bottom5 = getTop5Bottom5(data);

		data = _.sortBy(data, function(dataPoint) {
			return dataPoint.y;
		});

		var beadsTable = [], tableObj = {},
			prevY = data[0].y,
			beadObj = {};

			beadObj.rows = [];

			$.each(data, function(i, dataPoint) {

				if (prevY != dataPoint.y) {
					beadsTable.push(beadObj);
					beadObj = {};
					beadObj.rows = [];
				}

	  		var row = {};
	  		
				var comparator = (max-min);
	    		row.y = dataPoint.y;
	    		row.x = dataPoint.x;
	    		row.value = dataPoint.value;
    		row['Top5'] = dataPoint.value >= top5Bottom5.greenEnd ? 
    			true: false;
    		row['Bottom5'] = dataPoint.value <= top5Bottom5.redStart ? 
    			true: false;
    		//if(viewArray[i] != "connecting_percent"){
    		if(true) {
	    		row['red'] = dataPoint.value <= ((comparator*10/100)+min) ? 
	    			true: false;
	    		row['yellow'] = (dataPoint.value > ((comparator*10/100)+min) && dataPoint.value <= ((comparator*30/100)+min)) ? 
	    			true: false;
    			row['lightYellow'] = (dataPoint.value > ((comparator*30/100)+min) && dataPoint.value <= ((comparator*70/100)+min))  ? 
    				true: false;
	    		row['lightGreen'] = (dataPoint.value > ((comparator*70/100)+min) && dataPoint.value <= ((comparator*90/100)+min)) ? 
	    			true: false;
	    		row['green'] = dataPoint.value > ((comparator*90/100)+min) ? 
	    			true: false;
				}
				else {
					if(max == 0 && min == 0) {
					} else {
						row['green'] = dataPoint.value <= ((comparator*10/100)+min) ? 
		    			true: false;
			    		row['lightGreen'] = (dataPoint.value > ((comparator*10/100)+min) && dataPoint.value <= ((comparator*30/100)+min)) ? 
			    			true: false;
		    			row['lightYellow'] = (dataPoint.value > ((comparator*30/100)+min) && dataPoint.value <= ((comparator*70/100)+min))  ? 
		    				true: false;
			    		row['yellow'] = (dataPoint.value > ((comparator*70/100)+min) && dataPoint.value <= ((comparator*90/100)+min)) ? 
			    			true: false;
			    		row['red'] = dataPoint.value > ((comparator*90/100)+min) ? 
			    			true: false;
			    }
				}
	  		beadObj.rows[dataPoint.x] = row;
	  		prevY = dataPoint.y;
	  	});

		beadsTable.push(beadObj);

		tableObj.table = beadsTable;
		tableObj.max = max;
		tableObj.min = min;

		return tableObj;
	}

	function getTop5Bottom5(data) {
    var top5Bottom5 = {},
      sortedArray;

 		sortedArray = _.unique(data, function(data){
      return data.value;
    });
    sortedArray = _.sortBy(sortedArray, function(data){
      return -data.value;
    });

    if(sortedArray.length <= 5) {
      top5Bottom5.greenEnd = 0;
      top5Bottom5.redStart = -1;
    } else
    if (sortedArray.length <= 10) {
       top5Bottom5.greenEnd = sortedArray[4].value;
       top5Bottom5.redStart = sortedArray[5].value;
    } else {
      top5Bottom5.greenEnd = sortedArray[4].value;
      sortedArray = _.sortBy(data, function(data){
        return data.value;
      });
      top5Bottom5.redStart = sortedArray[4].value;
  	} 	
	     
    return top5Bottom5;
  }

  function getMax(data) {
  	var max;
 		max = (_.max(data, function(dataPoint){
        return dataPoint.value;
      })).value;
  	return max;
  }

  function getMin(data) {
  	var min;
 		min = (_.min(data, function(dataPoint){
        return dataPoint.value;
      })).value;
  	return min;
  }

	var Beads = {
		resetClusterEdit : function() {
			console.log('cluster reset');
			$rootScope.$broadcast('clusterReset');
		},
		getBeadsTable: getBeadsTable,
		getMax: getMax

	};

	return Beads;
}]);
