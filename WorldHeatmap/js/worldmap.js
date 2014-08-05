function drawWorldMap() {

  var AMERICAS = ["US", "CA", "MX"],
    	EMEA = ["FR", "ES", "PT", "GB", "DE", "CH", "MD", "ME", "BE", "NO", "SE", "FI", "PL", "DK", "EE", "LV", "LT", "BY", "NL", "IE", "UA", "RO", "BG", "GR", "HU", "SK", "CZ", "AT", "SI", "IT", "RS", "BA", "HR", "XK", "AL", "MK"],
    	APAC = ["RU", "CN", "IN", "AU", "NZ", "BD", "MM", "TH", "KH", "LK", "JP", "VN", "ID", "MY", "LA", "NP", "BT", "PH", "TW", "PG", "KP", "KR", "PK", "KG", "TJ", "AF"],
    	countries = {};

  var americasTrend = americasProfit / 20,
		emeaTrend = emeaProfit / 20,
		apacTrend = apacProfit / 20;

	AMERICAS.forEach(function(country) {
		countries[country] = americasTrend;
	});
	EMEA.forEach(function(country) {
		countries[country] = emeaTrend;
	});
	APAC.forEach(function(country) {
		countries[country] = apacTrend;
	});

  $('#jVectorMap').empty();
  
  $('#jVectorMap').vectorMap({
    map: 'world_mill_en',
    zoomOnScroll: false,
    zoomButtons: false,
    bindTouchEvents: false,
    regionsSelectable: false,
    onRegionLabelShow: null,
    backgroundColor: 'white',
    regionStyle: {
      initial: {
        fill: '#ddd'
      },
      hover: null
    },
    series: {
      regions: [{
        scale: ['#dc6f44','#dfb200','#88c96c'],
        min: 0,
        max: 2.5,
        normalizeFunction: 'linear',
        values: countries
      }]
    }
  });

}