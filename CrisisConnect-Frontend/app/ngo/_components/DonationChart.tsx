"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function DonationChart(props: {
  calls: { title: string; raisedAmount: string; targetAmount: string }[];
}) {
  const { calls } = props;
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || calls.length === 0) return;

    const width = 500;
    const barHeight = 28;
    const gap = 14;
    const height = calls.length * (barHeight + gap);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height).attr("viewBox", "0 0 " + width + " " + height);

    const maxTarget = d3.max(calls, (call) => Number(call.targetAmount)) || 1;
    const scale = d3.scaleLinear().domain([0, maxTarget]).range([0, width - 130]);

    const bars = svg
      .selectAll("g")
      .data(calls)
      .enter()
      .append("g")
      .attr("transform", (_call, index) => "translate(0," + index * (barHeight + gap) + ")");

    bars
      .append("rect")
      .attr("x", 130)
      .attr("y", 0)
      .attr("width", (call) => scale(Number(call.targetAmount)))
      .attr("height", barHeight)
      .attr("rx", 4)
      .attr("fill", "#e2e8f0");

    bars
      .append("rect")
      .attr("x", 130)
      .attr("y", 0)
      .attr("width", (call) => scale(Number(call.raisedAmount)))
      .attr("height", barHeight)
      .attr("rx", 4)
      .attr("fill", "#2563eb");

    bars
      .append("text")
      .attr("x", 0)
      .attr("y", barHeight / 2)
      .attr("dy", "0.35em")
      .attr("font-size", 12)
      .text((call) => call.title);

    bars
      .append("text")
      .attr("x", (call) => 138 + scale(Number(call.raisedAmount)))
      .attr("y", barHeight / 2)
      .attr("dy", "0.35em")
      .attr("font-size", 11)
      .attr("fill", "#1e293b")
      .text((call) => call.raisedAmount + " / " + call.targetAmount);
  }, [calls]);

  if (calls.length === 0) {
    return <p className="text-sm text-slate-600">No donation calls yet.</p>;
  }

  return <svg ref={svgRef} className="max-w-full" />;
}
