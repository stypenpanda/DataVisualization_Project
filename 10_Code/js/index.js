//Generate dropdown list
var select = '';
for (i=1980;i<=2013;i++){
	select += '<option val=' + i + '>' + i + '</option>';
}
$('#year_selector').html(select);
//TODO: Think about a slider instead ...

////////////////////////////////////////////////////////////////////////////////////////////////
//1 - The following is for the bubble chart////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Set the margins
var outerWidth = 500;
var outerHeight = 500;
var margin = { left: 50, top: 5, right: 5, bottom: 30 };

var innerWidth  = outerWidth  - margin.left - margin.right;
var innerHeight = outerHeight - margin.top  - margin.bottom;

//Top yearly movements as barcharts
var xColumn = "Migrants_in",
	yColumn = "Migrants_out",
	zColumn = "Population";

var svg = d3.select("body").append("svg")
	.attr("width",  outerWidth)
	.attr("height", outerHeight);
//THE FOLLOWING NEEDS TO BE CHANGED
//IDEA: ON THE LEFT THE IMMIGRANTS AND ON THE RIGHT THE EMIGRANTS ...
var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var xAxisG = g.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + innerHeight + ")")
	.text("# of immigrants");
var yAxisG = g.append("g")
	.attr("class", "y axis")
	//.attr("transform", "rotate(-90)")
	.text("# of emigrants");

var maxMigration, maxPopulation
var xScale = d3.scale.linear().range([0, innerWidth]);
var yScale = d3.scale.linear().range([innerHeight, 0]);
var circleScale = d3.scale.sqrt().range([0, 30]);

var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
	.ticks(5)                   // Use approximately 5 ticks marks.
	.tickFormat(d3.format("s")) // Use intelligent abbreviations, e.g. 5M for 5 Million
	.outerTickSize(0);          // Turn off the marks at the end of the axis.
var yAxis = d3.svg.axis().scale(yScale).orient("left")
	.ticks(5)                   // Use approximately 5 ticks marks.
	.tickFormat(d3.format("s")) // Use intelligent abbreviations, e.g. 5M for 5 Million
	.outerTickSize(0);          // Turn off the marks at the end of the axis.

function render(data){
  //adjust axes
  xScale.domain([0, maxMigration]);
  yScale.domain([0, maxMigration]);
  circleScale.domain([0, maxPopulation]);
  xAxisG.call(xAxis);
  yAxisG.call(yAxis);
  //bind data
  var bubbles = g.selectAll("circle").data(data);
  //enter
  bubbles.enter().append("circle")
    .attr("class", "circle")
/*	.on("mouseover", function(){
		d3.select(this).classed("selected-bar", true);
		var cId = d3.select(this).attr("id");
		svgGeo.select("#" + cId + "1")
				.classed("selected-flow", true)
				.attr("marker-end", "url(#arrowhead-selected)");
		//var selStroke = svgGeo.select()
	})
	.on("mouseout", function(){
		d3.select(this).classed("selected-bar", false);
		var cId = d3.select(this).attr("id");
		svgGeo.select("#" + cId + "1")
				.classed("selected-flow", false)
				.attr("marker-end", "url(#arrowhead)");
	});
*/
  //update
  bubbles.attr("cx", function (d){ return yScale(d[xColumn]); })
    .attr("cy", function (d){
		console.log(yScale(d[yColumn]));
		return yScale(d[yColumn]); })
    .attr("r", function (d){ return circleScale(d[zColumn]); })
	.attr("country", function (d){return d["Country"]})
	.attr("continent", function (d){return d["Continent"]})
	.attr("fill", "black");
  //exit
  bubbles.exit().remove();
}


////////////////////////////////////////////////////////////////////////////////////////////////	
// 3 - General things happpening ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
var dropdown = document.getElementById("year_selector");
var a = +dropdown.options[dropdown.selectedIndex].value;
var dMigPerCtry, dCurrentSelection;

function type(d){
	d["Year"] = +d["Year"];
	d[xColumn] = +d[xColumn];
	d[yColumn] = +d[yColumn];
	d[zColumn] = +d[zColumn];
	return d;
	}

//Load initial data
d3.csv("BubbleChart.csv", type, function(d) {
	//Filter for respective year
	dMigPerCtry = d;
	dCurrentSelection = d.filter(function(data){
		return  data["Year"] === a;
		});
	//SetMaxValues
	maxEmigration = d3.max(d, function (d){ return d[xColumn]; });
	console.log('maxEmigration', maxEmigration);
	maxImmigration = d3.max(d, function (d){ return d[yColumn]; });
	console.log('maxImmigration', maxImmigration);
	maxMigration = Math.max(maxEmigration, maxImmigration) *1.2;
	console.log('Max migration ', maxMigration)
	maxPopulation = d3.max(d, function (d){ return d[zColumn];});
	//Initialize visulations with current data
	render(dCurrentSelection);

});

//Update graph when dropdown changes due to changes in selected data
d3.select('#year_selector')
  .on('change', function() {
    a = +eval(d3.select(this).property('value'));
    dCurrentSelection = dMigPerCtry.filter(function(data){
			return  data["Year"] === a;
			});
	render(dCurrentSelection);
	renderArrows(dCurrentSelection);
	});