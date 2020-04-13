import {
  select,
  scaleLinear,
  max,
  median,
  axisBottom,
  axisLeft,
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
const data = [];

for (let r = 1; r <= rowCount; r++) {
  for(let c = 1; c <= columnCount; c++) {
    data.push({
      x: c,
      y: r,
      value: Math.round(Math.random() * 10),
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

const colorScale = scaleLinear()
  .domain([0, median(data, d=> d.value), max(data, d=> d.value)])
  .range(['#66cc33', '#ffff33', '#e4e6e3']);

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
  {bead: 0, id: "grad0", color1: "#66cc33", color2: "#669933"},
  {bead: 1, id: "grad1", color1: "#66cc33", color2: "#669933"},
  {bead: 2, id: "grad2", color1: "#0099cc", color2: "#006699"},
  {bead: 3, id: "grad3", color1: "#cc9966", color2: "#996633"},
  {bead: 4, id: "grad4", color1: "#ffff33", color2: "#cc9933"},
  {bead: 5, id: "grad5", color1: "#ff9900", color2: "#cc6600"},
  {bead: 6, id: "grad6", color1: "#ff0000", color2: "#cc0000"},
  {bead: 7, id: "grad7", color1: "#e4e6e3", color2: "#c3c5c2"},
  {bead: 8, id: "grad8", color1: "#e4e6e3", color2: "#c3c5c2"},
  {bead: 9, id: "grad9", color1: "#e4e6e3", color2: "#c3c5c2"},
  {bead: 10, id: "grad10", color1: "#e4e6e3", color2: "#c3c5c2"}
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

// Grouping for circle and text
const groups = g.selectAll('g.groups').data(data)
  .enter().append('g')
    .attr('class', 'groups')
    .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`);

// Circles
const circles = groups
  .append('circle')
    .attr('r', 20)
    .style('fill', d => `url(#grad${d.value})`);

// Text
groups
.append('text')
  .text(d => d.value)
  .attr('text-anchor', 'middle')
  .attr('dy', 7);

// Interactivity
circles.on('click', d => {
  const tray = g.append('g')
    .attr('transform', `translate(${innerWidth / 2 - 250}, ${innerHeight / 2 - 30})`);

  tray.append('rect')
    .attr('width', 510)
    .attr('height', 60)
    .attr('fill', '#fff')
    .attr('stroke', '#bbb')
    .attr('stroke-width', 2);

  let bead = 0;
  gradientArray.forEach(grad => {
    if(grad.bead !== d.value) {
      const grp = tray.append('g')
        .attr('transform', `translate(${bead++ * 50 + 30},30)`);

      grp.append('circle')
        .attr('r', 20)
        .style('fill', () => `url(#${grad.id})`);

      grp.append('text')
        .text(grad.bead)
        .attr('text-anchor', 'middle')
        .attr('dy', 7);
    }
  })
});
