var w, h, settings; //Global settings for moveElement
var $globalSVG;
var YMAX = 100;
angular.module('app.directives').directive('draggableAxes', ['$document', 'Settings', function($document, Settings) {

  settings = Settings;

  function getChart(Settings, dataDefinition) {
    w = parseInt($('.draggableAxesChart').css('width'));
    h = parseInt($('.draggableAxesChart').css('height'));

    var hPad = w * .10,
      vPad = h * .14,
      hwidth = w - 2 * hPad,
      vheight = h - 2 * vPad,
      xstep = hwidth / 10,
      yMax = YMAX,
      ystep = vheight / (yMax / 10),
      settings = Settings.get();

    Settings.initMarkers(dataDefinition.markers);

    var $svg = $('<svg class="chartSVG">'),
      darkLineStyle = "stroke:#000;stroke-width:1",
      lightLineStyle = "stroke:#bbb;stroke-width:0.5",
      circleStyle = "stroke:#000;stroke-width:1;fill:#0f0;opacity:0.7;",
      circleStyleBack = "stroke:#000;stroke-width:1;fill:#00f;opacity:0.7;",
      dragAxisStyle = 'fill:#000;stroke:#444;stroke-width:4;opacity:0.7';
        
    $svg.append($gradientDef);

    var $yAxis = makeSVG('line', {x1: hPad, y1: vPad, x2: hPad, y2: vPad + vheight, style: darkLineStyle}),
    $yLabel = makeSVG('text', 
      {x: hPad - 50, y: vPad - 30, 
        style: 'fill:#000; font-size:14px;font-weight:bold;'
      }),
    $xAxis = makeSVG('line', {x1: hPad, y1: vPad + vheight, x2: w - hPad, y2: vPad + vheight, style: darkLineStyle}),
    $xLabel = makeSVG('text', 
      {x: hPad + hwidth / 2, y: vPad + vheight + 40, 
        style: 'fill:#000; font-size:14px;font-weight:bold;'
      }),
    $origin = makeSVG('text', 
      {x: hPad - 20, y: vPad + vheight + 20, 
        style: 'fill:#000; font-size:12px'
      });

    $yLabel.textContent = 'Y Axis (%)';
    $xLabel.textContent = 'X Axis (%)';
    $origin.textContent = '0';

    $svg.append($xAxis)
      .append($xLabel)
      .append($yAxis)
      .append($yLabel)
      .append($origin);

    for(var step = 0, x = hPad, y = vPad, $x, $y; step < 10; step++) {
      x += xstep;
      $x = makeSVG('line', {x1: x, y1: vPad, x2: x, y2: vPad + vheight, style: lightLineStyle});

      var $xLabel = makeSVG('text', 
      {x: x - 7, y: vPad + vheight + 20, 
        style: 'fill:#000; font-size:12px'
      });

      $xLabel.textContent = (step + 1) * 10;

      $svg.append($x)
        .append($xLabel)
    }

    for(var step = 0, x = hPad, y = vPad, $x, $y; step < yMax/10; step++) {
      $y = makeSVG('line', {x1: hPad, y1: y, x2: w - hPad, y2: y, style: lightLineStyle});

      var $yLabel = makeSVG('text', 
        {x: hPad - 30, y: y + 5,   
          style: 'fill:#000; font-size:12px'
        });

      $yLabel.textContent = (yMax/10 - step) * 10;

      $svg.append($y)
        .append($yLabel);

      y += ystep;
    }

    var dataPoints = dataDefinition.dataPoints;
    for(var point = 0; point < dataPoints.length; point++) {
      pointColor = dataPoints[0].data;
      var x = hPad + hwidth * dataPoints[point].x / 100,
       y = vPad + vheight * (1 - dataPoints[point].y / yMax);
      
      var data = dataPoints[point].data,
        moreData1 = dataPoints[point].moreData1,
        moreData2 = dataPoints[point].moreData2,
        numberOfpoints = dataPoints[point].n_points;
      
      var $circle = makeSVG('circle', {cx: x, cy: y, r: 5, data: data, moreData1: moreData1, moreData2: moreData2, nof: numberOfpoints, 
                    style: data == pointColor ? circleStyleBack : circleStyle,
                    onmouseover: "showTooltip(evt)", onmouseout: "quadTilePopup()"});

      $svg.append($circle);
    }

    $circle = makeSVG('circle', {cx: hwidth - 20, cy: 35, r: 5, style: circleStyleBack});
    $xLabel = makeSVG('text', 
      {x: hwidth - 10, y: 40, style:'fill:#000;font-size:14px;'});
    $xLabel.textContent = 'Data 1';
    $svg.append($circle).append($xLabel);

    $circle = makeSVG('circle', {cx: hwidth + 70, cy: 35, r: 5, style: circleStyle});
    $xLabel = makeSVG('text', 
      {x: hwidth + 78, y: 40, style:'fill:#000;font-size:14px;'});
    $xLabel.textContent = 'Data 2';
    $svg.append($circle).append($xLabel);

  //Y Marker
  var X1 = hPad,
    Y1 = vPad + vheight * (1 - settings.yMarker / yMax),
    X2 = hPad + hwidth,
    Y2 = Y1;

  $draggableYAxis = makeSVG('path', 
      { d: 'M' + (X1 - 8) + ' ' + Y1 + ' ' + (X2 + 8) + ' ' + Y1, 
        class: "draggable",
        style: dragAxisStyle,
        transform: "matrix(1 0 0 1 0 0)",
        onmousedown: "selectElement(evt)",
        ontouchstart: "selectElement(evt)",
        ongesturestart: "selectElement(evt)",
        direction: "y"
    });
    
  $svg.append($draggableYAxis);

  //X1 Marker
  X1 = hPad + hwidth * (settings.x1Marker / 100);
  Y1 = vPad + vheight;
  X2 = X1;
  Y2 = vPad;
    
   $draggablex1Marker = makeSVG('path', 
      { d: 'M' + X1 + ' ' + (Y1 + 8) + ' ' + X2 + ' ' + (Y2 - 8), 
        class: "draggable",
        style: dragAxisStyle,
        transform: "matrix(1 0 0 1 0 0)",
        onmousedown: "selectElement(evt)",
        ontouchstart: "selectElement(evt)",
        ongesturestart: "selectElement(evt)",
        direction: "x",
        marker: "x1Marker"
      });
    
    $svg.append($draggablex1Marker);


    //X2 Marker
    X1 = hPad + hwidth * (settings.x2Marker / 100);
    Y1 = vPad + vheight;
    X2 = X1;
    Y2 = vPad;
    
   $draggablex2Marker = makeSVG('path', 
      { d: 'M' + X1 + ' ' + (Y1 + 8) + ' ' + X2 + ' ' + (Y2 - 8), 
        class: "draggable",
        style: dragAxisStyle,
        transform: "matrix(1 0 0 1 0 0)",
        onmousedown: "selectElement(evt)",
        ontouchstart: "selectElement(evt)",
        ongesturestart: "selectElement(evt)",
        direction: "x",
        marker: "x2Marker"
      });
    
    $svg.append($draggablex2Marker);

    drawQuadTileCircles(hPad, vPad, hwidth, vheight, settings, $svg);

    $globalSVG = $svg;
    //final SVG
    return $svg;
  }

  return {
		restrict: 'EA',
    scope: {
        data: "="
    },
		link: function(scope, element, attrs) {

      scope.$watch(function() {return scope.data;}, function(value){
        if(!value) return;
        $(element).find('.draggableAxesChart')
          .html(getChart(Settings, scope.data));
      }, true);

		}
	};
}]);


