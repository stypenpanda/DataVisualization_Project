////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//A - Latest migration flows////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

var xColumn1 = "Migrants_out",
		yColumn1 = "Migrants_in",
		zColumn = "Population";

colCon = {	"Australia": "green", "Europe": "blue",
		"Asia": "red", "North America": "yellow"}
////////////////////////////////////////////////////////////////////////////////////////////////
//2 - The following is for the bubble chart////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Set the margins
var outerWidth1 = 450;
var outerHeight1 = 450;
var margin1 = { left: 80, top: 15, right: 20, bottom: 50 };

var innerWidth1  = outerWidth1  - margin1.left - margin1.right;
var innerHeight1 = outerHeight1 - margin1.top  - margin1.bottom;

var svg1 = d3.select("#spanLatestMig").append("svg")
	.attr("width",  outerWidth1)
	.attr("height", outerHeight1)
	.attr();

//Add title
svg1.append("text")
	.text("[all countries with stats on immigrants & emigrants '13 displayed]")
	.style("text-anchor", "middle")
	.attr("x", outerWidth1/2 + margin1.left - margin1.right)
	.attr("y", 15)
	.attr("font-size", "0.7em");


var g1 = svg1.append("g")
	.attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");
var xAxisG1 = g1.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + innerHeight1 + ")");
var yAxisG1 = g1.append("g")
	.attr("class", "y axis");

var xAxisLabel1 = xAxisG1.append("text")
	.style("text-anchor", "middle")
	.attr("x", innerWidth1 / 2)
	.attr("y", 40)
	.attr("class", "label")
	.text("No. of emigrants");

var yAxisLabel1 = yAxisG1.append("text")
	.style("text-anchor", "middle")
	.attr("x", -(innerHeight1 / 2))
	.attr("y", -50)
	.attr("class", "label")
	.text("No. of immigrants")
	.attr("transform", "rotate(-90)");

var xScale1 = d3.scale.sqrt().range([0, innerWidth1]).domain([0, 1000000]);
var yScale1 = d3.scale.sqrt().range([innerHeight1, 0]).domain([0, 1000000]);
var circleScale = d3.scale.sqrt().range([0, 30]);

var xAxis1 = d3.svg.axis().scale(xScale1).orient("bottom")
	.ticks(5)                   // Use approximately 5 ticks marks.
	.tickFormat(d3.format("s")) // Use intelligent abbreviations, e.g. 5M for 5 Million
	.outerTickSize(0);          // Turn off the marks at the end of the axis.
var yAxis1 = d3.svg.axis().scale(yScale1).orient("left")
	.ticks(5)                   // Use approximately 5 ticks marks.
	.tickFormat(d3.format("s")) // Use intelligent abbreviations, e.g. 5M for 5 Million
	.outerTickSize(0);          // Turn off the marks at the end of the axis.
//add line with slope 1
g1.append("line")
  .style("stroke", "rgba(220,220,220, 1)")
  .attr("x1", xScale1(0))
  .attr("y1", yScale1(0))
	.attr("x2", xScale1(800000))
  .attr("y2", yScale1(800000));
//add "legend" to line
g1.append("line")
  .style("stroke", "rgba(220,220,220, 1)")
  .attr("x1", xScale1(600000))
  .attr("y1", yScale1(600000))
	.attr("x2", xScale1(550000))
  .attr("y2", yScale1(650000));
g1.append("path")
    .attr("d", "M " + xScale1(550000) + "," + yScale1(650000) +
							 " V" + yScale1(650000 - 30000) +
							 " L" + xScale1(550000 + 30000) + "," + yScale1(650000) +" Z")
		.attr("fill", "rgba(220,220,220, 1)");
g1.append("text")
		.text("more")
		.attr("x", xScale1(550000))
		.attr("y", yScale1(720000))
		.style("text-anchor", "middle")
		.attr("font-size", "0.7em")
		.style('fill', 'grey');
g1.append("text")
		.text("immigrants")
		.attr("x", xScale1(550000))
		.attr("y", yScale1(680000))
		.style("text-anchor", "middle")
		.attr("font-size", "0.7em")
		.style('fill', 'grey');
g1.append("line")
  .style("stroke", "rgba(220,220,220, 1)")
  .attr("x1", xScale1(550000))
  .attr("y1", yScale1(550000))
	.attr("x2", xScale1(600000))
  .attr("y2", yScale1(500000));
