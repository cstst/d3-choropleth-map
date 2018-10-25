import React, { Component } from 'react';
import * as topojson from 'topojson';
import * as d3 from 'd3';
import 'd3-selection-multi';
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
    const bachData = edData.map(co => co.bachelorsOrHigher);
    const geoJSON = topojson.feature(coData, coData.objects.counties);

    console.log(d3.min(bachData), d3.max(bachData));

    const colors = [
      'hsl(0, 50%, 90%)',
      'hsl(0, 50%, 80%)',
      'hsl(0, 50static%, 70%)',
      'hsl(0, 50%, 60%)',
      'hsl(0, 50%, 50%)',
      'hsl(0, 50%, 40%)',
      'hsl(0, 50%, 30%)',
      'hsl(0, 50%, 20%)',
    ];

    const svg = d3.select('#graph')
      .append('svg')
      .attrs({
        height,
        width,
      });

    svg.append('g')
      .attrs({
        id: 'map',
        transform: `translate(${margin.left}, ${margin.top})`,
      })
      .selectAll('path')
      .data(geoJSON.features)
      .enter()
      .append('path')
      .attrs({
        class: 'county',
        d: d3.geoPath(),
        'data-fips': d => d.id,
        'data-education': d => edData.filter(co => co.fips === d.id)[0].bachelorsOrHigher,
      });
  }

  render() {
    return (
      <div id="graph" />
    );
  }
}

export default App;
