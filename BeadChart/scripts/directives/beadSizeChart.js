angular.module('app.directives').directive('beadSizeChart', function() {

  function getChart(tableObj) {

    var hPad = 100,
      vPad = 80,
      vGap = 35;
    
    var w = parseInt($('.beadChartBox').css('width')),
      h = parseInt($('.beadChartBox').css('height')); 
      hwidth = w - 2 * hPad,
      vheight = h - 2 * vPad,
      xstep = hwidth / tableObj.table.length;

    var $svg = $('<svg class="chartSVG">'),
      darkLineStyle = "stroke:#777;stroke-width:1",
      lightLineStyle = "stroke:#bbb;stroke-width:0.5",
      circleStyle = "";

    
    $svg.append($gradientDef);
    var $yAxis = makeSVG('line', {x1: hPad, y1: vPad, x2: hPad, y2: vPad + vheight, style: darkLineStyle}),
    $yLabel = makeSVG('text', 
      {x: hPad - 50, y: vPad - 20, 
        style: 'fill:#777; font-size:14px;font-weight:bold;'
      }),
    $xAxis = makeSVG('line', {x1: hPad, y1: vPad + vheight, x2: w - hPad, y2: vPad + vheight, style: darkLineStyle}),
    $xLabel = makeSVG('text', 
      {x: hPad + hwidth - 40, y: vPad + vheight + 40, 
        style: 'fill:#777; font-size:14px;font-weight:bold;'
      });

    $svg.append($xAxis)
      .append($yAxis);

    for(var step = 0, x = hPad, $x; step < tableObj.table.length; step++) {
      x += xstep;
      $x = makeSVG('line', {x1: x, y1: vPad, x2: x, y2: vPad + vheight, 
        style: lightLineStyle});

      var $xLabel = makeSVG('text', 
      {x: x - 12, y: vPad + vheight + 20, 
        style: 'fill:#777; font-size:12px'
      });

      $xLabel.textContent = step+1;
      $svg.append($x)
        .append($xLabel);
    }
    
    var ystep = vheight / tableObj.table.length;
    for(var row = 0, x = hPad, y = vPad, $x, $y; row < tableObj.table.length; row++) {
      $y = makeSVG('line', {x1: hPad, y1: y, x2: w - hPad, y2: y, style: lightLineStyle});

      var $yLabel = makeSVG('text', 
      {x: hPad - 35, y: y + 4,  
       style: 'fill:#777; font-size:12px'
      });
      $yLabel.textContent = tableObj.table[row].rows.length - row;
      $svg.append($y)
        .append($yLabel);

      $.each(tableObj.table[row].rows, function(row, data) {
        if(data) {
          var cx = hPad + hwidth * (row + 1) / tableObj.table.length,
            cy = y,
            r,
            $circle,
            value = data.value;

          r = Math.pow(parseFloat(value) / tableObj.max * Math.pow(ystep/2, 2), .5);
          r = .95 * r; //hav some gaps
          r = r < 1 ? 1 : r;


          var grad = data['Top5'] ? 'A' :
            data['Bottom5'] ? 'F' : 'G';

          $circle = makeSVG('circle', {cx: cx, cy: cy, r: r, 
            fill: 'url(#grad'+ grad +')',
            value: value, onmouseover: "showValue(evt)", onmouseout: "hideValue()"});

          $svg.append($circle);

        }
      });

      y += ystep;
    }
    

    //final SVG
    return $svg;  
  }

  return {
		restrict: 'A',
    scope: {
        table: "="
    },
		link: function(scope, element, attrs) {
      
      scope.$watch(function() {return scope.table;}, function(table) {
        if(!table) return;
        $(element).find('.beadChartBox')
          .html(getChart(scope.table));
      });
                      
		}
	};
});

function showValue(evt) {
  $('div.pop').remove();
  var $div = $("<div>", {class: "pop"});
  var left = parseInt(evt.target.getAttributeNS(null, 'cx')) + parseInt(evt.target.getAttributeNS(null, 'r')) + parseInt(10);
  var top = parseInt(evt.target.getAttributeNS(null, 'cy')) - 15;
  var color = evt.target.getAttributeNS(null, 'fill'),
    colorHex;

  $div.html(parseFloat(evt.target.getAttributeNS(null, 'value')).toFixed(1));

  if (color.indexOf('gradA') != -1) {
    colorHex = '#66cc33';
    $div.addClass('backgroundPopupGreen');
    $div.append('<span class="arrowLeftPopup popupGreen"></span>');
  } else 
    if (color.indexOf('gradF') != -1) {
      colorHex = "#ff0000";
      $div.addClass('backgroundPopupRed');
      $div.append('<span class="arrowLeftPopup popupRed"></span>');
    } else {
      colorHex = "#e4e6e3";
      $div.addClass('backgroundPopupGrey');
      $div.append('<span class="arrowLeftPopup popupGrey"></span>');
    }
  $div.css({left: left, top: top});
  $(evt.target).parent().parent().append($div);
}

function hideValue(){
  $('div.pop').remove();
}

//Gradients:
var $gradientDef = makeSVG('defs'),
  gradientArray = [ 
    {bead: 'A', id: "gradA", color1: "#66cc33", color2: "#669933"},
    {bead: 'B', id: "gradB", color1: "#0099cc", color2: "#006699"},
    {bead: 'C', id: "gradC", color1: "#cc9966", color2: "#996633"},
    {bead: 'D', id: "gradD", color1: "#ffff33", color2: "#cc9933"},
    {bead: 'E', id: "gradE", color1: "#ff9900", color2: "#cc6600"},
    {bead: 'F', id: "gradF", color1: "#ff0000", color2: "#cc0000"},
    {bead: 'G', id: "gradG", color1: "#e4e6e3", color2: "#c3c5c2"}
  ];

for (var i = 0; i < gradientArray.length; i++) {
  var grad = gradientArray[i],
    $grad = makeSVG('linearGradient', {id:grad.id, x1:"0%", y1:"0%", x2:"0%", y2:"100%"}),
    $stop1 = makeSVG('stop', {offset:"0%", style:"stop-color:" + grad.color1 + ";stop-opacity:1"}), 
    $stop2 = makeSVG('stop', {offset:"100%", style:"stop-color:" + grad.color2 + ";stop-opacity:1"});

  $grad.appendChild($stop1);
  $grad.appendChild($stop2);  
  $gradientDef.appendChild($grad); 
}

function makeSVG(tag, attrs) {
  var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var k in attrs) {
    el.setAttribute(k, attrs[k]);
  }
  return el;
}
