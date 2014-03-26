
var w = window.innerWidth/1.2;
var h = window.innerHeight/1.5;
var cityString; 
var city;
var temperature;


/* scale for thermometer 
 * input domain is the Celsius scale (-30°C to 60°C)
 * output range extend is the height of the rect.thermometer 
 */
var scale = d3.scale.linear().domain([-30,60]).range([0,h/1.1]);   

// scale for yAxis label
var yAxis = d3.scale.linear().domain([-30,60]) .range([h/1.1,0]);  

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
			
			/* if there's more than one city with the same name, 
			 * ask the user to clarify which city they meant
			 * else display the temperature
			 */
			if (json.list.length > 1){
				
			
				d3.select("section")
					.append("text").classed("note",true)
					.text(function(){
						return "Did you mean ";
					});

				
				for (var i = 0; i < json.list.length; i++){
					
					d3.select("section")
						.append("text").classed("note",true)
						.text(function(){
							return json.list[i].name + ", " + json.list[i].sys.country;
						});
					
					if (i != json.list.length-1){
						
						d3.select("section")
							.append("text").classed("note",true)
							.text(function(){
								return " or ";
							});
					}
					else if(i = json.list.length-1){
						d3.select("section")
							.append("text").classed("note",true)
							.text(function(){
								return "?";
							});
					}
					
				};
				
			}
			else{
			
				d3.selectAll("text.note").remove();
			
				temperature = json.list[0].main.temp;
			
				temperature = scale(temperature);
			
				var mercury = d3.select("rect.mercury")
				mercury.transition().duration(2000)
				.attr({
					width: 18,
					height: temperature,
					rx: 10, 
					ry: 10,
					x: 101,
					y: h/1.1 - temperature + 10
				});

			/* 
			 * var section = d3.select("section")
				.append("text")
				.text(function(){
					
				});
			 */

			}
			
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

	


				
			
			/*
			 * console.log("Did you mean");
			 * 
			 * for (var i = 0; i < json.list.length; i++){
					console.log(json.list[i].name + "," + json.list[i].sys.country);
					if (i != json.list.length-1){
						console.log("or");
					}
					
				}
			 * 
			 */
				
				


