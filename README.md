# DataVisualization_Project
Final project of the data visualization module of the Udacity Nanodegree "Data Analyst"

<h2>Summary</h2>
In today's times a lot is being discussed about migration. Many people have the feeling that there is more migration than there has been in the past.<br>
But often these discussions are not based on actual data. Even though the UN provides data about global migration flows, they do not provide them in a human-consumable way.
Rather these files are pure data walls which make people rather hesitant to have a look at them.

With this project I therefore wanted people to enable to have a look at the top migration flows per country as well as checking if a country is rather an immigration or an emigration country and how this is changing over time.

The html files can be found in the folder "10_Code" and contains 4 html files out of which two are an intro or respectively describe the data used. Two others contain the two major visualizations.
<h4>Migration of countries</h4>
The graphics in here show all existing data about total immigration and emigration of the respective year.
<h4>Top 10 migration flows</h4>
The graphics in here show the top 10 migration flows of the selected year once in a bar chart on the left hand side and once on a map on the right hand side.


<h2>Design</h2>
I wanted to enable the viewer to be able to look at immigration and emigration seperately while having the possibility to set them in relation as well. This mixture has been achieved by the bar charts (single view) and the bubble chart. Including the country size makes the migration on the one hand relative and thus makes some kind of normalization and makes it also easier to follow the single countries when changing the year. Having them coloured by countries supports this while not confusing too much as single country colors would maybe have done.

Using a map when talking about migration is almost intuitive. How to use it not that directly. I have been thinking about color coded maps to show if a country is rather an immigration or an emigration country but I covered this already in the previous charts. Additionally due to the missing data regarding emigration of many countries this would have been very difficult.
This led me to the question which are the main migration flows. Displaying all migration flows in each year would have been an overkill and nothing would have been possible to see. Therefore I came up with the top 10 migration flows which are displayed in total numbers via the bar chart while the width of the arrow still reflects the size of this specific migration flow.

<h2>Feedback</h2>
During the whole project I received feedback from colleagues and friends. I used these short feedback sessions to improve the visualizations step by step.
Feedback included have been:
<ul>
<li>Too many bubbles in the bubble chart which made it hard to display them</li>
<li>Missing information about the number of migrants in the migration flow which led me to display the number in the mouseover</li>
<li>Also initial feedback which I did not incorporate: e.g. The scale in the bar chart next to the map is to that scale only due to some very high migration flows in very few year which makes it difficult to compare the flows which have been smallar. We then jointly had a look at a sqrt-scale or at changing the scale dynamically but we agreed that then the comparison between the different years or between the different flows does not work that good anymore</li>
<li>A lot of feedback have been obvious like initially missing good descriptions of the axis and missing introduction at all which led me to make the Intro page</li>
<li>A lot has also been about bugfixing: e.g. hover for the russian bubble did not work as its name included a space which required additional quotationmarks in the javascript code</li>
</ul>
As there has not been the one single point when I asked for feedback, there is no respective file attached. Please go back to old versions in the git-hub in case you want to see them.

<h2>Ressources</h2>
The following sources have helped me to build this data visualization:

Very good D3 recap:
https://github.com/curran/screencasts/tree/gh-pages/introToD3

Mouseover:
https://www.youtube.com/watch?v=aNbgrqRuoiE

Selecting data:
<ul>
<li>http://stackoverflow.com/questions/24193593/d3-how-to-change-dataset-based-on-drop-down-box-selection</li>
<li>http://stackoverflow.com/questions/18719383/how-to-filter-an-array-object-by-checking-multiple-values</li>
<li>http://stackoverflow.com/questions/27714505/select-top-k-records-for-each-date</li>
</ul>

Country Centroids:
http://gothos.info/2009/02/centroids-for-countries/

Drawing arrow heads:
http://stackoverflow.com/questions/33830055/d3js-adding-an-arrow-head-to-a-line

Executing one function after the other:
http://stackoverflow.com/questions/5187968/how-should-i-call-3-functions-in-order-to-execute-them-one-after-the-other

Slider:
<li>https://bl.ocks.org/shancarter/5979700</li>
<li>http://thematicmapping.org/playground/d3/d3.slider/</li>

For the data sources see the description in the tab "Data sources"
