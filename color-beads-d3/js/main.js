import {
  select,
  scaleLinear,
  max,
  axisBottom,
  axisLeft,
  event,
} from 'd3';

const width = document.body.clientWidth;
const height = document.body.clientHeight;
const margin = {
  top: height * .2,
  bottom: height * .2,
  left: width * .25,
  right: width * .25
};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const svg = select('body')
  .append('svg')
    .attr('width', width)
    .attr('height', height);

// Data
const rowCount = 10;
const columnCount = 10;
let data = [];

for (let r = 1; r <= rowCount; r++) {
  for(let c = 1; c <= columnCount; c++) {
    data.push({
      x: c,
      y: r,
      value: Math.round(Math.random() * 6 + 1),
      class: '',
    });
  }
}

console.log(data);

// Scale
const xScale = scaleLinear()
  .domain([0, max(data, d => d.x)])
  .range([0, innerWidth]);

const yScale = scaleLinear()
  .domain([0, max(data, d => d.y)])
  .range([innerHeight, 0]);

const g = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Axes
const xAxis = axisBottom(xScale)
  .tickSize(-innerHeight);
const yAxis = axisLeft(yScale)
  .tickSize(-innerWidth);

g.append('g').call(xAxis)
  .attr('transform', `translate(0, ${innerHeight})`);

g.append('g').call(yAxis);

// Gradients
const gradientArray = [
  {bead: 1, id: "grad1", color1: "#66cc33", color2: "#669933"},
  {bead: 2, id: "grad2", color1: "#0099cc", color2: "#006699"},
  {bead: 3, id: "grad3", color1: "#cc9966", color2: "#996633"},
  {bead: 4, id: "grad4", color1: "#ffff33", color2: "#cc9933"},
  {bead: 5, id: "grad5", color1: "#ff9900", color2: "#cc6600"},
  {bead: 6, id: "grad6", color1: "#ff0000", color2: "#cc0000"},
  {bead: 7, id: "grad7", color1: "#e4e6e3", color2: "#c3c5c2"}
];

const defs = g.append('defs');
const gradients = defs.selectAll('linearGradient')
  .data(gradientArray)
  .enter().append('linearGradient')
    .attr('id', d => d.id)
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%');

gradients
  .append('stop')
    .attr('offset', '0%')
    .attr('style', d => `stop-color:${d.color1};stop-opacity:1`);

gradients
  .append('stop')
    .attr('offset', '100%')
    .attr('style', d => `stop-color:${d.color2};stop-opacity:1`);

// Shadow
const filter = defs.append("filter")
  .attr("id", "drop-shadow")
  .attr("height", "130%");

filter.append("feGaussianBlur")
  .attr("in", "SourceAlpha")
  .attr("stdDeviation", 5)
  .attr("result", "blur");

filter.append("feOffset")
  .attr("in", "blur")
  .attr("dx", 5)
  .attr("dy", 5)
  .attr("result", "offsetBlur");

const feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
  .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
  .attr("in", "SourceGraphic");

let groups, circles;

const render = () => {
  // Grouping for circle and text
  groups = g.selectAll('g.groups').data(data)
    .enter().append('g')
      .attr('class', 'groups')
      .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`);

  // Circles
  circles = groups
    .append('circle')
      .attr('r', 20)
      .attr('class', d => d.class)
      .style('fill', d => `url(#grad${d.value})`);

  // Text
  groups
    .append('text')
    .text(d => d.value)
    .attr('class', d => d.class)
    .attr('text-anchor', 'middle')
    .attr('dy', 7);
  setInteractivity();
};

const setInteractivity = () => {
  // Interactivity
  circles.on('click', function(d) {
    event.stopPropagation();
    const circleSelected = d;

    select('#tray').remove();
    const tray = g.append('g')
      .attr('id', 'tray')
      .attr('transform', `translate(${innerWidth / 2 - 120}, ${yScale(d.y - .5)})`);

    tray.append('rect')
      .attr('width', 310)
      .attr('height', 60)
      .attr('fill', '#fff')
      .attr('stroke-width', 2)
      .style("filter", "url(#drop-shadow)");

    const gradientGrp = tray.selectAll('g.gradient')
      .data(gradientArray.filter(g => g.bead !== d.value ))
      .enter().append('g')
      .attr('transform', (d, i) => `translate(${i * 50 + 30},30)`);

    const gradientCircles = gradientGrp.append('circle')
      .attr('r', 20)
      .attr('class', 'updated')
      .style('fill', d => `url(#${d.id})`);

    gradientGrp.append('text')
      .text(d => d.bead)
      .attr('text-anchor', 'middle')
      .attr('dy', 7);

    // Update Circle Interactivity
    gradientCircles.on('click', d => {
      const selectedCircleData = data[circleSelected.y * rowCount + circleSelected.x - rowCount - 1];
      selectedCircleData.value = d.bead;
      selectedCircleData.class = 'updated';
      groups.remove();
      render();
    });
  });
};

svg.on('click', () => {
  select('#tray').remove();
});

render();