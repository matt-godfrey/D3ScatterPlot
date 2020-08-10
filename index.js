window.addEventListener('DOMContentLoaded', function() {

const req = new XMLHttpRequest();
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

let dataset = [];

const svg = d3.select('svg')
        // .attr('viewBox', '0 0 950 550');


    

  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;

  let yScale;
  let yAxis;

  let xScale;
  let xAxis;

 let fillFunction = (item) => {
   if (item.Doping === "") {
     return '#24ad00'
   } else {
     return '#ad5c00'
   }
  
 }

  let setScales = () => {

    let yValue = (d) => { 

      return new Date(d.Seconds * 1000)
    };
    
  let xValue = (d) => { return d.Year }

   

    yScale = d3.scaleTime()
        .domain([d3.min(dataset, yValue), d3.max(dataset, yValue)])
        .range([margin.top, innerHeight])

    xScale = d3.scaleLinear()
        .domain([d3.min(dataset, xValue), 
          d3.max(dataset, xValue)])
        .range([margin.right + margin.left, innerWidth])
}

  let drawCircles = () => {

    let tooltipDiv = d3.select('#chart').append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden')
    .style('position', 'absolute')
    .attr('data-html', true)


      svg.selectAll('circle').data(dataset)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => { return xScale(d.Year) })
        .attr('cy', (d) => { return yScale(new Date(d.Seconds * 1000)) })
        .attr('r', '6')
        .attr('data-xvalue', (d) => { return d.Year })
        .attr('data-yvalue', (d) => { return new Date(d.Seconds * 1000) })
        .attr('fill', (d) => { return fillFunction(d) })
        .on('mouseover', function(d) {

          tooltipDiv.transition()
                    .duration(50)
                    .style('visibility', 'visible')
                  .style('left', `${d3.event.pageX}`+"px")
                  .style('top', `${d3.event.pageY}`+"px")
                  .style('border', '1px solid black')
                  .style('width', '140px')
                  .style('height', '75px')
                  .style('border-radius', '5px')
                  .style('opacity', '0.6')
                  .style('background-color', 'gray')
                  .style('box-shadow', '2px 2px 2px 3px')
                  .style('font-size', 'small')

        tooltipDiv.text(d.Name+": "+d.Nationality
        +" Year: " + d.Year+", " + "Time: " + d.Time + " " + d.Doping)
                  .attr('data-year', d.Year)

        })
        .on('mouseout', function(d) {
          
          tooltipDiv.transition()
                    .duration(50)
                    .style('visibility', 'hidden')
        })
     
  }

 
  let drawAxes = () => {

    yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.timeFormat('%M:%S'))
      
    xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format('d'));
      

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate('+ (0) +', '+ (innerHeight) +')')

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate('+ (margin.left + margin.right) +', '+ (0) +')')
  }

req.open('GET', url, true);
req.send();
req.onload = function() {
    dataset = JSON.parse(req.responseText);
    
    console.log(dataset)
    setScales();
    drawAxes();
    drawCircles();
}



})