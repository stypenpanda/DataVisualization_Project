//Generate dropdown list
var select = '';
for (i=1980;i<=2013;i++){
	select += '<option val=' + i + '>' + i + '</option>';
}
$('#year_selector').html(select);
//TODO: Think about a slider instead ...
var xColumn = "Migrants_out",
	yColumn = "Migrants_in",
	zColumn = "Population";
var maxMigration, maxPopulation;

//Colors continent:
colCon = {	"Australia": "green", "Europe": "blue",
"Asia": "red", "North America": "yellow"}
	

////////////////////////////////////////////////////////////////////////////////////////////////
//1 - The following is for the first bar chart////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Set the margins
var outerWidth2 = 500;
var outerHeight2 = 500;
var margin2 = { left: 150, top: 30, right: 100, bottom: 50 };
var barPadding = 0.2;

var innerWidth2  = outerWidth2  - margin2.left - margin2.right;
var innerHeight2 = outerHeight2 - margin2.top  - margin2.bottom;

var svg2 = d3.select("body").append("svg")
	.attr("width",  outerWidth2)
	.attr("height", outerHeight2);

svg2.append("text")
	.text("# of immigrants in selected year")
	.style("text-anchor", "right")
	.attr("x", innerWidth2 / 2)
	.attr("y", 20)
	.attr("font-weight", "bold");
	
var g2 = svg2.append("g")
	.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
	
var xAxisG2 = g2.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + innerHeight2 + ")");
var yAxisG2 = g2.append("g")
	.attr("class", "y axis");

var xScale2 = d3.scale.linear().range(      [0, innerWidth2]);
var yScale2 = d3.scale.ordinal().rangeBands([0, innerHeight2], barPadding);

var xAxis2 = d3.svg.axis().scale(xScale2).orient("bottom")
	.ticks(5)                   // Use approximately 5 ticks marks.
	.tickFormat(d3.format("s")) // Use intelligent abbreviations, e.g. 5M for 5 Million
	.outerTickSize(0);          // Turn off the marks at the end of the axis.
var yAxis2 = d3.svg.axis().scale(yScale2).orient("left")
	.outerTickSize(0);          // Turn off the marks at the end of the axis.

var xAxisLabel2 = xAxisG2.append("text")
	.style("text-anchor", "middle")
	.attr("x", innerWidth2 / 2)
	.attr("y", 40)
	.attr("class", "label")
	.text("# of immigrants in selected year");			


function renderImmigration(data){
  //adjust axes
  xScale2.domain([0, maxMigration]);
  yScale2.domain(data.map( function (d){ return d["Country"]; }));
  xAxisG2.call(xAxis2);
  yAxisG2.call(yAxis2);
  
  //bind data
  var bars = g2.selectAll("rect").data(data);
  //enter
  bars.enter().append("rect")
    .attr("class", "bar")
	.on("mouseover", function(){
		var sel = d3.select(this);
		var ctryName = sel.attr("country");
		var immigration = sel.attr(yColumn);
		var hT = sel.attr("height");
		var xT = +sel.attr("width") + margin2.left + 20;
		var yT = +sel.attr("y") + margin2.top + hT/2;
		//This bar chart
		sel.classed("selected-bar", true);
//		var current_position = d3.mouse(this);
		//The bubble chart
		svg.select("[country='" + ctryName + "']")
			.classed("selected-circle", true);
		//The other bar chart
		svg3.select("[country='" + ctryName + "']")
			.classed("selected-bar", true);
		//Display migration number
		svg2.append("text")
			.text(d3.format("s")(immigration))
			.attr("class", "mouseover_text")
			.attr("x", xT)
			.attr("y", yT)
			.attr("alignment-baseline", "central");
	})
	.on("mouseout", function(){
		var sel = d3.select(this)
		var ctryName = sel.attr("country");
		//This bar chart
		sel.classed("selected-bar", false);
		//The bubble chart
		svg.select("[country='" + ctryName + "']")
			.classed("selected-circle", false);
		//The other bar chart
		svg3.select("[country='" + ctryName + "']")
			.classed("selected-bar", false);
		//Delete migration number
		svg2.selectAll(".mouseover_text").remove();
	});
  //update
  bars
    .attr("x", 0)
    .attr("y",     function (d){ return yScale2(d["Country"]); })
	.attr("country", function (d){ return d["Country"]; })
    .attr("height", yScale2.rangeBand())
    .attr("width", function (d){ return xScale2(d[yColumn]); })
	.attr("fill", function(d) {return colCon[d["Continent"]]})
	.attr(yColumn, function (d){ return d[yColumn]; });
	//exit
	bars.exit().remove();
}


////////////////////////////////////////////////////////////////////////////////////////////////
//2 - The following is for the bubble chart////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Set the margins
var outerWidth = 500;
var outerHeight = 500;
var margin = { left: 80, top: 30, right: 20, bottom: 50 };

