var w = window.innerWidth/1.2;
var h = window.innerHeight/1.5;
var string, city, temperature, bulb, bulbLabels;

/* scale for thermometer 
 * input domain is the Celsius scale (-30°C to 60°C)
 * output range extend is the height of the rect.thermometer 
 */
var scale = d3.scale.linear().domain([-30,60]).range([0,h/1.1]);   

// scale for yAxis label
var yAxis = d3.scale.linear().domain([-30,60]) .range([h/1.1,0]);  

/* draws and labels the thermometer */
var drawThermometer = function(){
	
	bulb = d3.select("article").append("svg").attr({width: w, height: h})
		.append("rect").classed("thermometer",true)
		.attr({
			width: 20,
			height: h/1.1,
			rx: 10, 
			ry: 10,
			x: 100, // redo
			y: 10	// redo
		});	

	bulbLabels = d3.select("article svg")
		.append("g").attr("transform", "translate(50,10)")
		.call(d3.svg.axis().scale(yAxis).orient("right").ticks(15));
};

drawThermometer();

var article = d3.select("svg");	

var removeText = function(){
	d3.selectAll("text.note").remove();
};

var displayText = function(string){			
	d3.select("#cityInputForm")
		.append("text").classed("note",true)
		.text(function(){
			return string;
		});
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
			
				var clarify = "Did you mean ";
				displayText(clarify);
				
				for (var i = 0; i < json.list.length; i++){
						var stringEither = json.list[i].name + ", " + json.list[i].sys.country;
						displayText(stringEither);
					
					if (i != json.list.length-1){
						var stringOr = " or ";
						displayText(stringOr);
					}
					else if(i == json.list.length-1){
						var stringEnd = "?";
						displayText(stringEnd);	
					}	
				}
			}
			else{
			
				removeText();

				temperature = [scale(json.list[0].main.temp)];
						
				var mercury = article.selectAll("rect.mercury")
					.data(temperature, function(d){return d;});			

				mercury
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
				
				mercury
					.exit().remove();
					
				mercury
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
					
				var tempInfo = json.list[0].name + ", " + json.list[0].sys.country + ": Temperature: " + json.list[0].main.temp + "°C  Humidity: " + json.list[0].main.humidity;
				displayText(tempInfo);
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


/*resize on viewport size change*/

function resize() {

	bulb.remove();
	bulbLabels.remove();
	var mercury = article.selectAll("rect.mercury").remove();
	w = window.innerWidth/1.2;
	h = window.innerHeight/1.5;
	drawThermometer();	
}

d3.select(window).on('resize', resize); 


				
				
				


