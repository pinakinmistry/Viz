var revenue1,
		revenue2,
		revenue3,
		profit1,
		profit2,
		profit3;

var TOTAL_REVENUE; //max revenue among 3

$(document).ready(function(){
  randomize();
	setInterval(randomize, 3000);
}); //document ready


function randomize() {
	$('.flagShip').each(function () {
	 	$(this).hide(50);
	});

	revenue1 = Math.floor(Math.random(1) * 1000),
	revenue2 = Math.floor(Math.random(1) * 1000),
	revenue3 = Math.floor(Math.random(1) * 1000),
	profit1 = Math.floor(Math.random(1) * 100),
	profit2 = Math.floor(Math.random(1) * 100),
	profit3 = Math.floor(Math.random(1) * 100);

	TOTAL_REVENUE = Math.max(revenue1, revenue2, revenue3);

	createFlagShip(revenue1, profit1, '1');
	createFlagShip(revenue2, profit2, '2');
	createFlagShip(revenue3, profit3, '3');

	$('.flagShip').each(function () {
	 	$(this).show(500);
	});
}

function createFlagShip(revenue, profit, region) {
  var SHIP_WIDTH = parseInt($('.flagShip').css('width'), 10) - 20,
    SHIP_HEIGHT = parseInt($('.flagShip').css('height'), 10),
    outerDiameter = SHIP_WIDTH * revenue / TOTAL_REVENUE,
    innerDiameter = outerDiameter * profit / 100,
    topFlagHeight = (SHIP_HEIGHT - outerDiameter) / 2,
    bottomFlagHeight = topFlagHeight,
    bottomFlagStickHeight = (outerDiameter - innerDiameter) / 2,
    bottomFlagSticktop = (outerDiameter - innerDiameter) / 2,
    id = '#flagShip' + region;

  $(id + ' .topFlag').css({'height': topFlagHeight + 'px'});
  $(id + ' .bottomFlag').css({'height': bottomFlagHeight + 'px'});
  $(id + ' .outerCircle').css({'height': outerDiameter + 'px', 'width': outerDiameter + 'px', 'border-radius': outerDiameter + 'px'});
  $(id + ' .innerCircle').css({'height': innerDiameter + 'px', 'width': innerDiameter + 'px', 'border-radius': innerDiameter + 'px', 'top': bottomFlagStickHeight + 'px'});
  $(id + ' .bottomFlagStick').css({'height': bottomFlagStickHeight + 'px', 'top': bottomFlagSticktop + 'px'});
  $(id + ' .bottomFlag .flag').css({'top': bottomFlagHeight - 18 + 'px'});
  $(id + ' .topFlag .flag').html(parseInt(revenue, 10) + ' M');
  $(id + ' .bottomFlag .flag').html(parseInt(profit , 10) + ' %');
}
