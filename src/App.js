import React, { Component } from 'react';
import * as d3 from 'd3';
import 'd3-selection-multi';
import * as topojson from 'topojson';
import './App.css';

class App extends Component {
  async componentDidMount() {
    const JSON_URLS = [
      'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json',
      'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'
    ];
    const data = await Promise.all(JSON_URLS.map(URL => fetch(URL).then(res => res.json())));
    this.drawMap(data[0], data[1]);
  }

  drawMap = (edData, coData) => {
    console.log(coData);
    const height = 900;
    const width = 1200;
    const margin = {
      top: 100,
      right: 120,
      bottom: 150,
      left: 120
    };

    const geojson = topojson.feature(coData, coData.objects.counties);

    const countyEdData = d => edData.filter(co => co.fips === d.id)[0];

    const colorDomain = [
      d3.min(edData.map(co => co.bachelorsOrHigher)),
      d3.max(edData.map(co => co.bachelorsOrHigher))
    ];

    const colors = [
      'hsl(200, 60%, 90%)',
      'hsl(200, 60%, 80%)',
      'hsl(200, 60%, 70%)',
      'hsl(200, 60%, 60%)',
      'hsl(200, 60%, 50%)',
      'hsl(200, 60%, 40%)',
      'hsl(200, 60%, 30%)',
      'hsl(200, 60%, 20%)',
      'hsl(200, 60%, 10%)'
    ];

    const colorScale = d3
      .scaleQuantize()
      .domain(colorDomain)
      .range(colors);

    const svg = d3
      .select('#graph')
      .append('svg')
      .attrs({
        height,
        width
      });

    const tooltip = d3
      .select('#graph')
      .append('div')
      .attr('id', 'tooltip');

    svg
      .append('g')
      .attrs({
        id: 'map',
        transform: `translate(${margin.left}, ${margin.top})`
      })
      .selectAll('path')
      .data(geojson.features)
      .enter()
      .append('path')
      .attrs({
        class: 'county',
        d: d3.geoPath(),
        fill: d => colorScale(countyEdData(d).bachelorsOrHigher),
        'data-fips': d => d.id,
        'data-education': d => countyEdData(d).bachelorsOrHigher
      })
      .on('mouseover', d => {
        const { state, area_name: areaName, bachelorsOrHigher } = countyEdData(d);
        tooltip
          .text(`${areaName}, ${state}\n${bachelorsOrHigher}%`)
          .attr('data-year', d.year)
          .style('visibility', 'visible')
          .style(
            'top',
            `${d3.event.target.getBoundingClientRect().top - 60 + window.pageYOffset}px`
          )
          .style('left', `${d3.event.target.getBoundingClientRect().left - 60}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    svg
      .append('g')
      .attrs({
        id: 'legend',
        transform: 'translate(710, 150)'
      })
      .selectAll('rect')
      .data(colors)
      .enter()
      .append('rect')
      .attrs({
        class: 'legend-cell',
        height: 15,
        width: 30,
        x: (d, i) => 30 * i,
        fill: d => d
      });
  };

  render() {
    return <div id="graph" />;
  }
}

export default App;
