import {
  select,
} from 'd3';

const width = document.body.clientWidth;
const height = document.body.clientHeight;

const svg = select('body')
  .append('svg')
    .attr('width', width)
    .attr('height', height);

const margin = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
};

const data = [1, 2, 3, 4, 5];

const g = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const circles = g.selectAll('circle')
  .data(data);

circles.enter()
  .append('circle')
    .attr('cx', d => d * 20)
    .attr('cy', d => d * 20)
    .attr('r', 10);