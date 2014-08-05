angular.module('app.services').factory('Settings', ['$rootScope', '$http', function ($rootScope, $http) {

	var settings = {
		yMarker: 0,
		x1Marker: 0,
		x2Marker: 0,
		currentyMarker: 0,
		currentx1Marker: 0,
		currentx2Marker: 0
		
	};

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