function initquadTileSize() {
  w = parseInt($('.definequadTile').css('width'));
  h = parseInt($('.definequadTile').css('height'));
}

function makeSVG(tag, attrs) {
  var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var k in attrs) {
    el.setAttribute(k, attrs[k]);
  }
  return el;
}

//dragging
var selectedElement = 0;
var direction = '';
var dragging = '';
var deptTimeAxis = '';
var currentX = 0;
var currentY = 0;
var currentMatrix = 0;

function selectElement(evt) {
  evt.preventDefault(); //Woah, this makes axis selection very responsive!!! 
  selectedElement = evt.target;
  direction = selectedElement.getAttributeNS(null, "direction");
  dragging = selectedElement.getAttributeNS(null, "marker");
  deptTimeAxis = parseInt(selectedElement.getAttributeNS(null, "deptTimeAxis"));
  currentX = evt.clientX;
  currentY = evt.clientY;
  currentMatrix = selectedElement.getAttributeNS(null, "transform").slice(7,-1).split(' ');
  for(var i=0; i<currentMatrix.length; i++) {
    currentMatrix[i] = parseFloat(currentMatrix[i]);
  }
}

function moveElement(evt, settings){
  evt.preventDefault(); //Woah, this helps drag horizontal axis!!! Also, drag is much more smoother!!!
  if(!selectedElement) return;
  
  RESET.isReset = false;
  w = parseInt($('.draggableAxesChart').css('width'));
  h = parseInt($('.draggableAxesChart').css('height'));

  var s = settings.get(),
    hPad = w * .10,
    vPad = h * .14,
    hwidth = w - 2 * hPad,
    vheight = h - 2 * vPad,
    yMax = YMAX,
    yMarker = vPad + vheight * (1 - s.yMarker / yMax),
    x1Marker = hPad + hwidth * s.x1Marker / 100,
    x2Marker = hPad + hwidth * s.x2Marker / 100,
    currentx1Marker = hPad + hwidth * s.currentx1Marker / 100,
    currentx2Marker = hPad + hwidth * s.currentx2Marker / 100;

  if (evt.touches){
      evt.clientX = evt.touches[0].clientX;
      evt.clientY = evt.touches[0].clientY;
  }

  dx = evt.clientX - currentX;
  dy = evt.clientY - currentY;
  if(direction == 'x') {
    if(dragging == 'x1Marker') {
      //console.log(x1Marker + currentMatrix[4] + dx , currentx2Marker)
      if((x1Marker + currentMatrix[4] + dx > hPad) &&
        (x1Marker + currentMatrix[4] + dx < currentx2Marker)) {
        currentMatrix[4] += dx;
      }
    } else {
      //console.log(x2Marker + currentMatrix[4] + dx , currentx1Marker)
      if((x2Marker + currentMatrix[4] + dx > currentx1Marker) &&
        (x2Marker + currentMatrix[4] + dx < hPad + hwidth)) {
        currentMatrix[4] += dx;
      }
    }
  } else {
    if((yMarker + currentMatrix[5] + dy > vPad) && 
      (yMarker + currentMatrix[5] + dy < vPad + vheight)) {
      currentMatrix[5] += dy;
    }
  }

  newMatrix = "matrix(" + currentMatrix.join(' ') + ")";
  if(selectedElement) {
    selectedElement.setAttributeNS(null, "transform", newMatrix);
  }

  
  if(direction == 'x') {
    if(dragging == 'x1Marker') {
      console.log(parseInt((x1Marker + currentMatrix[4] - hPad)/hwidth * 100));
      s.currentx1Marker = parseFloat((x1Marker + currentMatrix[4] - hPad)/hwidth * 100);
    } else {
      console.log(parseInt((x2Marker + currentMatrix[4] - hPad)/hwidth * 100));      
      s.currentx2Marker = parseFloat((x2Marker + currentMatrix[4] - hPad)/hwidth * 100);
    }
  } else {  
    console.log(parseInt((vheight - (yMarker + currentMatrix[5] - vPad))/vheight * yMax));
    s.currentyMarker = parseFloat((vheight - (yMarker + currentMatrix[5] - vPad))/vheight * yMax);
  }

  var settings = {};
  settings.x1Marker = s.currentx1Marker;
  settings.x2Marker = s.currentx2Marker;
  settings.yMarker = s.currentyMarker;

  drawQuadTileCircles(hPad, vPad, hwidth, vheight, settings, $globalSVG); 
  
  currentX = evt.clientX;
  currentY = evt.clientY;
}

