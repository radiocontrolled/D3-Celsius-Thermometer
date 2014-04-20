var w = window.innerWidth/5;
var h = window.innerHeight/1.5;
var city, temperature, scale, yAxis;

var ifMobile = function(){
	
	if (window.innerWidth <= 600){
		
	}
	
};

var svg = d3.select("section").append("svg").attr({width: w, height: h})
	.append("rect").classed("thermometer",true);

var drawThermometer = function() {
	d3.select("svg").attr({
		width: w, 
		height: h
	});
	
	/* scale for thermometer 
	* input domain is the Celsius scale (-30°C to 60°C)
	* output range extend is the height of the rect.thermometer 
	*/
	scale = d3.scale.linear().domain([-30,60]).range([0,h/1.1]);   

	// scale for yAxis label for rect.thermometer
	yAxis = d3.scale.linear().domain([-30,60]).range([h/1.1,0]); 
	
	d3.select("svg rect").classed("thermometer",true)		
		.attr({
			width: 80,
			height: h/1.1,
			rx: 40, 
			ry: 40,
			"transform":"translate(100,10)"
		});	

	// width: 80 and rx, ry 40 for mobile?

	d3.select("section svg")
		.append("g").classed("bulbLabels",true).attr("transform", "translate(50,10)")
		.call(d3.svg.axis().scale(yAxis).orient("right").ticks(15));
};

drawThermometer();

var section = d3.select("svg");	

var removeText = function(){
	d3.selectAll("text.note").remove();
};

var displayText = function(string){			
	
	var note = document.getElementById("note"); 
	note.innerHTML = string;
	
};

var getCityTemperature = function(city){
	
	var cityString = "http://api.openweathermap.org/data/2.5/find?q=" + city + "&units=metric";
	
	return d3.json(cityString, function(error, json){
		if(json){
			
			/* If there are multiple cities with same name, 
			 * get clarification from user
			 */
			if (json.list.length > 1){
				
				removeText();
			
				var clarify = "Did you mean ";
				
				for (var i = 0; i < json.list.length; i++){
						var stringEither = json.list[i].name + ", " + json.list[i].sys.country;
						clarify += "<a href='#' class='clarifyLink'>"+ stringEither + "</a>";
						
					
					if (i != json.list.length-1){
						var stringOr = " or ";
						clarify += stringOr;
						
					}
					else if(i == json.list.length-1){
						var stringEnd = "?";
						clarify += stringEnd;
						
						displayText(clarify);
						searchPopulator();
							
					}	
					
					
				}
			}
			else{
			
				removeText();

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
						x: 101,
						rx: 38, 
						ry: 38,
						width: 78
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
var cityInputForm = document.getElementById("cityInputForm");

cityInputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    city = cityInput.value;
    getCityTemperature(city);
  });
  
var searchPopulator = function (){
	
	var linkMatches = document.querySelectorAll(".clarifyLink");
	
	for (var i = 0; i < linkMatches.length ; i++){
		linkMatches[i].addEventListener('click', trigger);
	}
	
	function trigger(){
		var word = this.innerHTML;
		cityInput.value = word;
		getCityTemperature(word);
		
	}
};

/*
 * resize the thermometer, its scale
 * and the mercury on viewport size change
 */

function resize() {
	
	d3.select("g.bulbLabels").remove();
	
	w = window.innerWidth/1.2;
	h = window.innerHeight/1.5;
	
	drawThermometer();	
	
	/*
	 *  if a temperature has already 
	 *  been searched for, the mercury should be redrawn
	 * 
	 */
	if(city){
		getCityTemperature(city);	
	}
}

d3.select(window).on('resize', resize); 

 if (document.body.clientWidth < 600) {
        alert("mobile");
    }

		
				
				


