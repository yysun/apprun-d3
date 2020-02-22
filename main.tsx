import app from 'apprun';
import * as d3 from 'd3';
import * as topojson from 'topojson';

const width = 960;
const height = 500;
const map = ({ datum }) => {
  if (!datum) return;
  const projection = d3.geoEqualEarth();
  const path = d3.geoPath().projection(projection);
  const graticule = d3.geoGraticule();

  const svg = d3
    .select('svg')
    .attr('width', width)
    .attr('height', height);

  svg
    .append('defs')
    .append('path')
    .datum({ type: 'Sphere' })
    .attr('id', 'sphere')
    .attr('d', path);

  svg
    .append('use')
    .attr('class', 'stroke')
    .attr('xlink:href', '#sphere');

  svg
    .append('use')
    .attr('class', 'fill')
    .attr('xlink:href', '#sphere');

  svg
    .append('path')
    .datum(graticule)
    .attr('class', 'graticule')
    .attr('d', path);

  svg
    .append('path')
    .datum(datum)
    .attr('class', 'land')
    .attr('d', path);
};

const state = {};

const view = state => (
  <div>
    <svg id="svg" ref={() => map(state)}></svg>
  </div>
);

const update = {
  '#': async () => {
    const world = await d3.json('world-110m.json');
    return { datum: topojson.feature(world, world.objects.land) };
  }
};

app.start(document.body, state, view, update);