function deselectElement(evt){
  if(selectedElement != 0){
    console.log('deselected')
    selectedElement.removeAttributeNS(null, "onmousemove");
    selectedElement.removeAttributeNS(null, "ongesturechange");
    selectedElement.removeAttributeNS(null, "ontouchmove");
    //selectedElement.removeAttributeNS(null, "onmouseout");
    selectedElement.removeAttributeNS(null, "onmouseup");
    selectedElement.removeAttributeNS(null, "ongestureend");
    selectedElement.removeAttributeNS(null, "ontouchend");
    selectedElement = 0;
    direction = '';
    dragging = '';
    deptTimeAxis = '';
  }
}

//Gradients:
var $gradientDef = makeSVG('defs'),
  gradientArray = [ 
    {quadTile: 'A', id: "gradA", color1: "#66cc33", color2: "#669933"},
    {quadTile: 'B', id: "gradB", color1: "#0099cc", color2: "#006699"},
    {quadTile: 'C', id: "gradC", color1: "#cc9966", color2: "#996633"},
    {quadTile: 'D', id: "gradD", color1: "#ffff33", color2: "#cc9933"},
    {quadTile: 'E', id: "gradE", color1: "#ff9900", color2: "#cc6600"},
    {quadTile: 'F', id: "gradF", color1: "#ff0000", color2: "#cc0000"},
    {quadTile: 'G', id: "gradG", color1: "#e4e6e3", color2: "#c3c5c2"}
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

function showTooltip(evt){
  $('div.pop').remove();
  var $div = $("<div>", {class: "quadTilePopup"});
  var topX = 0;
  var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/,
    matches = $('.chartSVG').css('-webkit-transform').match(matrixRegex);
  var scale = parseFloat(matches[0].slice(7,-1).split(' ')[0]);
  var left = scale * (parseInt(evt.target.getAttributeNS(null, 'cx')) + parseInt(topX)) + 10;
  var top = scale * (parseInt(evt.target.getAttributeNS(null, 'cy'))) - 45;
  var color = evt.target.getAttributeNS(null, 'fill'), colorHex;

  $div.html(
    "data: " + evt.target.getAttributeNS(null, 'data') + "<br \>"
    + "Item 1: " + evt.target.getAttributeNS(null, 'moreData1') + "<br \>"
    + "Item 2: " + evt.target.getAttributeNS(null, 'moreData2') + "<br \>"
    + "No. of points: " + evt.target.getAttributeNS(null, 'nof') + "<br \>");

  colorHex = "#e4e6e3";
  $div.addClass('backgroundPopup');
  $div.append('<span class="arrowLeftPopup quadTilePopupArow"></span>');

  $div.css({left: left, top: top});
  $(evt.target).parent().parent().append($div);
}

function quadTilePopup(){
  $('div.quadTilePopup').remove();
}

function preventPageScroll(evt){
  evt.preventDefault(); //Woah, this makes horizontal axis drag override page scroll!!!
}

function drawQuadTileCircles(hPad, vPad, hwidth, vheight, settings, $svg){
  var X1 = hPad + hwidth * (settings.x1Marker / 100),
    Y1 = vPad + vheight,
    X2 = X1,
    yMax = YMAX,
    Y2 = vPad + vheight * (1 - settings.yMarker / yMax) / 2;

  var cx = hPad + (X1 - hPad) / 2,
      cy = Y2,
      $quadTileLabel = makeSVG('text', 
          {x: cx - 4.2, y: cy + 5, 
            style: 'fill:#000; font-size:14px; font-weight: bold', class: 'quadTileCircleLabel'
          }),
      $quadTileCircle = makeSVG('circle', {cx: cx, cy: cy, r: 13, 
        fill: 'url(#gradE)', class: 'quadTileCircle'});

  $('.quadTileCircle').remove();
  $('.quadTileCircleLabel').remove();

  $quadTileLabel.textContent = '5';
  $svg.append($quadTileCircle)
    .append($quadTileLabel);

  cy = vPad + vheight * (1 - settings.yMarker * 0.5/ yMax);
  $quadTileLabel = makeSVG('text', 
        {x: cx - 4.2, y: cy + 5, 
          style: 'fill:#000; font-size:14px; font-weight: bold', class: 'quadTileCircleLabel'
        });
  $quadTileCircle = makeSVG('circle', {cx: cx, cy: cy, r: 13, 
      fill: 'url(#gradF)', class: 'quadTileCircle'});

  $quadTileLabel.textContent = '6';
  $svg.append($quadTileCircle)
    .append($quadTileLabel);

  X1 = hPad + hwidth * (settings.x2Marker / 100);
  Y1 = vPad + vheight;
  X2 = X1;
  Y2 = vPad + vheight * (1 - settings.yMarker / yMax) / 2;
 
  cx += (X1 - hPad) / 2;
  cy = Y2;
  $quadTileLabel = makeSVG('text', 
        {x: cx - 4.2, y: cy + 5, 
          style: 'fill:#000; font-size:14px; font-weight: bold', class: 'quadTileCircleLabel'
        })
  $quadTileCircle = makeSVG('circle', {cx: cx, cy: cy, r: 13, 
      fill: 'url(#gradC)', class: 'quadTileCircle'});

  $quadTileLabel.textContent = '3';
  $svg.append($quadTileCircle)
    .append($quadTileLabel);

  cy = vPad + vheight * (1 - settings.yMarker * 0.5/ yMax);
  $quadTileLabel = makeSVG('text', 
        {x: cx - 4.2, y: cy + 5, 
          style: 'fill:#000; font-size:14px; font-weight: bold', class: 'quadTileCircleLabel'
        })
  $quadTileCircle = makeSVG('circle', {cx: cx, cy: cy, r: 13, 
      fill: 'url(#gradD)', class: 'quadTileCircle'});

  $quadTileLabel.textContent = '4';
  $svg.append($quadTileCircle)
    .append($quadTileLabel);

  cx = X1 + (hwidth + hPad - X1)/2;
  cy = Y2;
  $quadTileLabel = makeSVG('text', 
        {x: cx - 4.2, y: cy + 5, 
          style: 'fill:#000; font-size:14px; font-weight: bold', class: 'quadTileCircleLabel'
        })
  $quadTileCircle = makeSVG('circle', {cx: cx, cy: cy, r: 13, 
      fill: 'url(#gradA)', class: 'quadTileCircle'});

  $quadTileLabel.textContent = '1';
  $svg.append($quadTileCircle)
    .append($quadTileLabel);

  cy = vPad + vheight * (1 - settings.yMarker * 0.5/ yMax);
  $quadTileLabel = makeSVG('text', 
        {x: cx - 4.2, y: cy + 5, 
          style: 'fill:#000; font-size:14px; font-weight: bold', class: 'quadTileCircleLabel'
        })
  $quadTileCircle = makeSVG('circle', {cx: cx, cy: cy, r: 13, 
      fill: 'url(#gradB)', class: 'quadTileCircle'});

  $quadTileLabel.textContent = '2';
  $svg.append($quadTileCircle)
    .append($quadTileLabel);
}
