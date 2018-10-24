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
    this.drawMap({ edData: data[0], coData: data[1] });
  }

  drawMap({ edData, coData }) {
    const height = 600;
    const width = 1200;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const geojson = topojson.feature(coData, coData.objects.counties);
  
    const svg = d3.select('#graph')
                  .append('svg')
                  .attrs({ 
                    height, 
                    width 
    
                  });
                
    svg.selectAll('path')
       .data(geojson.features)
       .enter()
       .append('path')
       .attr('d', d3.geoPath())
    
  }


  
  render() {
    return (
      <div id="graph"/>
    );
  }
}

export default App;
