//Set the margins
var outerWidth = 500;
var outerHeight = 250;
var margin = { left: 130, top: 0, right: 0, bottom: 30 };
var barPadding = 0.2;

var innerWidth  = outerWidth  - margin.left - margin.right;
var innerHeight = outerHeight - margin.top  - margin.bottom;

//Top yearly movements as barcharts
var xColumn = "People";
var yColumn = "Movement";

var svg = d3.select("body").append("svg")
.attr("width",  outerWidth)
.attr("height", outerHeight);
var g = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var xAxisG = g.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + innerHeight + ")");
var yAxisG = g.append("g")
.attr("class", "y axis");

var xScale = d3.scale.linear().range(      [0, innerWidth]);
var yScale = d3.scale.ordinal().rangeBands([0, innerHeight], barPadding);

var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
.ticks(5)                   // Use approximately 5 ticks marks.
.tickFormat(d3.format("s")) // Use intelligent abbreviations, e.g. 5M for 5 Million
.outerTickSize(0);          // Turn off the marks at the end of the axis.
var yAxis = d3.svg.axis().scale(yScale).orient("left")
.outerTickSize(0);          // Turn off the marks at the end of the axis.

function render(data){
  //adjust axes
  xScale.domain([0, d3.max(data, function (d){ return d[xColumn]; })]);
  yScale.domain(       data.map( function (d){ return d[yColumn]; }));
  xAxisG.call(xAxis);
  yAxisG.call(yAxis);
  //bind data
  var bars = g.selectAll("rect").data(data);
  //enter
  bars.enter().append("rect")
    .attr("height", yScale.rangeBand())
    .attr("fill", "grey");
  //update
  bars
    .attr("x", 0)
    .attr("y",     function (d){ return yScale(d[yColumn]); })
    .attr("width", function (d){ return xScale(d[xColumn]); });
  //exit
  bars.exit().remove();
}


function type(d){
  d.population = +d.population;
  return d;
}

var testdata = [{"Movement": "SYDE",
        "People": 4000000,
        "Year": 1983},
       {"Movement": "Buenos Aires",
        "People": 13076300,
        "Year": 1982},
       {"Movement": "Mumbai",
        "People": 12691836,
        "Year": 1984}];


//select initial selected data
render(testdata.filter(function(d){
    var x = document.getElementById("year");
    var a = x.options[x.selectedIndex].value;
    return d["Year"] <= a;}))

//Update graph when dropdown changes due to changes in selected data
d3.select('#year')
  .on('change', function() {
    var a = eval(d3.select(this).property('value'));
    var dataUpdate = testdata.filter(function(d) {return d["Year"] <= a})
    render(dataUpdate);
});