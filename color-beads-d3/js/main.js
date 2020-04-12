import {
  select,
} from 'd3';

const svg = select('body')
  .append('svg')
    .attr('width', document.body.clientWidth)
    .attr('height', document.body.clientHeight);
