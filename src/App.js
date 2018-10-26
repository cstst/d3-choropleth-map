import React, { Component } from 'react';
import * as d3 from 'd3';
import 'd3-selection-multi';
import * as topojson from 'topojson';

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
    const height = 900;
    const width = 1200;
    const margin = {
      top: 100,
      right: 120,
      bottom: 150,
      left: 120
    };

    const geoJSON = topojson.feature(coData, coData.objects.counties);

    const edDataDomain = [
      d3.min(edData.map(co => co.bachelorsOrHigher)),
      d3.max(edData.map(co => co.bachelorsOrHigher))
    ];

    const countyEdData = d => edData.filter(co => co.fips === d.id)[0];

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
      .domain(edDataDomain)
      .range(colors);

    const svg = d3
      .select('#graph')
      .append('svg')
      .attrs({
        height,
        width
      });

    const map = svg.append('g').attrs({
      id: 'map',
      transform: `translate(${margin.left}, ${margin.top})`
    });

    const legend = svg.append('g').attrs({
      id: 'legend',
      transform: 'translate(720, 150)'
    });

    const legendScale = d3
      .scaleLinear()
      .domain(edDataDomain)
      .range([0, 270]);

    const legendAxis = d3
      .axisBottom(legendScale)
      .tickValues(d3.range(edDataDomain[0] + 8.05, edDataDomain[1] - 8.05, 8.05))
      .tickFormat(n => `${Math.round(n)}%`)
      .tickSizeOuter(0);

    const tooltip = d3
      .select('#graph')
      .append('div')
      .attrs({
        id: 'tooltip'
      })
      .styles({
        position: 'absolute',
        visibility: 'hidden',
        background: 'white',
        padding: '0.25em',
        border: '1px solid black',
        opacity: 0.8,
        'text-align': 'center',
        'white-space': 'pre-wrap',
        'z-index': 10
      });

    svg
      .append('text')
      .attrs({
        id: 'title',
        x: width / 2,
        y: margin.top / 2
      })
      .styles({
        'text-anchor': 'middle',
        'font-size': '2em'
      })
      .text('United States Educational Attainment');

    svg
      .append('text')
      .attrs({
        id: 'description',
        x: width / 2,
        y: margin.top / 1.2
      })
      .styles({
        'text-anchor': 'middle'
      })
      .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");

    map
      .selectAll('path')
      .data(geoJSON.features)
      .enter()
      .append('path')
      .attrs({
        class: 'county',
        d: d3.geoPath(),
        fill: d => colorScale(countyEdData(d).bachelorsOrHigher),
        'data-fips': d => d.id,
        'data-education': d => countyEdData(d).bachelorsOrHigher
      })
      .on('mouseover', function(d) {
        const { state, area_name: areaName, bachelorsOrHigher } = countyEdData(d);
        d3.select(this).styles({
          stroke: 'black',
          'stroke-width': 0.75
        });
        tooltip
          .text(`${areaName}, ${state}\n${bachelorsOrHigher}%`)
          .attrs({
            'data-education': bachelorsOrHigher
          })
          .styles({
            visibility: 'visible'
          })
          .style(
            'top',
            `${d3.event.target.getBoundingClientRect().top - 70 + window.pageYOffset}px`
          )
          .style('left', `${d3.event.target.getBoundingClientRect().left - 65}px`);
      })
      .on('mouseout', function() {
        d3.select(this).styles({
          stroke: 'none'
        });
        tooltip.style('visibility', 'hidden');
      });

    legend
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

    legend
      .append('g')
      .attrs({
        id: 'legend-axis',
        transform: 'translate(0, 15)'
      })
      .call(legendAxis)
      .select('.domain')
      .remove();
  };

  render() {
    return <div id="graph" />;
  }
}

export default App;
