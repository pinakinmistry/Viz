	var americasRevenue,
		emeaRevenue,
		apacRevenue,
		americasProfit,
		emeaProfit,
		apacProfit;

var TOTAL_REVENUE = 1000; //max revenue from all regions

$(document).ready(function(){
  randomize();
	setInterval(randomize, 1600);
}); //document ready


function randomize() {

	americasRevenue = Math.floor(Math.random(1) * 1000),
	emeaRevenue = Math.floor(Math.random(1) * 1000),
	apacRevenue = Math.floor(Math.random(1) * 1000),
	americasProfit = Math.floor(Math.random(1) * 100),
	emeaProfit = Math.floor(Math.random(1) * 100),
	apacProfit = Math.floor(Math.random(1) * 100);
	drawWorldMap();
}