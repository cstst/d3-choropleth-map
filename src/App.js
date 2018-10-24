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
    setInterval(() => this.drawMap({ edData: data[0], coData: data[1] }), 1000);
  }

  drawMap({ edData, coData }) {
    d3.select("svg").remove();
    const height = 900;
    const width = 1200;
    const margin = { top: 100, right: 120, bottom: 150, left: 120 };
    const geojson = topojson.feature(coData, coData.objects.counties);
    const svg = d3.select('#graph')
                  .append('svg')
                  .attrs({ 
                    height, 
                    width,
                  });
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
         d: d3.geoPath(),
         fill: () => '#' + Math.random().toString(16).slice(-6)
       }); 
  }


  
  render() {
    return (
      <div id="graph"/>
    );
  }
}

export default App;
