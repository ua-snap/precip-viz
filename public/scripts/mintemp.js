var SID = 'PADK';
var d3 = Plotly.d3;
var img_jpg= d3.select('#jpg-export');
var img_svg= d3.select('#svg-export');

function getSum(total, num) {
    return total + num;
}
function drawMinTemp(nDays, SID){
	var yar = [];
	var xar = [];
	var markers = [];
	var markertext = [];
	var traces = {};
	//Establish 1 trace per year, allowing each year to occupy one line
	for (var i = 1950; i <= 2018; i++){
		xar[i] = i;
		yar[i] = 100;
	}

	$.ajaxSetup({ async: false, dataType: "json" });
        $.getJSON( 'http://data.rcc-acis.org/StnData?sid=' + SID + '&sdate=1950-01-01&edate=2019-01-06&elems=2', function( data ) {
		console.log(data);
                $.each( data.data, function( key, val ) {
			var year = val[0].substring(0,4);
			//xar[year] = val[0].substring(0,4);
			if (parseInt(val[1]) < parseInt(yar[year]) && val[1] != 'M'){
				yar[year] = parseInt(val[1]);
			}
                });
         });
	console.log(yar);
	//Add all traces to the data field
	data = [];
	var tmptrace = {
		x: xar, 
		y: yar,
		type: 'bar'
	};
	data.push(tmptrace);
	var layout = {
	title: 'Minimum Annual Temperature',
	showlegend: false,
	height: 600,
	width: 600,
	hovermode: 'closest'
	};

	Plotly.newPlot('extremeTempPlot', data, layout).then(
    function(gd)
     {
      Plotly.toImage(gd,{height:300,width:300})
         .then(
            function(url)
         {
             img_svg.attr("src", url);
	     return Plotly.toImage(gd,{format:'svg',height:800,width:800});
         }
         )
    });
}
$(document).ready( function() {
  drawMinTemp(1, SID); //N Days to accrue for rolling average. Default 1.
  $("#plotSID").change( function(){
    SID = $(this).find('option:selected').val();
    drawMinTemp(1, SID); //N Days to accrue for rolling average. Default 1.
  });
});
