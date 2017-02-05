//Generate dropdown list
var select = '';
for (i=1980;i<=2013;i++){
	select += '<option val=' + i + '>' + i + '</option>';
}
$('#year_selector').html(select);
//TODO: Think about a slider instead ...

////////////////////////////////////////////////////////////////////////////////////////////////
//1 - The following is for the bar chart////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Set the margins
var outerWidth = 400;
var outerHeight = 400;
var margin = { left: 200, top: 0, right: 5, bottom: 30 };
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
  xScale.domain([0, maxMigrationCtryToCtry]);
  yScale.domain(data.map( function (d){ return d[yColumn]; }));
  xAxisG.call(xAxis);
  yAxisG.call(yAxis);
  //bind data
  var bars = g.selectAll("rect").data(data);
  //enter
  bars.enter().append("rect")
    .attr("height", yScale.rangeBand())
    .attr("class", "bar")
	.on("mouseover", function(){
		d3.select(this).classed("selected", true);
	})
	.on("mouseout", function(){
		d3.select(this).classed("selected", false);
	});
  //update //TOCHECK: probably include exit in update!!!
  bars
    .attr("x", 0)
    .attr("y",     function (d){ return yScale(d[yColumn]); })
    .attr("width", function (d){ return xScale(d[xColumn]); });
  //exit
  bars.exit().remove();
}

////////////////////////////////////////////////////////////////////////////////////////////////	
// 2 - Map related /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

//Preperation happening
var outerWidthGeo = 800;
var outerHeightGeo = 400;
var marginGeo = { left: 200, top: 0, right: 5, bottom: 30 };
var barPaddingGeo = 0.2;	
var l2OffsetDistance = 50;
var scaleStrokeWidth = d3.scale.linear().domain([0, 1000*1000])
										.range([0.2, 10]);

var innerWidthGeo  = outerWidthGeo  - marginGeo.left - marginGeo.right;
var innerHeightGeo = outerHeightGeo - marginGeo.top  - marginGeo.bottom;

var svgGeo = d3.select("body").append("svg")
	.attr("width",  outerWidthGeo)
	.attr("height", outerHeightGeo);

//Define arrow head
svgGeo.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 4)
    .attr("refY", 2)
    .attr("markerWidth", 6)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0,0 V 4 L6,2 Z"); //this is actual shape for arrowhead
	
//Mapping to the SVG
var projection = d3.geo.mercator()
				   .scale(100)
				   .translate([innerWidthGeo / 2, innerHeightGeo / 1.2])
				   .center([0,-30]);
var path = d3.geo.path().projection(projection);

//Add the world map
function drawWorldMap(jsonName, callback){
	d3.json(jsonName, function(json) {
	svgGeo.selectAll(".country")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("class", "country")
		.on('mouseover', function(d) {
			// Add the class "selected"
			d3.select(this).classed("selected-country", true)
		})
		.on('mouseout', function(d) {
			// Remove the class "selected"
			d3.select(this).classed("selected-country", false)
		});
		});
	callback()
}

function renderArrows(data){
	//bind data
	var flows = svgGeo.selectAll(".flow").data(data);
	//enter
	flows.enter().append("line")
		.attr("class", "flow")
		.attr("marker-end", "url(#arrowhead)");;
	//update
	flows.attr("x1", function(d){return projection([d[oFlowLong], 0])[0];})
		.attr("y1", function(d){return projection([0, d[oFlowLat]])[1];})
		.attr("x2", function(d){
			var orig = projection([d[oFlowLong], d[oFlowLat]]),
				dest = projection([d[dFlowLong], d[dFlowLat]]);
			var z = Math.sqrt(l2OffsetDistance / (Math.pow(orig[0]-dest[0],2) + Math.pow(orig[1]-dest[1],2)));
			return dest[0] + z*(orig[0]-dest[0]);
			})
		.attr("y2", function(d){
			var orig = projection([d[oFlowLong], d[oFlowLat]]),
				dest = projection([d[dFlowLong], d[dFlowLat]]);
			var z = Math.sqrt(l2OffsetDistance / (Math.pow(orig[0]-dest[0],2) + Math.pow(orig[1]-dest[1],2)));
			console.log(z);
			console.log(dest[1]);
			return dest[1] + z*(orig[1]-dest[1]);
			})
		.attr("stroke-width", function(d) {return scaleStrokeWidth(d[xColumn]);});
	//exit
	flows.exit().remove();
}

////////////////////////////////////////////////////////////////////////////////////////////////	
// 3 - General things happpening ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
var dropdown = document.getElementById("year_selector");
var a = +dropdown.options[dropdown.selectedIndex].value;
var dMigPerCtry, dCurrentSelection;


function type(d){
	d["Year"] = +d["Year"];
	d["Migrants"] = +d["Migrants"];
	return d;
	}

//Load initial data
drawWorldMap("world_countries.json", function(d){
		d3.csv("MigrationPerCountry_Top10_v02.csv", type, function(d) {
			//Filter for respective year
			dMigPerCtry = d;
			dCurrentSelection = d.filter(function(data){
				return  data["Year"] === a;
				});
			//SetMaxFlow
			maxMigrationCtryToCtry = d3.max(d, function (d){ return d[xColumn]; })
			//Initialize visulations with current data
			render(dCurrentSelection);
			renderArrows(dCurrentSelection);
		})
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