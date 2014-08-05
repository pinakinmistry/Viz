angular.module('app.directives').directive('beadSizeChart', function() {

  function getChart(tableObj) {

    var hPad = 80,
      vPad = 40,
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
          var 
            beadId = row + '_' + y,
            cx = hPad + hwidth * (row + 1) / tableObj.table.length,
            cy = y,
            r,
            $circle,
            $beadLabel = makeSVG('text', 
              {x: cx - 4, y: cy + 5, 
                style: 'font-size:16px;cursor:pointer;' + 
                  (false ? 'fill:#000;font-weight:bold;' : 'fill:#fff;'),
                onmousedown: 'selectBead(evt)',
                id: beadId
              }),
            bead = parseInt(Math.random() * 7) + 1;

          r = ystep/2 - 5;
          $beadLabel.textContent = bead;

          $circle = makeSVG('circle', {cx: cx, cy: cy, r: r, 
            fill: 'url(#grad'+ bead +')',
            onmouseover: "", onmouseout: "", id: 'c' + beadId});

          $svg.append($circle)
            .append($beadLabel);

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

//Gradients:
var $gradientDef = makeSVG('defs'),
  gradientArray = [ 
    {bead: '1', id: "grad1", color1: "#66cc33", color2: "#669933"},
    {bead: '2', id: "grad2", color1: "#0099cc", color2: "#006699"},
    {bead: '3', id: "grad3", color1: "#cc9966", color2: "#996633"},
    {bead: '4', id: "grad4", color1: "#ffff33", color2: "#cc9933"},
    {bead: '5', id: "grad5", color1: "#ff9900", color2: "#cc6600"},
    {bead: '6', id: "grad6", color1: "#ff0000", color2: "#cc0000"},
    {bead: '7', id: "grad7", color1: "#e4e6e3", color2: "#c3c5c2"}
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



var selectedBead, selectedBeadId;

function selectBead(evt) {
  
  selectedBead = evt.target;
  selectedBeadId = selectedBead.getAttributeNS(null, 'id');
  var top = parseInt(selectedBead.getAttributeNS(null, 'y')) + 50;

  var $svg = $('<svg class="beadsBoxSVG">'),
    beadBox = $(selectedBead)
      .parent().parent().parent()
      .find('.beadsBox');

  for (var i = 0, cx = 20, cy = 40; i < gradientArray.length; i++) {
    var bead = gradientArray[i].bead;
    if (bead != selectedBead.textContent) {
      cx += 70;
      var $beadLabel = makeSVG('text', 
          {x: cx - 4, y: cy + 4, 
            style: 'fill:#fff; font-size:16px;cursor:pointer;',
            onmousedown: 'editBead(evt)'
        }),
      $circle = makeSVG('circle', {cx: cx, cy: cy, r: 25, 
        fill: 'url(#grad' + bead + ')'});
      $beadLabel.textContent = bead;

      $svg.append($circle)
      .append($beadLabel);
    }    
  }

  beadBox.html($svg);
  beadBox.css({'top': top + 'px'})
  beadBox.css({'display': 'inline-block'});
}

function hideBeadsBox(element) {
  $(element).css({'display': 'none'});
}

var editBeadParams = [];

function editBead(evt) {
  var newBead = evt.target;
  
  $('#c' + selectedBeadId).css({"fill": "url(#grad" + newBead.textContent + ")"});
  selectedBead.setAttributeNS(null, "style", "fill:#000; font-weight:bold; font-size:16px;cursor:pointer;");
  selectedBead.textContent = newBead.textContent;
  selectedBead = null;
}