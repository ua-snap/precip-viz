function getSum(total, num) {
    return total + num;
}
function drawPrecip(nDays, SID){
	var yar = [];
	var xar = [];
	var markers = [];
	var markertext = [];
	var traces = {};
	//Establish 1 trace per year, allowing each year to occupy one line
	for (var i = 1950; i <= 2018; i++){
		traces[i] = {}; 
		traces[i].xar = [];
		traces[i].yar = [];
		traces[i].markertext = [];
		traces[i].markers = [];
	}
	console.log(traces);
	var dates = [];
	//Replace this with moment.js
	dates['01'] = 'January';
	dates['02'] = 'February';
	dates['03'] = 'March';
	dates['04'] = 'April';
	dates['05'] = 'May';
	dates['06'] = 'June';
	dates['07'] = 'July';
	dates['08'] = 'August';
	dates['09'] = 'September';
	dates['10'] = 'October';
	dates['11'] = 'November';
	dates['12'] = 'December';
	var mvAvg = [];
	$.ajaxSetup({ async: false, dataType: "json" });
        $.getJSON( 'http://data.rcc-acis.org/StnData?sid=' + SID + '&sdate=1950-01-01&edate=2018-08-01&elems=4', function( data ) {
                $.each( data.data, function( key, val ) {
			//This section created a rolling sum of precip values
			//Allowing for multi-day accrual
			if (mvAvg.length > (nDays - 1)){
				mvAvg = mvAvg.slice(1);
			}
			if (val[1] != "T"){
				mvAvg.push(parseFloat(val[1]));
			} else {
				mvAvg.push(0);
			}
			var dayAvg = mvAvg.reduce(getSum);
			if (val[1] >= 0){
				//Pull the year out of the date string to control object indexing
				var index = val[0].substring(0,4);
				//Set year as Yaxis value to each trace
				traces[index].yar.push(val[0].substring(0,4));
				//Set MM/DD as Xaxis value
				var newmonth = dates[val[0].substring(5,7)] + ' ' + val[0].substring(8,);
				traces[index].xar.push(newmonth);
				//dayAvg is the rolling 1...n amount of precip to display on hover
				traces[index].markertext.push(dayAvg);
				//Emphasize abnormally large events with exaggerated marker size
				var mrkr = Math.pow(dayAvg + 0.5,3) * 10; 
				traces[index].markers.push(mrkr);
			}
                });
         });
	var data = [];
	//Add all traces to the data field
	for (var i = 1950; i <= 2018; i++){
		var tmptrace = {
			x: traces[i].xar,
			y: traces[i].yar,
			text: traces[i].markertext,
			mode: 'markers',
			marker: {
			  size: traces[i].markers,
			  sizemode: 'area',
			  color: 'rgb(17, 157, 255)'
			}
		};
		data.push(tmptrace);
	}

	var layout = {
	title: 'Precipitation Events',
	showlegend: false,
	height: 600,
	width: 600,
	hovermode: 'closest',
	type: 'date',
	yaxis: {
	  range: [1950,2018],
	},
	xaxis: {
	  tickformat: '%m/%d'
	}
	};

	Plotly.newPlot('precipPlot', data, layout);
}
$(document).ready( function() {
  $("#plotSID").change( function(){
    drawPrecip(1, $(this).find('option:selected').val()); //N Days to accrue for rolling average. Default 1.
  });
});
