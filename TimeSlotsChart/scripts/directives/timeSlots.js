var initThresholds = false,
    hPad = 120,
    vPad = 120;

angular.module('app.directives').directive('timeSlotsChart', ['$document', 'Settings', '$timeout', function($document, Settings, $timeout) {

  settings = Settings;

  function getChart(Settings, dataDefinition, timeSlots) {
    w = parseInt($('.timingsChart').css('width'));
    h = parseInt($('.timingsChart').css('height')) - 20;

    var hwidth = w - 2 * hPad,
      vheight = h - 2 * vPad,
      xstep = hwidth / 10,
      ystep = vheight / 10,
      settings = Settings.get();

    var $svg = $('<svg class="chartSVG">'),
      darkLineStyle = "stroke:#000;stroke-width:1",
      lightLineStyle = "stroke:#111;stroke-width:0.5",
      circleStyle = "stroke:#000;stroke-width:1;fill:#0f0;opacity:0.5;",
      circleStyleBack = "stroke:#000;stroke-width:1;fill:#00f;opacity:0.5;",
      dragAxisStyle = 'fill:#555;stroke:#555;stroke-width:4;opacity:0.5';
        
    $svg.css({'width': w + 'px'});

    var $yAxis = makeSVG('line', {x1: hPad, y1: vPad, x2: hPad, y2: vPad + vheight, style: darkLineStyle}),
    $yLabel = makeSVG('text', 
      {x: hPad - 50, y: vPad - 30, 
        style: 'fill:#000; font-size:14px;font-weight:bold;'
      }),
    $xAxis = makeSVG('line', {x1: hPad, y1: vPad + vheight, x2: w - hPad, y2: vPad + vheight, style: darkLineStyle}),
    $xLabel = makeSVG('text', 
      {x: hPad + hwidth / 2 - 16, y: vPad + vheight + 50, 
        style: 'fill:#000; font-size:14px;font-weight:bold;'
      }),
    $origin = makeSVG('text', 
      {x: hPad - 25, y: vPad + vheight + 5, 
        style: 'fill:#000; font-size:12px'
      });

    $yLabel.textContent = 'Data (%)';
    $xLabel.textContent = 'Time';
    $origin.textContent = '0';

    $svg.append($xAxis)
      .append($xLabel)
      .append($yAxis)
      .append($yLabel)
      .append($origin);

    for(var step = 0, y = vPad, $x, $y; step < 10; step++) {
      $y = makeSVG('line', {x1: hPad, y1: y, x2: w - hPad, y2: y, style: lightLineStyle});
      var $yLabel = makeSVG('text', 
        {x: hPad - 30, y: y + 5,   
          style: 'fill:#000; font-size:12px'
        });
      $yLabel.textContent = (10 - step) * 10;
      $svg.append($y)
        .append($yLabel);
      y += ystep;
    }

    var totalHours = 12, timeRange = false, $x;

    for(var hour = 0, text = '0000', x = hPad; hour < totalHours; hour++){
      $x = makeSVG('line', {x1: x, y1: vPad, x2: x, y2: vPad + vheight, style: lightLineStyle});
      $xLabel = makeSVG('text', 
        {x: x - 15, y: vPad + vheight + 30, 
          style: 'fill:#000; font-size:14px;'
        });
      $xLabel.textContent = text;
      $svg.append($x).append($xLabel);
      x += hwidth / totalHours;
      text = timeRange ? (hour + 1) * 100 : (hour + 1) * 2 * 100;
      text = text.toString().length == 4 ? text : '0' + text;
    }

    $x = makeSVG('line', {x1: x, y1: vPad, x2: x, y2: vPad + vheight, style: lightLineStyle});
    $xLabel = makeSVG('text', 
      {x: x - 15, y: vPad + vheight + 30, 
        style: 'fill:#000; font-size:14px;'
      });
    $xLabel.textContent = '2400';
    $svg.append($x).append($xLabel);

    var dataPoints = dataDefinition;
    var pointColor = dataPoints[0].data;
    for(var point = 0; point < dataPoints.length; point++) {
      var x = hPad + minutesToPercent(dataPoints[point].time)/2400*hwidth,
       y = vPad + vheight * (1 - dataPoints[point].y / 100);
      
      var data = dataPoints[point].data,
        moreData = dataPoints[point].moreData,
        time = dataPoints[point].time,
        numberOfPoints = dataPoints[point].n_points;
      
      var $circle = makeSVG('circle', {cx: x, cy: y, r: 5, data: data, time: time, moreData: moreData, nop: numberOfPoints, 
        style: data == pointColor ? circleStyleBack : circleStyle,
        onmouseover: "showTooltip(evt)", onmouseout: "chartPopup()"});

      $svg.append($circle);
    }

    $circle = makeSVG('circle', {cx: hwidth - 60, cy: 35, r: 5, style: circleStyleBack});
    $xLabel = makeSVG('text', 
      {x: hwidth - 50, y: 40, style:'fill:#000;font-size:14px;'});
    $xLabel.textContent = 'Data 1';
    $svg.append($circle).append($xLabel);

    $circle = makeSVG('circle', {cx: hwidth + 30, cy: 35, r: 5, style: circleStyle});
    $xLabel = makeSVG('text', 
      {x: hwidth + 38, y: 40, style:'fill:#000;font-size:14px;'});
    $xLabel.textContent = 'Data 2';
    $svg.append($circle).append($xLabel);

   var X1, Y1, X2, Y2;
   
    X1 = hPad + hwidth * (settings.loadFactorStart / 100);
    Y1 = vPad + vheight;
    X2 = X1;
    Y2 = vPad;

    var hrWidth = hwidth/24;
    $('.deptTime').remove();
    settings.currentTimeSlotsStartTime = [];
    settings.selectedDeptTimings = [];
    if(timeSlots && !isNaN(timeSlots)){
      for(var slot = 0; slot < timeSlots - 1; slot ++){
        X1 = X2 = hPad + hwidth * (slot + 1) / timeSlots;
        var hh = Math.round((X1 - hPad) / hrWidth);
        hh = hh.toString().length == 1 ? '0' + hh : hh;
        settings.currentTimeSlotsStartTime[slot] = {};
        settings.currentTimeSlotsStartTime[slot].value = settings.selectedDeptTimings[slot] = hh + '00';
        settings.currentTimeSlotsStartTime[slot].position = settings.timeSlotsStartTime[slot] = X1;
        $draggableLoadFactorStart = makeSVG('path', 
          { d: 'M' + X1 + ' ' + (Y1 + 12) + ' ' + X2 + ' ' + (Y2 - 32), 
            class: "draggable",
            style: dragAxisStyle,
            transform: "matrix(1 0 0 1 0 0)",
            onmousedown: "selectElement(evt)",
            ontouchstart: "selectElement(evt)",
            ongesturestart: "selectElement(evt)",
            direction: "x",
            deptTimeAxis: slot
          });
        $svg.append($draggableLoadFactorStart);
      }
    }
    console.log(settings.selectedDeptTimings)

    $globalSVG = $svg;
    //final SVG
    return $svg;
  }

  return {
		restrict: 'E',
    scope: {
        data: "=",
        slots: "="
    },
		link: function(scope, element, attrs) {
      console.log('Dept Timings Chart')

      scope.$watch(function() {return scope.data;}, function(value){
        if(!value) return;
        console.log('Data loaded. Drawing Dept Timings chart');
        $(element).find('.timingsChart')
          .html(getChart(Settings, scope.data, scope.slots));

        // var scale = 1.1,
        //   zoomedWidth = parseInt($('.timingsChart').css('width'))*scale,
        //   zoomedHeight = parseInt($('.timingsChart').css('height'))*scale;

        // console.log(zoomedWidth, zoomedHeight);
        
        // $('.magnifier-lense-content').css({'width': zoomedWidth, 'height': zoomedHeight});
        // $('.magnifier-lense-content').html($('.timingsChart').html());
        // $('.timingsChartBox').on('mousemove', function(event){
        //   // var left = $('.timingsChartBox').css('left'),
        //   //   top = $('.timingsChartBox').css('top');
        //   // console.log(left, top);
        //   var size = parseInt($('.magnifier-lense').css('width')) + 10;
        //   console.log(size)
        //   console.log(event.clientX, event.clientY);
        //   $('.magnifier').css({'left': event.clientX - 20 - size/2, 'top': event.clientY - 80 - size - 90});
        //   $('.magnifier-lense *').css({'left': -(event.clientX - 35 - size/2) / scale, 'top': -(event.clientY - 80 - size - 155) / scale})
        // });

        // $timeout(function(){
        //   $('.magnifier-lense-content svg').css({'width': zoomedWidth});
        // }, 100);
        
      }, true);

      scope.$watch(function() {return scope.slots;}, function(value){
        if(!value) return;
        console.log('Time Slots Changed. Drawing Dept Timings chart');
        $(element).find('.timingsChart')
          .html(getChart(Settings, scope.data, scope.slots));
        //$('.magnifier-lense-content').html($('.timingsChart').html());
      }, true);

		}
	};
}]);

