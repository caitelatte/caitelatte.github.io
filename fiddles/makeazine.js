$('#button-preview').click(function() {
	/*
	* layout of a zine print page:
	* 1 F
	* 2 B
	* 3 6
	* 4 5
	*
	* Pages 1, 2, 3 and 4 are rotated clockwise.
	* Front and back covers, 6 and 5 are rotated anti-clockwise.
	*/

	$('#collected-canvases').hide();
	$('#button-toggle-collected').text("Show collected pages");

	// Draw individual pages onto front page
	var a4X = 840;
	var a4Y = 1188;
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

	document.getElementById("back-page").getContext('2d').drawImage(
		document.getElementById("back-poster"), 0, 0);

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
})

$("#button-toggle-individuals").click(function(obj) {
	if ($('#individual-canvases').css('display') == 'none') {
		$('#individual-canvases').show();
		$('#button-toggle-individuals').text("Hide individual pages");
	} else {
		$('#individual-canvases').hide();
		$('#button-toggle-individuals').text("Show individual pages");
	}
});
$("#button-toggle-collected").click(function(obj) {
	if ($('#collected-canvases').css('display') == 'none') {
		$('#collected-canvases').show();
		$('#button-toggle-collected').text("Hide collected pages");
	} else {
		$('#collected-canvases').hide();
		$('#button-toggle-collected').text("Show collected pages");
	}
});