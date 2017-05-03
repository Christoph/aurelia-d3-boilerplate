import * as d3 from "d3";
import {inject, noView, bindable, bindingMode, BindingEngine} from 'aurelia-framework';

@inject(Element, BindingEngine)
@noView()
export class BarChart {
  // External variables
  @bindable data = [];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) mo;

  // Aurelia variables
  private element;
  private subscription;

  // D3 variables
  private svg;
  private tooltip;
  private x;
  private y;

  // set the dimensions and margins of the graph
  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  width = 960 - this.margin.left - this.margin.right;
  height = 500 - this.margin.top - this.margin.bottom;

  constructor(element, private bindingEngine) {
    this.element = element;
    this.initChart()
  }

  unbind() {
    this.subscription.dispose();
  }

  // This is called after creating the chart element and
  // the data gets loaded the first time.
  dataChanged(newList) {
    if (this.data) {
      // subscribe to the data array and watch for changes
      this.subscription = this.bindingEngine
        .collectionObserver(this.data)
        .subscribe(splices => this.dataMutated(splices));
    }

    this.updateChart();
  }

  // Update the chart if the data changes
  dataMutated(splices) {
    this.updateChart();
  }



  initChart() {
    // append the svg object to the chart div of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    this.svg = d3.select(this.element)
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
      "translate(" + this.margin.left + "," + this.margin.top + ")");

    // set the ranges
    this.x = d3.scaleBand()
      .range([0, this.width])
      .padding(0.1);
    this.y = d3.scaleLinear()
      .range([this.height, 0]);

    // add the x Axis
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .attr("class", "xAxis");

    // add the y Axis
    this.svg.append("g")
      .attr("class", "yAxis");

    // create tooltip
    this.tooltip = d3.select(this.element).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  updateChart() {
    // Update domains
    this.x.domain(this.data.map((d) => d["salesperson"]));
    this.y.domain([0, d3.max<any, any>(this.data, (d) => d["sales"])]);

    // Select chart
    let chart = this.svg.selectAll(".bar")
      .data(this.data)

    // Update axis
    this.svg.selectAll(".xAxis")
      .call(d3.axisBottom(this.x));
    this.svg.selectAll(".yAxis")
      .call(d3.axisLeft(this.y));

    // Add and update bars
    chart.enter()
      .append("rect")
      .attr("class", "bar")
      .on("mouseover", (d) => {
        this.mo = d["salesperson"];

        this.tooltip.transition()
          .duration(100)
          .style("opacity", .9);
        this.tooltip.html(d["salesperson"])
          .style("left", (this.x(d["salesperson"]) + this.x.bandwidth() / 2) + "px")
          .style("top", (this.y(d["sales"]) + 60) + "px");
      })
      .on("mouseout", (d) => {
        this.tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .merge(chart)
      .attr("width", this.x.bandwidth())
      .attr("x", (d) => this.x(d["salesperson"]))
      .transition()
      .attr("y", (d) => this.y(d["sales"]))
      .attr("height", (d) => this.height - this.y(d["sales"]));

    // Remove bars
    chart.exit().remove();
  }
}
