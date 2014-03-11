﻿function BarChart(element, dimension, group) {

    BaseChart.call(this, element, dimension, group);

    var self = this;

    this.x = d3.scale.ordinal();
    this.y = d3.scale.linear();

    this.xFormatFunc = function (d) {
        return d;
    }


    this.yAxis = d3.svg.axis()
					  .scale(this.y).orient("left").tickSize(0).tickPadding(10);

    this.xAxis = d3.svg.axis()
                      .scale(this.x).orient("bottom").tickSize(0).tickPadding(10).tickFormat(function (d) { return self.xFormatFunc(d); });

    this.xAxisFormat = function (f) {
        this.xFormatFunc = f;
        return this;
    }

    this.labelAnchoring = function (d) {
        if (this.invert()) {
            return "start";
        }
        else { return "end"; }
    };

    this.initializeAxes = function () {
        this.x.domain(this.keys())
                .rangeRoundBands([0, this.width() - this.margin().left - this.margin().right], 0.2);

        this.y.domain([0, d3.max(this.group().all(), function (d) { return self._valueAccessor(d); })])
                .range([this.height() - this.margin().top - this.margin().bottom, 0]);
    }

    this.filterKey = function (d) {
        return d.key;
    }

    this.labelYPosition = function (d) {
        var yPos = self.height() - self.yBounds().start;

        if (self.invert()) {
            yPos = self.yBounds().start;
        }
        return yPos;
    }


    this.barYPosition = function (d) {

        var y = self.height() - self.yBounds().start - self.y(self._valueAccessor(d));

        var invert = self.invert();

        if (invert) {
            y = self.yBounds().start;
        }
        return y;
    }

    this.init = function () {
        var self = this;

        this.createChart();
        this.initializeAxes();

        var bars = this.chart.selectAll("rect.bar")
                        .data(this.dataset())
                        .enter().append("rect")
                            .attr("class", "bar")
                            .attr("x", function (d, i) { return self.x(d.key); })
                            .attr("y", function (d, i) { return self.y(self._valueAccessor(d)); })
                            .attr("width", function (d) { return self.x.rangeBand(); })
                            .attr("height", function (d) { return (self.height() - self.margin().top - self.margin().bottom) - self.y(self._valueAccessor(d)); })
                            .attr("fill", this.barColor)
                            .on("click", function (filter) { return self.filterClick(this, filter); })
                            .on("mouseover", function (d, item) { self.mouseOver(self, this, d); })
                            .on("mouseout", function (d, item) { self.mouseOut(self, this, d); });

        this.chart.append("g")
            .call(this.yAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", "12px")
            .style("fill", "#333")

        this.chart.append("g")
           .attr("transform", "translate(0," + (self.height() - self.margin().bottom - self.margin().top) + ")")
           .call(this.xAxis)
           .selectAll("text")
           .style("text-anchor", "end")
           .style("font-size", "12px")
           .style("fill", "#333")
           .attr("transform", function (d) { return "rotate(-90," + 0 + "," + 15 + ")"; });

    }

    this.draw = function () {

        var self = this;

        self.chart.selectAll("rect")
            .data(this.dataset())
            .transition().duration(self.duration)
            .attr("x", function (d, i) { return self.x(d.key); })
            .attr("y", function (d, i) { return self.y(self._valueAccessor(d)); })
            .attr("width", function (d) { return self.x.rangeBand(); })
            .attr("height", function (d) { return (self.height() - self.margin().top - self.margin().bottom) - self.y(self._valueAccessor(d)); });
    }
}


BarChart.prototype = Object.create(BaseChart.prototype);
BarChart.prototype.constructor = BarChart;
