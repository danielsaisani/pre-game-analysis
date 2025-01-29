import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

const MARGIN = { top: 30, right: 30, bottom: 40, left: 50 };
const BUCKET_NUMBER = 20;
const BUCKET_PADDING = 4;

const COLORS = ["#e0ac2b", "#e85252"];

type HistogramProps = {
    width: number;
    height: number;
    data: { name: string; values: number[] }[];
};

export const Histogram = ({ width, height, data }: HistogramProps) => {
    const axesRef = useRef<SVGGElement | null>(null);
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const allGroupNames = data.map((group) => group.name);

    const colorScale = d3
        .scaleOrdinal<string>()
        .domain(allGroupNames)
        .range(COLORS);

    // Calculate total runs across all groups
    const totalRuns = data[0].values.length

    const xScale = useMemo(() => {
        const maxPerGroup = data.map((group) => Math.max(...group.values));
        const minPerGroup = data.map((group) => Math.min(...group.values))
        const max = Math.max(...maxPerGroup);
        const min = Math.min(...minPerGroup)
        return d3.scaleLinear().domain([min, max]).range([10, boundsWidth]).nice();
    }, [data, width]);


    const bucketGenerator = useMemo(() => {
        return d3
            .bin()
            .value((d) => d)
            .domain(xScale.domain() as [number, number])
            .thresholds(xScale.ticks(BUCKET_NUMBER));
    }, [xScale]);

    const groupBuckets = useMemo(() => {
        return data.map((group) => {
            const buckets = bucketGenerator(group.values);
            return {
                name: group.name,
                buckets: buckets.map(bucket => ({
                    ...bucket,
                    length: (bucket.length / totalRuns) * 100 // Convert to percentage of total runs
                }))
            };
        });
    }, [data, totalRuns]);

    const maxY = useMemo(() => {
        const maxPerBucket = groupBuckets.flatMap(group => group.buckets.map(bucket => bucket.length));
        return Math.max(...maxPerBucket);
    }, [groupBuckets]);

    const yScale = useMemo(() => {
        return d3.scaleLinear().range([boundsHeight, 0]).domain([0, maxY]).nice(); // Set domain to 0-100 for percentage
    }, [data, height]);

    useEffect(() => {
        const svgElement = d3.select(axesRef.current);
        svgElement.selectAll("*").remove();

        const xAxisGenerator = d3.axisBottom(xScale);
        svgElement
            .append("g")
            .attr("transform", "translate(0," + boundsHeight + ")")
            .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale).tickFormat(d => `${d}%`); // Format y-axis labels as percentages
        svgElement.append("g").call(yAxisGenerator);
    }, [xScale, yScale, boundsHeight]);

    const barWidth = (boundsWidth / (data.length * BUCKET_NUMBER)) - BUCKET_PADDING; // Calculate width for each bar
    const allRects = groupBuckets.map((group, i) =>
        group.buckets.map((bucket, j) => {
            const { x0, x1 } = bucket;
            if (x0 == undefined || x1 == undefined) {
                return null;
            }
            return (
                <rect
                    key={`${i}_${j}`}
                    fill={colorScale(group.name)}
                    opacity={0.7}
                    x={xScale(x0) + (i * (barWidth + BUCKET_PADDING))} // Adjust x position based on group index
                    width={barWidth}
                    y={yScale(bucket.length)}
                    height={boundsHeight - yScale(bucket.length)}
                />
            );
        })
    );

    return (
        <div>
            <svg width={width} height={height}>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
                >
                    {allRects}
                </g>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    ref={axesRef}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
                />
            </svg>
            <div className="flex justify-center mt-2.5">
                {allGroupNames.map((name) => (
                    <div key={name} className="flex items-center mx-2.5">
                        <div className="w-5 h-5 mr-2 rounded" style={{ backgroundColor: colorScale(name) }} />
                        <span>{name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
