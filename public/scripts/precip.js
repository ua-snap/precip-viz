function getSum(total, num) {
    return total + num;
}
function drawPrecip(nDays){
	var hyar = [];
	var hxar = [];
	var markers = [];
	var markertext = [];
	var traces = {};
	for (var i = 1950; i <= 2018; i++){
		traces[i] = {}; 
		traces[i].hxar = [];
		traces[i].hyar = [];
		traces[i].markertext = [];
		traces[i].markers = [];
	}
	console.log(traces);
	var dates = [];
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
        $.getJSON( '/json/precip.json', function( data ) {
                $.each( data.data, function( key, val ) {
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
				var index = val[0].substring(0,4);
				traces[index].hyar.push(val[0].substring(0,4));
				var newmonth = dates[val[0].substring(5,7)] + ' ' + val[0].substring(8,);
				traces[index].hxar.push(newmonth);
				traces[index].markertext.push(dayAvg);
				var mrkr = Math.pow(dayAvg + 0.5,3) * 10; 
				traces[index].markers.push(mrkr);
			}
                });
         });
	var data = [];
	for (var i = 1950; i <= 2018; i++){
		var tmptrace = {
			x: traces[i].hxar,
			y: traces[i].hyar,
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
	drawPrecip(1); //N Days to accrue for rolling average. Default 1.
});
