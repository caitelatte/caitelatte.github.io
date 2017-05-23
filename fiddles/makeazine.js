// A4 page sizes in pixels
var a4X = 840;
var a4Y = 1188;


function update_collected_pages() {
	/*
	* Pages 1, 2, 3 and 4 are rotated clockwise.
	* Front and back covers, 6 and 5 are rotated anti-clockwise.
	* 
	* layout of a zine print page:
	* 1 F
	* 2 B
	* 3 6
	* 4 5
	*/

	$('#collected-canvases').hide();
	$('#button-toggle-collected').text("Show collected pages");

	// Draw individual pages onto front page
	var zinePageWidth = a4Y/4;
	var zinePageHeight = a4X/2;
	var clockwise = 90*Math.PI/180;
	var antiClockwise = -90*Math.PI/180
	var transformCanvases = [
		{id:"front-cover", 
		 destXY:[zinePageHeight * 1.5, zinePageWidth * 0.5], 
		 angleInRadians:antiClockwise},
		{id:"page-1-2", 
		 destXY:[zinePageHeight * 0.5, zinePageWidth * 1], 
		 angleInRadians:clockwise},
		{id:"page-3-4", 
		 destXY:[zinePageHeight * 0.5, zinePageWidth * 3], 
		 angleInRadians:clockwise},
		{id:"page-5-6", 
		 destXY:[zinePageHeight * 1.5, zinePageWidth * 3], 
		 angleInRadians:antiClockwise},
		{id:"back-cover", 
		 destXY:[zinePageHeight * 1.5, zinePageWidth * 1.5], 
		 angleInRadians:antiClockwise}
	];
	var destCtx = document.getElementById("front-page").getContext('2d');
	destCtx.clearRect(0, 0, a4X, a4Y);

	// Draw and rotate each set of pages according to their individual values.
	for (var i = transformCanvases.length - 1; i >= 0; i--) {
		rotateDrawImage(
			destCtx,
			document.getElementById(transformCanvases[i].id),
			transformCanvases[i].destXY[0],
			transformCanvases[i].destXY[1],
			transformCanvases[i].angleInRadians
			)
	}

	destCtx = document.getElementById("back-page").getContext('2d');
	destCtx.clearRect(0, 0, a4X, a4Y);
	destCtx.drawImage(document.getElementById("back-poster"), 0, 0);

	// Rotate and draw an image onto a CanvasContext.
	// Takes destination context, source image (can be canvas), 
	// destination x and y coords for where to rotate around,
	// how many radians to rotate the picture.
	function rotateDrawImage (destCtx, sourceImage, destX, destY, angleInRadians) {
		var width = sourceImage.width;
		var height = sourceImage.height;
		destCtx.translate(destX, destY);
		destCtx.rotate(angleInRadians);
		destCtx.drawImage(sourceImage, -width / 2, -height / 2, width, height);
		destCtx.rotate(-angleInRadians);
		destCtx.translate(-destX, -destY);
	}

	// Hide individuals and show collected
	setVisibility("individual-canvases", "button-toggle-individuals", "individual pages", 0);
	setVisibility("collected-canvases", "button-toggle-collected", "collected pages", 1);
}

function toggleVisibility(sectionID, buttonID, text) {
	if ($("#" + sectionID).css('display') == 'none') {
		$("#" + sectionID).show();
		$("#" + buttonID).text("Hide " + text + "!");
	} else {
		$("#" + sectionID).hide();
		$("#" + buttonID).text("Show " + text + "!");
	}
}

function setVisibility(sectionID, buttonID, text, toDisplay) {
	if (toDisplay == 1) {
		$("#" + sectionID).show();
		$("#" + buttonID).text("Hide " + text + "!");
	} else {
		$("#" + sectionID).hide();
		$("#" + buttonID).text("Show " + text + "!");
	}
}

function initialise_canvases() {
	// initialise canvases
	$('.zine-page-canvas-single').each(function(i, obj) {
		$(obj).sketch();
		obj.setAttribute('width', a4Y/4);
		obj.setAttribute('height', a4X/2);
	});
	$('.zine-page-canvas-joined').each(function(i, obj) {
		$(obj).sketch();
		obj.setAttribute('width', a4Y/2);
		obj.setAttribute('height', a4X/2);
	});
	$('.a4-page-canvas').each(function(i, obj) {
		$(obj).sketch();
		obj.setAttribute('width', a4X);
		obj.setAttribute('height', a4Y);
	});
	$('.a4-page').each(function(i, obj) {
		obj.setAttribute('width', a4X);
		obj.setAttribute('height', a4Y);
	});

	// set up button listeners
	$('#button-preview').click(function() { update_collected_pages();});
	$("#button-toggle-individuals").click(function() {
		toggleVisibility("individual-canvases", "button-toggle-individuals", "individual pages");
	});
	$("#button-toggle-collected").click(function() {
		toggleVisibility("collected-canvases", "button-toggle-collected", "collected pages");
	});
	$("#button-toggle-instructions").click(function() {
		toggleVisibility("instructions", "button-toggle-instructions", "instructions");
	});
	$("#button-load-example").click(function() {
		// load examples and draw them onto the collected pages.
		frontImage = new Image();
		frontImage.onload = function() {
			frontCtx = document.getElementById("front-page").getContext('2d');
			frontCtx.clearRect(0, 0, a4X, a4Y);
			frontCtx.drawImage(frontImage, 0, 0);
		}
		frontImage.src = '../resources/makeazine/instructions.png';
		backImage = new Image();
		backImage.onload = function() {
			backCtx = document.getElementById("back-page").getContext('2d');
			backCtx.clearRect(0, 0, a4X, a4Y);
			backCtx.drawImage(backImage, 0, 0);
		}
		backImage.src = '../resources/makeazine/foldillustration.png';
	});
}