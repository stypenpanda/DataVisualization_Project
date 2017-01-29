//Generate dropdown list
var select = '';
for (i=1980;i<=2013;i++){
	select += '<option val=' + i + '>' + i + '</option>';
}
$('#year_selector').html(select);
//TODO: Think about a slider instead ...



//Set the margins
var outerWidth = 400;
var outerHeight = 400;
var margin = { left: 200, top: 0, right: 5, bottom: 30 };
var barPadding = 0.2;

var innerWidth  = outerWidth  - margin.left - margin.right;
var innerHeight = outerHeight - margin.top  - margin.bottom;

//Top yearly movements as barcharts
var xColumn = "Migrants";
var yColumn = "Flow";

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

var maxMigrationCtryToCtry;
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
  xScale.domain([0, maxMigrationCtryToCtry//d3.max(data, function (d){ return d[xColumn]; })
				]);
  yScale.domain(       data.map( function (d){ return d[yColumn]; }));
  xAxisG.call(xAxis);
  yAxisG.call(yAxis);
  //bind data
  var bars = g.selectAll("rect").data(data);
  //enter
  bars.enter().append("rect")
    .attr("height", yScale.rangeBand())
    .attr("fill", "grey");
  //update //TOCHECK: probably include exit in update!!!
  bars
    .attr("x", 0)
    .attr("y",     function (d){ return yScale(d[yColumn]); })
    .attr("width", function (d){ return xScale(d[xColumn]); });
  //exit
  bars.exit().remove();
}
var dropdown = document.getElementById("year_selector");


//Load and plot initial selection
function type(d){
	d["Year"] = +d["Year"];
	d["Migrants"] = +d["Migrants"];
	return d;
	}

var a = +dropdown.options[dropdown.selectedIndex].value;
var dMigPerCtry, dCurrentSelection;

//Load initial data
d3.csv("MigrationPerCountry_Top10.csv", type, function(d) {
		//Filter for respective year
		dMigPerCtry = d;
		maxMigrationCtryToCtry = d3.max(d, function (d){ return d[xColumn]; })
		dCurrentSelection = d.filter(function(data){
			return  data["Year"] === a;
			});
		render(dCurrentSelection);
	});


//Update graph when dropdown changes due to changes in selected data
d3.select('#year_selector')
  .on('change', function() {
    a = +eval(d3.select(this).property('value'));
    dCurrentSelection = dMigPerCtry.filter(function(data){
			return  data["Year"] === a;
			});
	render(dCurrentSelection)
	});