g1.append("path")
    .attr("d", "M " + xScale1(600000) + "," + yScale1(500000) +
							 " V" + yScale1(500000 + 30000) +
							 " L" + xScale1(600000 - 30000) + "," + yScale1(500000) +" Z")
		.attr("fill", "rgba(220,220,220, 1)");
g1.append("text")
		.text("more")
		.attr("x", xScale1(600000))
		.attr("y", yScale1(460000))
		.style("text-anchor", "middle")
		.attr("font-size", "0.7em")
		.style('fill', 'grey');
g1.append("text")
		.text("emigrants")
		.attr("x", xScale1(600000))
		.attr("y", yScale1(425000))
		.style("text-anchor", "middle")
		.attr("font-size", "0.7em")
		.style('fill', 'grey');

function renderBubble(data){
  //adjust axes
  circleScale.domain([0, maxPopulation]);
  xAxisG1.call(xAxis1);
  yAxisG1.call(yAxis1);

  //bind data
  var bubbles = g1.selectAll("circle").data(data);
  //enter
  bubbles.enter().append("circle")
    .attr("class", "circle")
		.on("mouseover", function(){
		var sel = d3.select(this);
		sel.classed("selected-circle", true);
		var current_position = d3.mouse(this);
		var ctryName = sel.attr("country");
		var rT = +sel.attr("r");
		svg1.append("text")
			.text(ctryName)
			.attr("class", "mouseover_text")
			.attr("x", +current_position[0]- rT+40)
			.attr("y", +current_position[1]- rT+25);
	})
	.on("mouseout", function(){
		var sel = d3.select(this);
		var ctryName = sel.attr("country");
		sel.classed("selected-circle", false);
		svg1.selectAll(".mouseover_text").remove();
	});
  //update
  bubbles.attr("cx", function (d){ return xScale1(d[xColumn1]); })
    .attr("cy", function (d){return yScale1(d[yColumn1]);})
    .attr("r", function (d) {return circleScale(d[zColumn]); })
		.attr("country", function (d) {return d["Country"]})
		.attr("continent", function (d) {return d["Continent"]})
		.attr("fill", function(d) {return colCon[d["Continent"]]});
  //exit
  bubbles.exit().remove();
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//B - The disintegratino of the Soviet Union////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
//1 - The following is for the bar chart////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Set the margins
var outerWidth = 420;
var outerHeight = 300;
var margin = { left: 200, top: 0, right: 25, bottom: 40 };
var barPadding = 0.2;

		var innerWidth  = outerWidth  - margin.left - margin.right;
var innerHeight = outerHeight - margin.top  - margin.bottom;

//Top yearly movements as barcharts
var xColumn = "Migrants",
	yColumn = "Flow";
var oFlowLat = "oLat",
	oFlowLong = "oLong",
	dFlowLat = "dLat",
	dFlowLong = "dLong";


var svg = d3.select("#div1992TopMig").append("svg")
			.attr("width",  outerWidth)
	.attr("height", outerHeight);
var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var xAxisG = g.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + innerHeight + ")");
var yAxisG = g.append("g")
	.attr("class", "y axis");
svg.append("text")
		.text("No. of migrants in top 10 flows 1992")
		.attr("font-size", "0.8em")
		.attr("x", outerWidth/2)
		.attr("y", outerHeight-10)
		.attr("alignment-baseline", "central");

var maxMigrationCtryToCtry;
	var xScale = d3.scale.linear().range(      [0, innerWidth]);
var yScale = d3.scale.ordinal().rangeBands([0, innerHeight], barPadding);

var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
	.ticks(3)                   // Use approximately 5 ticks marks.
	.tickFormat(d3.format("s")) // Use intelligent abbreviations, e.g. 5M for 5 Million
	.outerTickSize(0);          // Turn off the marks at the end of the axis.
var yAxis = d3.svg.axis().scale(yScale).orient("left")
	.outerTickSize(0);          // Turn off the marks at the end of the axis.