var innerWidth  = outerWidth  - margin.left - margin.right;
var innerHeight = outerHeight - margin.top  - margin.bottom;

var svg = d3.select("body").append("svg")
	.attr("width",  outerWidth)
	.attr("height", outerHeight);

//Add title
svg.append("text")
	.text("# of emigrants (x-axis) vs. # of immigrants")
	.style("text-anchor", "middle")
	.attr("x", outerWidth/2 + margin.left - margin.right)
	.attr("y", 20)
	.attr("font-weight", "bold");
svg.append("text")
	.text("(y-axis) in selected year")
	.style("text-anchor", "middle")
	.attr("x", outerWidth/2 + margin.left - margin.right)
	.attr("y", 35)
	.attr("font-weight", "bold");
svg.append("text")
	.text("[only countries with stats on immigrants and emigrants in this year]")
	.style("text-anchor", "middle")
	.attr("x", outerWidth/2 + margin.left - margin.right)
	.attr("y", 50)
	.attr("font-size", "0.7em");


var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var xAxisG = g.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + innerHeight + ")");
var yAxisG = g.append("g")
	.attr("class", "y axis");

var xAxisLabel = xAxisG.append("text")
	.style("text-anchor", "middle")
	.attr("x", innerWidth / 2)
	.attr("y", 40)
	.attr("class", "label")
	.text("# of emigrants in selected year [sqrt-scale]");	
	
var yAxisLabel = yAxisG.append("text")
	.style("text-anchor", "middle")
	.attr("x", -(innerHeight / 2))
	.attr("y", -50)
	.attr("class", "label")
	.text("# of immigrants in selected year [sqrt-scale]")
	.attr("transform", "rotate(-90)");		
	
var xScale = d3.scale.sqrt().range([0, innerWidth]);
var yScale = d3.scale.sqrt().range([innerHeight, 0]);
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
	.on("mouseover", function(){
		var sel = d3.select(this);
		sel.classed("selected-circle", true);
		var current_position = d3.mouse(this);
		var ctryName = sel.attr("country");
		var rT = +sel.attr("r");
		svg.append("text")
			.text(ctryName)
			.attr("class", "mouseover_text")
			.attr("x", +current_position[0]+ rT)
			.attr("y", +current_position[1]+ 	rT);
		//The first bar chart
		svg2.select("[country='" + ctryName + "']")
			.classed("selected-bar", true);
		//The second bar chart
		svg3.select("[country='" + ctryName + "']")
			.classed("selected-bar", true);
	})
	.on("mouseout", function(){
		var sel = d3.select(this);
		var ctryName = sel.attr("country");	
		sel.classed("selected-circle", false);
		svg.selectAll(".mouseover_text").remove();
		//The first bar chart
		svg2.select("[country='" + ctryName + "']")
			.classed("selected-bar", false);
		//The second bar chart
		svg3.select("[country='" + ctryName + "']")
			.classed("selected-bar", false);
	});
  //update
  bubbles.attr("cx", function (d){ return xScale(d[xColumn]); })
    .attr("cy", function (d){
		return yScale(d[yColumn]); })
    .attr("r", function (d) {return circleScale(d[zColumn]); })
	.attr("country", function (d) {return d["Country"]})
	.attr("continent", function (d) {return d["Continent"]})
	.attr("fill", function(d) {return colCon[d["Continent"]]});
  //exit
  bubbles.exit().remove();
 /*
  legend = svg.append("g")
	  .attr("class","legend")
	  .attr("transform","translate(50,30)")
	  .style("font-size","12px")
	  .call(d3.legend);
	*/
}

////////////////////////////////////////////////////////////////////////////////////////////////
//3 - The following is for the second bar chart////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//Set the margins
var outerWidth3 = 500;
var outerHeight3 = 500;
var margin3 = { left: 150, top: 30, right: 20, bottom: 50 };
var barPadding3 = 0.2;

var innerWidth3  = outerWidth3  - margin3.left - margin3.right;
var innerHeight3 = outerHeight3 - margin3.top  - margin3.bottom;

var svg3 = d3.select("body").append("svg")
	.attr("width",  outerWidth2)
	.attr("height", outerHeight2);

svg3.append("text")
	.text("# of emigrants in selected year")
	.style("text-anchor", "right")
	.attr("x", innerWidth3 / 2)
	.attr("y", 20)
	.attr("font-weight", "bold");
	
var g3 = svg3.append("g")
	.attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");
	
var xAxisG3 = g3.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + innerHeight3 + ")");
var yAxisG3 = g3.append("g")
	.attr("class", "y axis");

var xScale3 = d3.scale.linear().range(      [0, innerWidth3]);
var yScale3 = d3.scale.ordinal().rangeBands([0, innerHeight3], barPadding);

var xAxis3 = d3.svg.axis().scale(xScale3).orient("bottom")
	.ticks(5)                   // Use approximately 5 ticks marks.
	.tickFormat(d3.format("s")) // Use intelligent abbreviations, e.g. 5M for 5 Million
	.outerTickSize(0);          // Turn off the marks at the end of the axis.
