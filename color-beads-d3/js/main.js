import {
  select,
  scaleLinear,
  max,
  axisBottom,
  axisLeft,
} from 'd3';

const margin = {
  top: 200,
  bottom: 200,
  left: 200,
  right: 200
};

const width = document.body.clientWidth;
const height = document.body.clientHeight;
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
      value: Math.round(Math.random() * 100),
    });
  }
}

console.log(data);
// const data = [0, 1, 2, 3, 4, 5];

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

g.append('g').call(yAxis)

// Circles
const circles = g.selectAll('circle')
  .data(data);

circles.enter()
  .append('circle')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 20);