
var w = window.innerWidth/1.2;
var h = window.innerHeight/1.5;
var cityString; 
var city;
var temperature;


var scale = d3.scale.linear()
    .domain([-50,110]) // the input domain is the Celsius scale  @ https://en.wikipedia.org/wiki/Celcius
	.range([0,h/1.1]);   // the output range is the height of the mercury ? 

var yAxis = d3.scale.linear()
	.domain([-50,110]) // the input domain is the Celsius scale  @ https://en.wikipedia.org/wiki/Celcius
	.range([h/1.1,0]);  


/* the width/height of the thermometer should be proportional
 * to that of the viewport
 */

var svg = d3.select("article")
	.append("svg")
	.attr({
		width: w, 
		height: h
	})
	.append("rect").classed("thermometer",true)
	.attr({
		width: 20,
		height: h/1.1,
		rx: 10, 
		ry: 10,
		x: 100,
		y: 10
	})
	
	var svg2 = d3.select("svg")
	svg2.append("rect").classed("mercury",true);
	
	svg2.append("g") .attr("transform", "translate(50,10)")
	.call(d3.svg.axis().scale(yAxis).orient("right").ticks(15));



var getCityTemperature = function(city){
	
	cityString = "http://api.openweathermap.org/data/2.5/find?q=" + city + "&units=metric";
	
	return d3.json(cityString, function(error, json){
		if(json){
			
			temperature = json.list[0].main.temp;
			
			temperature = scale(temperature);
			//console.log(scale(temperature));
			
			var mercury = d3.select("rect.mercury")
			mercury.transition().duration(2000)
			.attr({
				width: 18,
				height: temperature,
				rx: 10, 
				ry: 10,
				x: 101,
				y: h/1.1 - temperature + 10
			})
			
		}
		else if(error){
			console.warn(error);
		}
	});
};



var cityInput = document.getElementById("cityInput");

cityInputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    city = cityInput.value;
    getCityTemperature(city);
    
  });

	





