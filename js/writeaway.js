// Settings and Other Global Variables

//  settings
let wordSetting = 50;
let timeSetting = 4;

let eraseTime = 5;
let timeSinceStroke = 0;
let wordCount = 0;
let timeSinceStart = 0;

let tickSpeed = 10; //this is milliseconds.

let willErase = true;
let isTimeMode = true;

let textOpacity = 1;

//  runtime settings
let isWriting = false;
let startTime = null;
let timeoutID = null;

//  DOMS
const inputTextArea = document.getElementById("userInputArea");

const eraseToggleButton = document.getElementById("eraseToggle");

const eraseFive = document.getElementById("5seconds");
const eraseTen = document.getElementById("10seconds");

const timeButton = document.getElementById("timeMode");
const wordButton = document.getElementById("wordMode");
const timeConfigs = document.getElementById("timeConfigs");
const wordConfigs = document.getElementById("wordConfigs");

const copyWorkButton = document.getElementById("copyWork");
const resetButton = document.getElementById("resetWork");

const progressBar = document.getElementById("progressBar");


// Main Runtime Based on isTimeMode

function tick() {
	// Check finish condition
	if (isTimeMode) {
  	if (timeSinceStart > timeSetting) {
    	winWriting();
		}
  } else {
  	if (wordCount === wordSetting) {
    	winWriting();
    }
  }

  if (willErase) {
    if (timeSinceStroke > eraseTime) {
      failWriting();
      return;
    }
    // Dealing with Erase Timer
    inputTextArea.style.opacity = textOpacity;
    timeSinceStroke += tickSpeed/1000;
    textOpacity -= (tickSpeed / (eraseTime * 1000));
  }

	//Dealing with Main Timer
	timeSinceStart += tickSpeed/1000;
  
  // If we're on timeMode then we want to address the timer progress bar
  // If we're not on timeMode, the progress bar is addressed in onKeyStroke
  if (isTimeMode) {
  	updateProgressBar();
  }
  
}

// Handling Erase Timer
inputTextArea.addEventListener("input", onKeyStroke);

function startWriting() {
	document.getElementById("noteConfig").style.visibility = "hidden";
  document.getElementById("footer").classList.add("hidden");
  progressBar.classList.remove("hidden");
  startTime = currentTime();
  isWriting = true;
  timeoutID = setInterval(tick, 10);
}

function onKeyStroke() {
  if (!isWriting) {
    startWriting();
  } else {
    timeSinceStroke = 0;
    textOpacity = 1;
    updateWordCount();
    updateProgressBar();
  }
}

function stopWriting() {
	document.getElementById("noteConfig").style.visibility = "visible";
  document.getElementById("footer").classList.remove("hidden");
  progressBar.classList.add("hidden");
  isWriting = false;
  textOpacity = 1;
  inputTextArea.style.opacity = textOpacity;
	clearInterval(timeoutID);
  timeSinceStroke = 0;
  timeSinceStart = 0;
}

function winWriting() {
	stopWriting();
	document.getElementById("copyWork").classList.remove("hidden");
  
  //prompt writer if they want to continue writing without a limit
  
}

function failWriting() {
	stopWriting();
  resetWriting();
  alert("your work has been erased");
}

function currentTime() {
  return new Date().getTime(); //this returns seconds since epoch 
}

function resetWriting() {
	stopWriting();
  inputTextArea.value = "";
  progressBar.style.width = "100%";document.getElementById("copyWork").classList.add("hidden");
}

// Word Counter
function updateWordCount() {
  wordCount = inputTextArea.value.trim().split(/\s+/).filter((item) => item).length;

}

function updateProgressBar() {
	if (isTimeMode) {
  	let percentAsWhole =  (timeSinceStart/timeSetting) * 100;
    progressBar.style.width = (100 - percentAsWhole) + "%";
  } else {
  	let percentAsWhole = (wordCount / wordSetting)*100;
    progressBar.style.width =  (100 - percentAsWhole) + "%";
  }
}

//BUTTONS

resetWork.addEventListener("click", function() {
	resetWriting();
});

copyWork.addEventListener("click", function() {
	inputTextArea.setSelectionRange(0, 99999);
  inputTextArea.select();
  document.execCommand("Copy");
});

//	Erase Button Toggle

eraseToggleButton.addEventListener("click", function() {
  if (eraseToggleButton.classList.contains("active")) {
    eraseToggleButton.classList.remove("active");
    willErase = false;
  } else {
    eraseToggleButton.classList.add("active");
    willErase = true;
  }

});

//	Erase Time Buttons
eraseFive.addEventListener("click", function() {
  eraseFive.classList.add("active");
  eraseTen.classList.remove("active");
  eraseTime = 5;
});

eraseTen.addEventListener("click", function() {
  eraseTen.classList.add("active");
  eraseFive.classList.remove("active");
  eraseTime = 10;
});


// Mode Options
timeButton.addEventListener("click", function() {
  //adjust mode buttons
  timeButton.classList.add("active");
  wordButton.classList.remove("active");
  //adjust config buttons
  timeConfigs.classList.remove("hidden");
  wordConfigs.classList.add("hidden");
  isTimeMode = true;
});

wordButton.addEventListener("click", function() {
  //adjust mode buttons
  wordButton.classList.add("active");
  timeButton.classList.remove("active");
  //adjust config buttons
  wordConfigs.classList.remove("hidden");
  timeConfigs.classList.add("hidden");
  isTimeMode = false;
});

// Time Config Buttons
for (let i = 0; i < 3; i++) {
	let button = document.getElementsByClassName("timeConfigButton")[i];
  button.addEventListener("click", function() {
  	button.classList.add("active");
    timeSetting = parseInt(button.innerHTML[0]*60);
    for (j = 0; j < 3; j++) {
    	if(j != i){
      	document.getElementsByClassName("timeConfigButton")[j].classList.remove("active");
      }
    }
  });
}

// Word Config Buttons
for (let i = 0; i < 3; i++) {
	let button = document.getElementsByClassName("wordConfigButton")[i];
  button.addEventListener("click", function() {
  	button.classList.add("active");
    wordSetting = parseInt(button.innerHTML);
    for (j = 0; j < 3; j++) {
    	if(j != i){
      	document.getElementsByClassName("wordConfigButton")[j].classList.remove("active");
      }
    }
  });
}








