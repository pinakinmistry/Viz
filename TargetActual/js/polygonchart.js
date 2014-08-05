$(document).ready(function(){
	drawChart();
	setInterval(drawChart, 1600);
});

function drawChart(){
	$('.metric .metricChart').each(function() {
		var target = parseFloat((Math.random() * 100).toFixed(1)),
			actual = parseFloat((Math.random() * 100).toFixed(1));
		$(this).html(getPolygon(this, target, actual));
	});
	$('.metric .metricDoubleChart').each(function() {
		var target = parseFloat((Math.random() * 100).toFixed(1)),
			actual = parseFloat(Math.round(Math.random() * 100).toFixed(1));
		addSecondPolygon($(this).find('.svgPolygonChart'), target, actual);
	});
}

function getPolygon(element, target, actual, negativeTrend) {
	var w = parseInt($('.metric .metricChart').css('width')),
		h = parseInt($('.metric .metricChart').css('height')),
		hPad = w * .15,
		vPad = h * .15,
		hwidth = w - hPad,
		vheight = h - vPad;

	if($(element).hasClass('negativeTrend')) {
		negativeTrend = true;
	}
	
	var $svg = $('<svg class="svgPolygonChart">'),
		lineStyle = "stroke:#bbb;stroke-width:1";

	var $line1 = makeSVG('line', {x1: hPad, y1: 0, x2: hPad, y2: vheight, style: lineStyle}),
	$target = makeSVG('text', 
		{x: hPad - 15, y: vheight + 16, 
			style: 'fill:#777; font-size:16px'
		}),
	$line2 = makeSVG('line', {x1: hwidth, y1: 0, x2: hwidth, y2: vheight, style: lineStyle}),
	$actual = makeSVG('text', 
		{x: hwidth - 20, y: vheight + 16, 
			style: 'fill:#777; font-size:16px'
		}),
	$line3 = makeSVG('line', {x1: 0, y1: vheight, x2: w, y2: vheight, style: lineStyle});

	$target.textContent = 'Target';
	$actual.textContent = 'Actual';

	var max = (target + actual) * 1.1,
		polygonPts = hwidth + ',' + vheight * (1 - actual/max) + ' ' +
			hwidth + ',' + vheight + ' ' +
			hPad + ',' + vheight + ' ' +
			hPad + ',' + vheight * (1 - target/max),
		color, 
		polygonStyle,
		$polygon,
		$targetValue = makeSVG('text', 
		{x: hPad - 32, y: vheight * (1 - target/max) + 5, 
			style: 'fill:#777; font-size:14px'
		}),
		$actualValue = makeSVG('text', 
		{x: hwidth + 5, y: vheight * (1 - actual/max) + 5, 
			style: 'fill:#777; font-size:14px'
		});

	if (negativeTrend) {
		color = actual > target ? '#ff7522' :
				actual > target * .7 ? '#f6d342' :
				'#6fcb6b';
	} else {
		color = actual > target ? '#6fcb6b' :
				actual > target * .7 ? '#f6d342' :
				'#ff7522';
	}

	polygonStyle = "fill:" + color + ";opacity:0.9;stroke:black;stroke-width:0.5";
	$polygon = makeSVG('polygon', {points: polygonPts, style: polygonStyle});
	$targetValue.textContent = target;
	$actualValue.textContent = actual;

	$svg.append($polygon)
		.append($line1)
		.append($target)
		.append($targetValue)
		.append($line2)
		.append($actual)
		.append($actualValue)
		.append($line3);
	
	return $svg;
}

function addSecondPolygon(chart, target, actual, negativeTrend) {
	var w = parseInt($('.metric .metricChart').css('width')),
		h = parseInt($('.metric .metricChart').css('height')),
		hPad = w * .15,
		vPad = h * .15,
		hwidth = w - hPad,
		vheight = h - vPad;

	if($(chart).parent().hasClass('negativeTrend')) {
		negativeTrend = true;
	}

	var max = (target + actual) * 1.1,
		polygonPts = hwidth + ',' + vheight * (1 - actual/max) + ' ' +
			hwidth + ',' + vheight + ' ' +
			hPad + ',' + vheight + ' ' +
			hPad + ',' + vheight * (1 - target/max),
		color, 
		polygonStyle,
		$polygon,
		$targetValue = makeSVG('text', 
		{x: hPad - 32, y: vheight * (1 - target/max) + 5, 
			style: 'fill:black; font-size:14px; text-align:right;'
		}),
		$actualValue = makeSVG('text', 
		{x: hwidth + 5, y: vheight * (1 - actual/max) + 5, 
			style: 'fill:black; font-size:14px; text-align:right;'
		});

	if (negativeTrend) {
		color = actual > target ? '#ff7522' :
				actual > target * .7 ? '#f6d342' :
				'#6fcb6b';
	} else {
		color = actual > target ? '#6fcb6b' :
				actual > target * .7 ? '#f6d342' :
				'#ff7522';
	}

	polygonStyle = "fill:" + color + ";opacity:0.9;stroke:black;stroke-width:0.5";
	$polygon = makeSVG('polygon', {points: polygonPts, style: polygonStyle});
	$targetValue.textContent = target;
	$actualValue.textContent = actual;

	chart.append($polygon)
		.append($targetValue)
		.append($actualValue);
}


function makeSVG(tag, attrs) {
  var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var k in attrs) {
  	el.setAttribute(k, attrs[k]);
  }
	return el;
}