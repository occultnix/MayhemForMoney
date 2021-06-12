let speaker = document.getElementById('speaker');

let playerLoc = [10, 20];
let playerLastLoc = [10, 20];
let ramonLoc = [30, 60];
let viperLoc = [110, 12];

let playerSpeed = 4;
let ramonSpeed = 4;
let viperSpeed = 6;

let bountyTotal = 0;

let dangerInt = 40;
let dangerLevel = "Low";
let hasBribed = false;

$(document).on("mousedown", function (event) {
	$(".next").find('a').trigger("click");
});

function checkDistance(point1, point2) {
	
}

function checkDanger(distance) {
	if (distance > 110) {
		dangerLevel = "Extreme";
	} else if (distance > 100) {
		dangerLevel = "High";
	} else if (distance > 50) {
		dangerLevel = "Moderate";
	} else if (distance > 0) {
		dangerLevel = "Low"
	} else {
		console.log("Error: Danger level undefined");
	}
}