function moveTimeAxis(evt, settings){
  evt.preventDefault(); //Woah, this helps drag horizontal axis!!! Also, drag is much more smoother!!!
  if(!selectedElement) return;

  w = parseInt($('.timingsChart').css('width'));
  h = parseInt($('.timingsChart').css('height'));

  var s = settings.get(),
    // hPad = 60,
    // vPad = 70,
    hwidth = w - 2 * hPad,
    vheight = h - 2 * vPad,
    bpaxLevel = vPad + vheight * (1 - s.bpaxLevel / 100),
    loadFactorStart = hPad + hwidth * s.loadFactorStart / 100,
    loadFactorEnd = hPad + hwidth * s.loadFactorEnd / 100,
    currentLoadFactorStart = hPad + hwidth * s.currentLoadFactorStart / 100,
    currentLoadFactorEnd = hPad + hwidth * s.currentLoadFactorEnd / 100,
    slotStartTime = s.timeSlotsStartTime,
    currentSlotsStartTime = s.currentTimeSlotsStartTime,
    hrWidth = hwidth / 24;

  if (evt.touches){
      evt.clientX = evt.touches[0].clientX;
      evt.clientY = evt.touches[0].clientY;
  }

  dx = evt.clientX - currentX;
  dy = evt.clientY - currentY;
  var xx = currentMatrix[4];
  if(direction == 'x') {
    if(deptTimeAxis == 0) {
      if((slotStartTime[0] + currentMatrix[4] + dx > hPad) &&
        (slotStartTime[0] + currentMatrix[4] + dx < currentSlotsStartTime[1].position)) {
        currentMatrix[4] += dx;
      }
    } else 
    if(deptTimeAxis+1 == s.timeSlotsCount-1) {
      if((slotStartTime[deptTimeAxis] + currentMatrix[4] + dx > currentSlotsStartTime[deptTimeAxis-1].position) &&
        (slotStartTime[deptTimeAxis] + currentMatrix[4] + dx < hPad + hwidth)) {
        currentMatrix[4] += dx;
      }
    } else {
      if((slotStartTime[deptTimeAxis] + currentMatrix[4] + dx > currentSlotsStartTime[deptTimeAxis-1].position) &&
        (slotStartTime[deptTimeAxis] + currentMatrix[4] + dx < currentSlotsStartTime[deptTimeAxis+1].position)) {
        currentMatrix[4] += dx;
      }
    }
  }

  newMatrix = "matrix(" + currentMatrix.join(' ') + ")";
  if(selectedElement) {
    selectedElement.setAttributeNS(null, "transform", newMatrix);
  }

  currentSlotsStartTime[deptTimeAxis].position += (currentMatrix[4] - xx);
  var hh = Math.round((currentSlotsStartTime[deptTimeAxis].position - hPad) / hrWidth);
  hh = hh.toString().length == 1 ? '0' + hh : hh;
  currentSlotsStartTime[deptTimeAxis].value = s.selectedDeptTimings[deptTimeAxis] = hh + '00';
  console.log(s.selectedDeptTimings[deptTimeAxis]);
  $('.deptTime' + deptTimeAxis).css({'left': currentSlotsStartTime[deptTimeAxis].position, 'z-index': 1000});
  $('.deptTime' + deptTimeAxis).html(currentSlotsStartTime[deptTimeAxis].value);
   
  currentX = evt.clientX;
  currentY = evt.clientY;
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
  console.log('selected');
  selectedElement = evt.target;
  direction = selectedElement.getAttributeNS(null, "direction");
  dragging = selectedElement.getAttributeNS(null, "loadFactor");
  deptTimeAxis = parseInt(selectedElement.getAttributeNS(null, "deptTimeAxis"));
  currentX = evt.clientX;
  currentY = evt.clientY;
  currentMatrix = selectedElement.getAttributeNS(null, "transform").slice(7,-1).split(' ');
  for(var i=0; i<currentMatrix.length; i++) {
    currentMatrix[i] = parseFloat(currentMatrix[i]);
  }
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

function showTooltip(evt){
  $('div.pop').remove();
  var $div = $("<div>", {class: "chartPopup"});
  var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/,
    matches = $('.chartSVG').css('-webkit-transform').match(matrixRegex);
  var scale = parseFloat(matches[0].slice(7,-1).split(' ')[0]);
  var left = scale * (parseInt(evt.target.getAttributeNS(null, 'cx'))) + 10;
  var top = scale * (parseInt(evt.target.getAttributeNS(null, 'cy'))) - 45;
  var color = evt.target.getAttributeNS(null, 'fill'), colorHex;

  $div.html(
    "data: " + evt.target.getAttributeNS(null, 'data') + "<br \>"
    + "time: " + evt.target.getAttributeNS(null, 'time') + "<br \>"
    + "More Data: " + evt.target.getAttributeNS(null, 'moreData') + "<br \>"
    + "No. of Points: " + evt.target.getAttributeNS(null, 'nop') + "<br \>");

  //colorHex = "#e4e6e3";
  $div.addClass('backgroundPopup');
  $div.append('<span class="arrowLeftPopup chartPopupArow"></span>');

  $div.css({left: left, top: top});
  $(evt.target).parent().parent().append($div);
}

function chartPopup(){
  $('div.chartPopup').remove();
}

function preventPageScroll(evt){
  evt.preventDefault(); //Woah, this makes horizontal axis drag override page scroll!!!
}

function makeSVG(tag, attrs) {
  var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var k in attrs) {
    el.setAttribute(k, attrs[k]);
  }
  return el;
}

function minutesToPercent(time){
  var minutes = time % 100, hrs = parseInt(time / 100), timePercent;
  
  minutes = parseInt(minutes/60 * 100);
  timePercent = hrs * 100 + minutes;

  return timePercent;
}