function render(data){
	//adjust axes
	xScale.domain([0, maxMigrationCtryToCtry]);
	yScale.domain(data.map( function (d){ return d[yColumn]; }));
	xAxisG.call(xAxis);
	yAxisG.call(yAxis);
	//bind data
	var bars = g.selectAll("rect").data(data);
	//enter
	bars.enter().append("rect")
		.attr("height", yScale.rangeBand())
		.attr("class", "bar2")
		.on("mouseover", function(){
			var sel = d3.select(this)
			sel.classed("selected-bar2", true);
					var cId = d3.select(this).attr("id");
			var migration = sel.attr("migration");
			var hT = sel.attr("height");
				var xT = +sel.attr("width") + margin.left + 5;
			var yT = +sel.attr("y") + margin.top + hT/2;
				svgGeo.select("#" + cId + "1")
					.classed("selected-flow", true)
					.attr("marker-end", "url(#arrowhead-selected)");
			//Display migration number
			svg.append("text")
				.text(d3.format("s")(migration))
				.attr("class", "mouseover_text")
				.attr("x", xT)
				.attr("y", yT)
				.attr("alignment-baseline", "central");
		})
	.on("mouseout", function(){
		d3.select(this).classed("selected-bar2", false);
				var cId = d3.select(this).attr("id");
			svgGeo.select("#" + cId + "1")
				.classed("selected-flow", false)
				.attr("marker-end", "url(#arrowhead)");
		//Delete migration number
		svg.selectAll(".mouseover_text").remove();
	});
//update - actually not required, but kept to have the same as in other file
	bars
		.attr("x", 0)
		.attr("y",     function (d){ return yScale(d[yColumn]); })
		.attr("width", function (d){ return xScale(d[xColumn]); })
		.attr("id", function (d){return d["ID"]})
		.attr("migration", function (d){return d[xColumn];});
	//exit - actually not required, but kept to have the same as in other file
	bars.exit().remove();
}

////////////////////////////////////////////////////////////////////////////////////////////////
// 2 - Map related /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

//Preperation happening
var outerWidthGeo = 650;
var outerHeightGeo = 300;
var marginGeo = { left: 200, top: 0, right: 5, bottom: 30 };
var l2OffsetDistance = 30;
	var scaleStrokeWidth = d3.scale.linear().domain([0, 1000*1000])
										.range([1, 15]);

		var innerWidthGeo  = outerWidthGeo  - marginGeo.left - marginGeo.right;
var innerHeightGeo = outerHeightGeo - marginGeo.top  - marginGeo.bottom;

var svgGeo = d3.select("#div1992TopMig").append("svg")
			.attr("width",  outerWidthGeo)
			.attr("height", outerHeightGeo);

//Define arrow head
svgGeo.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 1)
    .attr("refY", 1)
    .attr("markerWidth", 3)
    .attr("markerHeight", 2)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0,0 V 2 L3,1 Z"); //this is actual shape for arrowhead

svgGeo.append("defs").append("marker")
    .attr("id", "arrowheadOneOff")
    .attr("refX", 1)
    .attr("refY", 1)
    .attr("markerWidth", 3)
    .attr("markerHeight", 2)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0,0 V 2 L3,1 Z")
		.attr("fill", "grey"); //this is actual shape for arrowhead

svgGeo.append("defs").append("marker")
    .attr("id", "arrowhead-selected")
    .attr("refX", 1)
    .attr("refY", 1)
    .attr("markerWidth", 3)
    .attr("markerHeight", 2)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0,0 V 2 L3,1 Z")
		.attr("fill", "green");

//Mapping to the SVG
var projection = d3.geo.mercator()
				   .scale(300)
					   .translate([innerWidthGeo / 2, innerHeightGeo / 1.2])
				   .center([30,45]);
var path = d3.geo.path().projection(projection);


//Add the world map
function drawWorldMap(jsonName)
	{
	d3.json(jsonName, function(json) {
	svgGeo.selectAll(".country")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
			.attr("id", function(d) {
			return d["properties"]["name"];
		})
		.attr("class", "country")
		.on('mouseover', function(d) {
			var sel = d3.select(this)
			// Add the class selected to color the country
			sel.classed("selected-country", true);
			// Add country name
			var current_position = d3.mouse(this);
				var ctryName = sel[0][0].id;
			svgGeo.append("text")
				.text(ctryName)
				.attr("x", current_position[0]+5)
				.attr("y", current_position[1]-5)
				.attr("font-family", "sans-serif")
				.attr("font-size", "10px")
				.attr("fill", "black");
		})
		.on('mouseout', function(d) {
			// Remove the class "selected"
			d3.select(this).classed("selected-country", false);
			svgGeo.select("text").remove();
		});
		});
}

