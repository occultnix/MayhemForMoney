//if (crimesOps.length > 0) {
//  var crimeList = document.getElementsByTagName('a');
//  console.log(crimeList);
//
//  Array.from(crimeList).forEach((crime) => {
//     console.log(crime);
//  });

//  console.log(crimeList);
//  console.log(crimes);
//}

$(document).on("mousedown", function (event) {
	$(".next").find('a').trigger("click");
//  checkSpeaker();
});

//function checkSpeaker() {
//  if (speaker) {
//    document.getElementById('speaker').style.visibility = "visible";
//  } else {
//    console.log("speaker goes away");
//    document.getElementById('speaker').style.visibility = "hidden";
//  }
//}
