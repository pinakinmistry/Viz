angular.module('app.services').factory('Settings', ['$rootScope', '$http', function ($rootScope, $http) {

	var departureSlotsFromTimings = [],
    departureSlotsToTimings = [],
    departureSlotsNames = [];

	for (var hh = 0, mm = '00'; hh < 24; hh++) {
		var timeText = (hh.toString().length>1 ? hh : '0'+ hh) + mm;
		departureSlotsFromTimings.push(timeText);
		timeText = (hh.toString().length>1 ? hh : '0'+ hh) + '30';
		departureSlotsFromTimings.push(timeText);
	}

	departureSlotsNames = departureSlotsToTimings = departureSlotsFromTimings;

	var settings = {
		slotsCount: 5,
		departureSlotsFromTimings: departureSlotsFromTimings,
		departureSlotsFromTime: departureSlotsFromTimings[0],
		departureSlotsToTimings: departureSlotsToTimings,
		departureSlotsToTime: departureSlotsToTimings[0], 
		departureSlotsNames: departureSlotsNames,
		timeSlots: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
		timeSlotsCount: 10,
		timeSlotsStartTime: [],
		currentTimeSlotsStartTime: [],
		selectedDeptTimings: []
	}

	var Settings = {
		get: function() {
			return settings;
		},
		initMarkers: function(markers) {
			settings.x1Marker = settings.currentx1Marker = markers[0];
		  settings.x2Marker = settings.currentx2Marker = markers[1];
		  settings.yMarker = settings.currentyMarker = markers[2];
		}
	};
	
	return Settings;
}]);