function renderArrows(data){
	//bind data
	var flows = svgGeo.selectAll(".flow").data(data);
	//enter
	flows.enter().append("line")
		.attr("class", "flow");
	//update
	flows.attr("x1", function(d){return projection([d[oFlowLong], 0])[0];})
		.attr("y1", function(d){return projection([0, d[oFlowLat]])[1];})
		//The following two attribute settings ensure that there is a little offset of the end of the arrow depending on the direction of the arrow
		.attr("x2", function(d){
			var orig = projection([d[oFlowLong], d[oFlowLat]]),
				dest = projection([d[dFlowLong], d[dFlowLat]]);
			var z = Math.sqrt(l2OffsetDistance / (Math.pow(orig[0]-dest[0],2) + Math.pow(orig[1]-dest[1],2)));
			return dest[0] + z*(orig[0]-dest[0]);
			})
		.attr("y2", function(d){
			var orig = projection([d[oFlowLong], d[oFlowLat]]),
				dest = projection([d[dFlowLong], d[dFlowLat]]);
			var z = 5* Math.sqrt(l2OffsetDistance / (Math.pow(orig[0]-dest[0],2) + Math.pow(orig[1]-dest[1],2)));
			return dest[1] + z*(orig[1]-dest[1]);
			})
				.attr("stroke-width", function(d) {return scaleStrokeWidth(d[xColumn]);})
				.attr("id", function (d){return d["ID"] + "1"})
		.attr("marker-end", "url(#arrowhead)");
	//exit
	flows.exit().remove();
}

////////////////////////////////////////////////////////////////////////////////////////////////
// 3 - General things happpening ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
var a = 1992;
var b = 2013;
var dMigPerCtry, dCurrentSelection;


function type(d){
	d["Year"] = +d["Year"];
	d["Migrants"] = +d["Migrants"];
	return d;
	}
function type2(d){
	d["Year"] = +d["Year"];
	d[xColumn1] = +d[xColumn1],
	d[yColumn1] = +d[yColumn1],
	d[zColumn] = +d[zColumn];
	return d;
}

//Load initial data
drawWorldMap("world_countries.json")
$(document).ready(
	function(){
		d3.csv("MigrationPerCountry_Top10_v04.csv", type, function(d) {
			//Filter for respective year
			dMigPerCtry = d;
			dCurrentSelection = d.filter(function(data){
				return  data["Year"] === a;
				});
			//SetMaxFlow
			//maxMigrationCtryToCtry = d3.max(d, function (d){ return d[xColumn]; })
			maxMigrationCtryToCtry = 250000
			//Initialize visulations with current data
			render(dCurrentSelection);
			renderArrows(dCurrentSelection);
			d3.select("#b").attr("class", "mig1992");
			d3.select("#c").attr("class", "mig1992");
			d3.select("#d").attr("class", "mig1992");
			d3.select("#e").attr("class", "mig1992");
			d3.select("#f").attr("class", "mig1992");
			d3.select("#g").attr("class", "mig1992");
			d3.select("#h").attr("class", "mig1992");
			d3.select("#i1").classed("flow", false)
					.attr("stroke", "grey")
					.attr("marker-end", "url(#arrowheadOneOff)");
		});
		d3.csv("BubbleChart.csv", type2, function(d)
		{
			dBubbles = d;
			dBubblesSelection = d.filter(function(data){
				return  data["Year"] === b;
				});
			dCurBubble = dBubblesSelection.filter(function(data){
					return data["Migrants_out"] > 0;
				});
			dCurBubble = dCurBubble.filter(function(data){
					return data["Migrants_in"] > 0;
				});
			//SetMaxValues
			/*maxEmigration = d3.max(d, function (d){ return d[xColumn1]; });
			maxImmigration = d3.max(d, function (d){ return d[yColumn1]; });*/
			maxMigration = 1000000//Math.max(maxEmigration, maxImmigration)*1.1;
			maxPopulation = d3.max(d, function (d){ return d[zColumn];});
			//Initialize visulations with current data
			renderBubble(dCurBubble);
		})
	})
