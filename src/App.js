import React, { Component } from 'react';
import * as d3 from 'd3';
import 'd3-selection-multi';
import * as topojson from 'topojson';
import './App.css';

class App extends Component {
  async componentDidMount() {
    const JSON_URLS = [
      'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json',
      'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json',
    ];
    const data = await Promise.all(JSON_URLS.map(URL => fetch(URL).then(res => res.json())));
    this.drawMap(data[0], data[1]);
  }

  drawMap = (edData, coData) => {
    const height = 900;
    const width = 1200;
    const margin = {
      top: 100, right: 120, bottom: 150, left: 120,
    };
    const geojson = topojson.feature(coData, coData.objects.counties);

    function coEdDataFinder(d) {
      return edData.filter(co => co.fips === d.id)[0];
    }

    const svg = d3.select('#graph')
      .append('svg')
      .attrs({
        height,
        width,
      });

    const tooltip = d3.select('#graph')
      .append('div')
      .attr('id', 'tooltip');
    /*
    svg.append('rect')
       .attrs({
         id: 'border',
         height,
         width,
         fill: 'none',
         stroke: 'red',
         'stroke-width': 5
       });
    */
    svg.append('g')
      .attrs({
        id: 'map',
        transform: `translate(${margin.left}, ${margin.top})`,
      })
      .selectAll('path')
      .data(geojson.features)
      .enter()
      .append('path')
      .attrs({
        class: 'country',
        d: d3.geoPath(),
        'data-fips': d => d.id,
        'data-education': d => coEdDataFinder(d).bachelorsOrHigher,
      })
      .on('mouseover', (d) => {
        const { state, area_name: areaName, bachelorsOrHigher } = coEdDataFinder(d);
        tooltip.text(`${areaName}, ${state}\n${bachelorsOrHigher}%`)
          .attr('data-year', d.year)
          .style('visibility', 'visible')
          .style('top', `${d3.event.target.getBoundingClientRect().top - 60 + window.pageYOffset}px`)
          .style('left', `${d3.event.target.getBoundingClientRect().left - 60}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });
  }

  render() {
    return (
      <div id="graph" />
    );
  }
}

export default App;
