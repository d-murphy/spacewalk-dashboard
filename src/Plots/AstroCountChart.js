import * as d3 from 'd3'
import { useResizeDetector } from 'react-resize-detector'
import { useEffect, useRef } from 'react'
import {spreadToRowPerAstro, calcCountPerAstro} from '../Util'
import './SummaryChart.css'

const AstroCountChart = ({filterMissionData}) => {

    const xAxisRef = useRef(null)
    const yAxisRef = useRef(null)

    let TimelineDotData = filterMissionData

    var rowPerAstroData = spreadToRowPerAstro(TimelineDotData)
    var ReducedAstroData = calcCountPerAstro(rowPerAstroData)

    const AstroCount = Object.values(ReducedAstroData)
    const sortedAstroCount = AstroCount
        .sort((a,b) => (b.numMissions -a.numMissions))
        .slice(0,10)

    const {width: widthRs, ref} = useResizeDetector();

    const height = 200
    const margin = {top: 25, right:20, bottom: 30, left: 100}

    const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(sortedAstroCount.map(d=>d.numMissions))])
        .range([0, widthRs-margin.right-margin.left])
    
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format("1"))
        .ticks(3);

    const yScale = d3
        .scaleBand()
        .domain(sortedAstroCount.map(d => d.astroName))
        .range([margin.top, height-margin.bottom])
        .paddingInner(0.1)
        .paddingOuter(0.5)
    const yAxis = d3.axisLeft().scale(yScale)

    useEffect(() => {
        d3.select(xAxisRef.current).call(xAxis) 
        d3.select(yAxisRef.current).call(yAxis)
    },[xAxis,yAxis])

    useEffect(() =>{
         d3.selectAll('rect')
            .on('mouseover', function(event) {
                var tt1X = event.pageX - 90
                var tt1Y = event.pageY - 100
                d3.select("#AstroCountChartMouseover")
                  .style("left", tt1X + "px")
                  .style("top", tt1Y + "px")
                  .html(event.srcElement.attributes.message.nodeValue)
                  .classed("hidden", false)
            })
            .on("mouseout", function() {
                d3.select("#AstroCountChartMouseover").classed("hidden", true)
            })
    })

    return(
        <div className="AstroCountChart" ref={ref}>
            <div id="AstroCountChartMouseover" className="hidden"></div>
            <svg viewBox={`0 0 ${widthRs} ${height}`}>

                <g >
                    {sortedAstroCount.map((d,i) => {
                        return(
                            <rect key={i}
                                x={margin.left}
                                y={yScale(d.astroName)}
                                height={yScale.bandwidth()}
                                width={xScale(d.numMissions)}
                                fill= {d.astroCountry==='USA' ? 'rgba(37, 37, 216, .5)' : 'rgba(216, 37, 37, .5)'}
                                message={`<center><b>${d.astroName}</b><br/><br/>
                                          <b># of Spacewalks</b>: ${d.numMissions}<br />
                                          <b>Hours in Space</b>: ${Math.round(d.totalMinsInSpace/60)}<br />
                                          <b>Years</b>: ${d.yearsActiveMax===d.yearsActiveMin ? d.yearsActiveMin : `${d.yearsActiveMin}-${d.yearsActiveMax}`}
                                          </center>`}


                            />
                        )
                    })}
                </g>
                <g>
                    <g ref={xAxisRef} transform={`translate(${margin.left} ${height-margin.bottom})`}/>
                    <g ref={yAxisRef} transform={`translate(${margin.left} 0)`}/>
                    <g>
                        <text transform={`translate(${widthRs-widthRs*.5} ${height}) `}
                         className="yAxisLabel"># of Missions</text>
                    </g>
                    <g>
                        <text transform={`translate(${widthRs-widthRs*.72} ${margin.top-8}) `}
                         className="title">Individual Spacewalk Count</text>
                    </g>
                </g>
            </svg>            
        </div>
    )
    
}
export default AstroCountChart
