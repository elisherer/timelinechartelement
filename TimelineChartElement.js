/*

Timeline chart by elisherer

The data should look like this:

{
	"type" : "date",
	"start" : Date object,
	"end" : Date object,
	"start_value" : boolean
	"cov" : [ Date objects ]
}

or 

{
	"type" : "int"
	"amount" : int,
	"start_value" : boolean
	"cov" : [ int's ] //places where the value changes
}

 */

function TimelineChartElement(data, params) {

	var canvas = document.createElement("canvas"),
	 	context = canvas.getContext('2d');
	if (!params) params = {}; //optional
	canvas.width = params.width || window.innerWidth;
	canvas.height = params.height || 12;
	canvas.style.width = "100%"; // for resize effect
	context.fillStyle = params.backColor || 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = params.foreColor || 'blue';

	var amount = data.amount;
	var start_value = data.start_value;
	var cov = data.cov;
	
	if (params.id)
		canvas.id = params.id;

	//convert dates to integers
	if (data.type === 'date') {
		var start_sec = data.start / 60000;
		amount = (data.end / 60000) - start_sec; //convert to seconds
		//start_value is ok
		cov = [];
		data.cov.forEach(function (c) {
			cov.push((c/60000)-start_sec);
		});
	}
	cov.push(amount); //the last change

	
	var ratio = canvas.width / amount;

	var current_value = start_value;
	var last_pos = 0;
	for (var i = 0 ; i < cov.length ; i += 1) {
		if (current_value) {
			context.fillRect(last_pos * ratio, 0, (cov[i] - last_pos) * ratio, canvas.height);
		}
		current_value = !current_value; //cov
		last_pos = cov[i];
	}

	/* how to write text
	
		context.textBaseline = 'top'; 
		context.textAlign = 'center';
		context.font = Math.floor(canvas.height * 0.8) + 'px Arial';
		context.fillStyle = 'black';
		context.fillText('TEXT', canvas.width * 0.5, height * 7, canvas.width * 6);
	*/
	
	//stroke with a rectangle
	context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();

    return canvas;
}
