var w = window.innerWidth/5;
var h = window.innerHeight/1.5;
var city, temperature, scale, yAxis, positionLabels, translateX;

// append rect to be used as thermometer to the svg
var svg = d3.select("section").append("svg").append("rect").classed("thermometer",true);

/*
 *  Draw the thermometer with width/height/transform attributes
 *  that are relative to the size of the viewport.
 *  
 *  Set and label the thermometer scalre
 * 
 */
var drawThermometer = function(w,h) {
	d3.select("svg").attr({
		width: w,
		height: h
	});
	
	/* scale for thermometer 
	*  input domain is the Celsius scale (-30°C to 60°C)
	*  output range extend is the height of the rect.thermometer 
	*/
	scale = d3.scale.linear().domain([-30,60]).range([0,h/1.1]);   

	// scale for yAxis label for rect.thermometer
	yAxis = d3.scale.linear().domain([-30,60]).range([h/1.1,0]); 
	
	d3.select("svg rect").classed("thermometer",true)		
		.attr({
			width: w/8,
			height: h/1.1,
			rx: w/16, 
			ry: w/16,
			"transform":"translate(" + w/2 + ",10)",
			"stroke-width": "2",
			"stroke": "#34495E",
			"fill": "#ffffff"
		});	


	positionLabels = function () {
		if (document.body.clientWidth < 600) {
			translateX = w/10;
		}
		else {
			translateX = w/3;
		}	
		return translateX;
	};
	positionLabels();
		

	d3.select("section svg")
		.append("g").classed("bulbLabels",true)
		.attr({
			"stroke": "#34495E",
			"fill": "#ffffff",
			"transform": "translate(" +  translateX  + ",10)"
		})
		.call(d3.svg.axis().scale(yAxis).orient("right").ticks(15));
	
	d3.selectAll("text")
		.attr({
			"stroke-width":"0",
			"fill": "#34495E"
		});
		
};

drawThermometer(w,h);

var section = d3.select("svg");	


/*
 *  Set text in div.note
 */
var displayText = function(string) {			
	var note = document.getElementById("note"); 
	note.innerHTML = string;
};


/*
 *  Given a city name, get that city's current 
 *  temperature. Animate the mercury 
 *  representing that temperature. 
 */
var getCityTemperature = function(city) {
	
	var cityString = "http://api.openweathermap.org/data/2.5/find?q=" + city + "&units=metric";
	
	return d3.json(cityString, function(error, json) {
		if(json){
			
			/* If there are multiple cities with same name, 
			 * get clarification from user
			 */
			if (json.list.length > 1) {
				
				var clarify = "Did you mean ";
				
				for (var i = 0; i < json.list.length; i++) {
						var stringEither = json.list[i].name + ", " + json.list[i].sys.country;
						clarify += "<a href='#' class='clarifyLink'>"+ stringEither + "</a>";
						
					if (i != json.list.length-1) {
						var stringOr = " or ";
						clarify += stringOr;
					}
					
					else if(i == json.list.length-1) {
						var stringEnd = "?";
						clarify += stringEnd;
						displayText(clarify);
						searchPopulator();
					}	
				}
			}
			else {
				
				temperature = [scale(json.list[0].main.temp)];
						
				var mercury = section.selectAll("rect.mercury")
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
						x: w/1.99,
						rx: w/16.5, 
						ry: w/16.5,
						width: w/8.5,
						"stroke-width": "2",
						"stroke": "#c0392b",
						"fill": "#E74C3C"
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
					
				var tempInfo = json.list[0].name + 
								", " + 
								json.list[0].sys.country + 
								": Temperature: " + 
								json.list[0].main.temp + 
								"°C  Humidity: " + 
								json.list[0].main.humidity;
								
				displayText(tempInfo);
			}
			
		}
		else if(error){
			console.warn(error);
		}
	});
};

var cityInput = document.getElementById("cityInput");
var cityInputForm = document.getElementById("cityInputForm");

cityInputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    city = cityInput.value;
    getCityTemperature(city);
  });
  

/*
 * If more than one city with the same name
 * allow the user to clarify the city they meant
 */
var searchPopulator = function() {
	
	var linkMatches = document.querySelectorAll(".clarifyLink");
	
	for (var i = 0; i < linkMatches.length ; i++) {
		linkMatches[i].addEventListener('click', trigger);
	}
	
	function trigger() {
		var word = this.innerHTML;
		cityInput.value = word;
		getCityTemperature(word);
	}
};


/*
 * Resize the thermometer, its scale
 * and the mercury on viewport size change
 */

function resize() {
	
	d3.select("g.bulbLabels").remove();
	d3.select("rect.mercury").remove();
	w = window.innerWidth/5;
	h = window.innerHeight/1.5;
	
	drawThermometer(w,h);	
	
	/*
	 *  if a temperature has already 
	 *  been searched for, the mercury should be redrawn
	 *  but testing reveals keeping the mercury present 
	 *  will cause problems when a mobile user's onscreen 
	 *  keyboard is opened/closed..
	 * 
	 * if(city){
		getCityTemperature(city);	
		}
	 */
	
}

d3.select(window).on('resize', resize); 


				
				