var yAxis3 = d3.svg.axis().scale(yScale3).orient("left")
	.outerTickSize(0);          // Turn off the marks at the end of the axis.

var xAxisLabel3 = xAxisG3.append("text")
	.style("text-anchor", "middle")
	.attr("x", innerWidth2 / 2 + 40)
	.attr("y", 40)
	.attr("class", "label")
	.text("# of emigrants in selected year");			


function renderEmigration(data){
  //adjust axes
  xScale3.domain([0, maxMigration]);
  yScale3.domain(data.map( function (d){ return d["Country"]; }));
  xAxisG3.call(xAxis3);
  yAxisG3.call(yAxis3);
  
  //bind data
  var bars2 = g3.selectAll("rect").data(data);
  //enter
  bars2.enter().append("rect")
    .attr("class", "bar")
	.on("mouseover", function(){
		var sel = d3.select(this);
		var ctryName = sel.attr("country");
		var hT = sel.attr("height");
		var xT = +sel.attr("width") + margin2.left + 20;
		var yT = +sel.attr("y") + margin2.top + hT/2;
		//This bar chart
		sel.classed("selected-bar", true);
//		var current_position = d3.mouse(this);
		//The bubble chart
		svg.select("[country='" + ctryName + "']")
			.classed("selected-circle", true);
		//The other bar chart
		svg2.select("[country='" + ctryName + "']")
			.classed("selected-bar", true);
		//Display migration number
		svg3.append("text")
			.attr("class", "mouseover_text")
			.attr("x", xT)
			.attr("y", yT)
			.attr("alignment-baseline", "central");
	})
	.on("mouseout", function(){
		var sel = d3.select(this)
		var ctryName = sel.attr("country");
		//This bar chart
		sel.classed("selected-bar", false);
		//The bubble chart
		svg.select("[country='" + ctryName + "']")
			.classed("selected-circle", false);
		//The other bar chart
		svg2.select("[country='" + ctryName + "']")
			.classed("selected-bar", false);
		//Delete migration number
		svg3.selectAll(".mouseover_text").remove();
	});
  //update
  bars2
    .attr("x", 0)
    .attr("y",     function (d){ return yScale3(d["Country"]); })
	.attr("country", function (d){ return d["Country"]; })
    .attr("height", yScale3.rangeBand())
	.attr("fill", function(d) {return colCon[d["Continent"]]})
	.attr(xColumn, function (d){ return d[xColumn]; });
	//exit
	bars2.exit().remove();
}

////////////////////////////////////////////////////////////////////////////////////////////////	
// 4 - General things happpening ///////////////////////////////////////////////////////////////
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
	dCurBubble = dCurrentSelection.filter(function(data){
			return data["Migrants_out"] > 0;
		});
	dCurBubble = dCurBubble.filter(function(data){
			return data["Migrants_in"] > 0;
		});
	dCurSelImmigrants = dCurrentSelection.filter(function(data){
			return data["Migrants_in"] > 0;
		})
		.sort(function(a,b) {return b["Migrants_in"] - a["Migrants_in"];});
	dCurSelEmigrants = dCurrentSelection.filter(function(data){
			return data["Migrants_out"] > 0;
		})
		.sort(function(a,b) {return b["Migrants_out"] - a["Migrants_out"];});
	//SetMaxValues
	maxEmigration = d3.max(d, function (d){ return d[xColumn]; });
	maxImmigration = d3.max(d, function (d){ return d[yColumn]; });
	maxMigration = Math.max(maxEmigration, maxImmigration)*1.1;
	maxPopulation = d3.max(d, function (d){ return d[zColumn];});
	//Initialize visulations with current data
	renderImmigration(dCurSelImmigrants);
	render(dCurBubble);
	renderEmigration(dCurSelEmigrants);

});

//Update graph when dropdown changes due to changes in selected data
d3.select('#year_selector')
  .on('change', function() {
    a = +eval(d3.select(this).property('value'));
    dCurrentSelection = dMigPerCtry.filter(function(data){
			return  data["Year"] === a;
			});
	dCurBubble = dCurrentSelection.filter(function(data){
			return data["Migrants_out"] > 0;
		});
	dCurBubble = dCurBubble.filter(function(data){
			return data["Migrants_in"] > 0;
		});
	dCurSelImmigrants = dCurrentSelection.filter(function(data){
			return data["Migrants_in"] > 0;
		})
		.sort(function(a,b) {return b["Migrants_in"] - a["Migrants_in"];});
	dCurSelEmigrants = dCurrentSelection.filter(function(data){
			return data["Migrants_out"] > 0;
		})
		.sort(function(a,b) {return b["Migrants_out"] - a["Migrants_out"];});
	renderImmigration(dCurSelImmigrants);
	render(dCurBubble);
	renderEmigration(dCurSelEmigrants);
	});