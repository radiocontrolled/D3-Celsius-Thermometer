
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
	});
	
	var svg2 = d3.select("article svg");
	
	
	svg2.append("g") .attr("transform", "translate(50,10)")
		.call(d3.svg.axis().scale(yAxis).orient("right").ticks(15));
		
	var article = d3.select("svg");	

var removeText = function(){
	d3.selectAll("text.note").remove();
};

var getCityTemperature = function(city){
	
	cityString = "http://api.openweathermap.org/data/2.5/find?q=" + city + "&units=metric";
	
	return d3.json(cityString, function(error, json){
		if(json){
			
			/* if there's more than one city with the same name, 
			 * ask the user to clarify which city they meant
			 * else display the temperature
			 */
			if (json.list.length > 1){
				
				removeText();
			
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
					else if(i == json.list.length-1){
						d3.select("section")
							.append("text").classed("note",true)
							.text(function(){
								return "?";
							});
					}
					
				}
				
			}
			else{
			
				removeText();

				temperature = [scale(json.list[0].main.temp)];
						
				var mercuryDiv = article.selectAll("rect.mercury")
					.data(temperature, function(d){return d;});			

				mercuryDiv
					.enter()
					.append("rect")
					.classed("mercury",true)
					.attr({
						y: function(d){
							return   h/1.1 + d + 10;	
						},
						height: - h/1.1,
						x: 101,
						rx: 10, 
						ry: 10,
						width: 18
					});
				
				mercuryDiv
					.exit().remove();
					
				mercuryDiv
					.transition()
					.attr({
						y: function(d){
							return  h/1.1 - d + 10;	
						},
						height: function(d){
							return d;
						}
					})
					.duration(1000);
					
			d3.select("#cityInputForm")
					.append("text").classed("note",true)
					.text(function(d){
						return json.list[0].name + ", " + json.list[0].sys.country + ": Temperature: " + json.list[0].main.temp + "  Humidity: " + json.list[0].main.humidity;
					});
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

	


				
				
				


