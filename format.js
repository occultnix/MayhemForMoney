let currentRound = 1;
let currentSet = 1;

let bountyTotal = 0;

let captureChance = 0;
let dangerLevel = "Low";

let playerLoc = [3, 7];
let playerLastLoc = [3, 7];
let chipLoc = [10, 27];
let ramonLoc = [55, 2];
let viperLoc = [83, 11];

let playerSpeed = 4;
let chipSpeed = 3
let ramonSpeed = 4;
let viperSpeed = 6;

let chipEncounter = false;
let ramonEncounter = false;
let viperEncounter = false;

let bribeSuccess = false;
let runSuccess = false;

// If the player clicks anywhere on the page, click the link marked "next"
$(document).on("mousedown", function (event) {
	$(".next").find('a').trigger("click");

	// If there isn't a link marked "next", find the appropriate link
	if (chipEncounter == true) {
		$(".chip").find('a').trigger("click");
	} else if (ramonEncounter == true) {
		$(".ramon").find('a').trigger("click");
	} else if (viperEncounter == true) {
		$(".viper").find('a').trigger("click");
	} else if (bribeSuccess == true) {
		$(".bribed").find('a').trigger("click");
	} else if (runSuccess == true) {
		$(".ran").find('a').trigger("click");
	} else {
		$(".other").find('a').trigger("click");
	}
});

// Determine the player's level of danger
function dangerManager() {
	// Find the distance between the player and Ramon
	let shortestDistance = checkDistance(playerLoc, chipLoc);

	// If it's after Round 1, find the distance between the player and Ramon
	// Find out who the player is closer to
	if (currentRound > 1) {
		let currentDanger = checkDistance(playerLoc, ramonLoc);
		if (currentDanger < shortestDistance) {
			shortestDistance = currentDanger;
		}
	}

	// If it's after Round 2, find the distance between the player and Viper
	// Find out who the player is closer to
	if (currentRound > 1) {
		let currentDanger = checkDistance(playerLoc, viperLoc);
		if (currentDanger < shortestDistance) {
			shortestDistance = currentDanger;
		}
	}

	return checkDanger(shortestDistance);
}

// Check the distance between the player and something else
function checkDistance(player, alt) {
	let lengthX = alt[0] - player[0];
	let lengthY = alt[1] - player[1];

	// Use Pythagorean Theorum to find the distance
	let distance = Math.sqrt(Math.abs(lengthX * lengthX) + Math.abs(lengthY * lengthY));

	// Convert distance into an integer, rounding down
	return Math.floor(distance);
}

// Return the semantic value of danger based on player's distance from Hunter
function checkDanger(distance) {
	if (distance < 4) { 				 // Hunter is within a minute away
		return "Extreme";
	} else if (distance <= 8) {	 // Hunter is 1-2 minutes away
		return "High";
	} else if (distance <= 16) { // Hunter is 2-4 minutes away
		return "Moderate";
	} else if (distance > 16) {  // Hunter is more than 4 minutes away
		return "Low";
	} else {
		return "Error";
	}
}

// Basically the move manager - used to check for crime danger AND for actually moving around
function timeAdjust(crimeLoc, crimeTime, doMove) {
	var dist = checkDistance(playerLoc, crimeLoc);	// Get the distance from character to goal
	var time = Math.floor(crimeTime + (dist / 4));  // Get travel/crime time, rounded to a whole integer
	captureChance = 0 															// Reset the chance of being captured

	// If we're just checking, move dummies, not the real characters
	if (doMove == false) {
		var tempChar = playerLoc;
		var tempChip = chipLoc;
		var tempRamon = ramonLoc;
		var tempViper = viperLoc;

		for (var i = 0; i < time; time -= 1) {
			// Move the dummy player towards the crime
			moveChar(tempChar, crimeLoc, playerSpeed);

			// Move the dummy Hunter(s) towards the player's last known position
			moveChar(tempChip, playerLastLoc, chipSpeed);
			if (currentRound > 1) {
				moveChar (tempRamon, playerLastLoc, ramonSpeed);
			};if (currentRound > 1) {
				moveChar (tempViper, playerLastLoc, viperSpeed);
			};

			if (dangerLevel == "Extreme") {
				testDanger(captureChance);
			}

			dangerManager()
			console.log(dangerManager());
		}

	} else { 												// Otherwise, really move the characters
		playerLastLoc = playerLoc;		// Set the player's last known position

		for (var i = 0; i < time; time -= 1) {
			// Move the player towards the crime
			moveChar(playerLoc, crimeLoc, playerSpeed);

			// Move the Hunter(s) towards the player's last known position
			moveChar(chipLoc, playerLastLoc, chipSpeed);
			if (currentRound > 1) {
				moveChar (ramonLoc, playerLastLoc, ramonSpeed);
			};
			if (currentRound > 2) {
				moveChar (viperLoc, playerLastLoc, viperSpeed);
			};

			// Update the player UI based on dangerLevel
			dangerLevel = dangerManager();

			// For every minute the player is in extreme danger, raise the chance of being captured
			if (dangerLevel == "Extreme") {
				dangerDanger(captureChance);
			}
		}
	}

	console.log("Final danger level is " + dangerManager());
}

// Figure out the angle of the distance from character to their goal
//   and then move them along that angle by their speed
function moveChar(char, goal, spd) {
	var dist = checkDistance(char, goal)
	var angle = Math.atan2(goal[1] - char[1], goal[0] - char[0]);

	// Set the character's coords to their goal's coords if they're close enough
	if (dist > 4) {
		char[0] += Math.cos(angle) * spd;
		char[1] += Math.sin(angle) * spd;
		dist -= spd;
	} else {
		char[0] = goal[0];
		char[1] = goal[1];
	}
}

function testDanger(chance) {
	let rand = Math.random() * 100;

	if (chance > rand) {

	} else {
		captureChance += 40;
	}
}

function dangerDanger(chance) {
	let rand = Math.random() * 100;

	if (chance > rand) {
		// Find out who's putting the player in danger
		var chipDist = checkDistance(playerLoc, chipLoc);
		var ramonDist = checkDistance(playerLoc, ramonLoc);
		var viperDist = checkDistance(playerLoc, viperLoc);
		var closest = Math.min(ramonDist, viperDist);

		// Find the appropriate Hunter's encounter page and send the player there
		switch (closest) {
			case chipDist:
				chipEncounter = true;
				break;
			case ramonDist:
				ramonEncounter = true;
				break;
			case viperDist:
				viperEncounter = true;
				break;
		}
	} else {
		captureChance += 40;
	}
}

// Intake the type of escape and the percent chance of escape
function escapeChance(type, chance) {
	let rand = Math.random() * 100;		// Set up a random number 0 - 100

	if (chance >= rand) {							// If your percentage chance is higher than the random number
		switch (type) {									// Set the type of escape success variable to true
			case 'bribe':
				bribeSuccess = true;
				break;
			case 'run':
				runSuccess = true;
				break;
			default:
				break;
		}
	} else {
		bribeSuccess = false;
		runSuccess = false;
	}
}
