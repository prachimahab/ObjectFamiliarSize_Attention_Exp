// ---------------------------
// initialize global variables
// ---------------------------

// set-up data object --> all key values will be the headers on the output csv
var thisData = {
	"subjID":[],
	"experimentName":[],
	"versionName":[],
	"sequenceName": [],
	"windowWidth":[],
	"windowHeight":[],
	"screenWidth":[],
	"screenHeight":[],
	"startDate":[],
	"startTime":[],
	"pracTries":[],
	"trialNum":[],
	"scene":[],
	"object":[],
	"side": [],
	"gabor":[],
	"objectCategory":[],
	"objSceneSemCong":[],
	"scale":[],
	"image":[],
	"presentationSize":[],
	"keyPress":[],
	"accuracy":[],
	"RT":[],
	"ratingTrialNum": [],
	"rating": [],
	"thisRatingTrialFile":[]
};

// set subject ID as a random 6 digit number
var subjID = randomIntFromInterval(100000, 999999);

// start time variables
var start = new Date;
var startDate = (start.getMonth()+1) + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();

// initialize empty variables
var endExpTime, startExpTime, RT, key, fixTime, thisTrialObj, thisTrialScene, thisTrialSceneCat, practice_scenes, practice_objDict, thisObjCat,thisTrialSemCong, thisTrialObjSizeName, thisTrialRating, thisTrialSide, thisTrialGabor, thisFile, objSceneSemCong, thisRatingRT, removeRatingScene, presentationSize, startRatingTrialTime, endRatingTrialTime, thisPracPresentationSize;

var trialSequence = ["p0_large_cake_L_H.png","p1_small_apple_L_V.png","p2_large_dog_R_V.png","p3_small_shoe_R_H.png","p4_large_sunglasses_R_H.png","p5_small_hat_L_V.png"];

var age_recorded = false;

var classroomScenes = ["c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","c10","c11"];
var kitchenScenes = ["k0","k1","k2","k3","k4","k5","k6","k7","k8","k9","k10","k11"];

var objDict = {
	"large":{
		"classroom":{"scaled":["clipboard","laptop","notebook"],"misscaled":["binderclip","eraser","flashdrive"]},
		"kitchen":{"scaled":["kettle","pot","toaster"],"misscaled":["saltshaker","sponge","spoon"]}
	},
	"small":{
		"classroom":{"misscaled":["clipboard","laptop","notebook"],"scaled":["binderclip","eraser","flashdrive"]},
		"kitchen":{"misscaled":["kettle","pot","toaster"],"scaled":["saltshaker","sponge","spoon"]}
	}
};

var sideConds = ["L","L","L","L","L","L","R","R","R","R","R","R"]
var gaborConds = ["H","H","H","H","H","H","V","V","V","V","V","V"]

// practice variables
var pracTries = 1; // everyone does the practice at least once
var pracTrialNum = 0;
var pracTotalTrials = 6;

// block var
var thisBlockNum = 0;
var totalTrials = 12;

// timing variables
// var wordTime = 1500;
var sceneTime = 30000;
var ratingScaleTime = 30000;

// accuracy variables
var prevAcc = 1;
var trialNum = 0;
var trialInBlockNum = 0;
var ratingTrialNum = 0;

// key info
// c = category match; m = category mis-match
var keyDict = {"c": "H", "m": "V", "none": "none"}

// ---------------------------------
// read in counterbalaced conditions
// ---------------------------------
// reads in counterbalancing csv and calls function to get sequence filepath 
// Row of counterbalancing array to be sampled is stored in the url fragment (part after #)
var url = window.location.href;
var url_split = url.split("#");
var url_num = url_split[url_split.length - 1];

var conditions = $.ajax({url: 'counterbalancing.csv', dataType: 'text',}).done(successFunction);

function successFunction(conditions) {
	// reads in CSV and converts to JS array
	var allRows = conditions.split(/\r?\n|\r/);
	var table = [];
	for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
    	var rowCells = allRows[singleRow].split(',');
    	for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
			if (rowCell == 0){
				var table_row = [];
			}                 
			table_row.push(rowCells[rowCell]);
    	}
    	table.push(table_row);
  	}
	counterbalancing_array = table;

	seq_filepath = counterbalancing_array[url_num][0]; // filepath is the first element of the row (passed in through URL)
	selected_row = url_num; // log which row was selected 
	console.log(seq_filepath)

	// ajax request for selected JSON (seq_filepath)
	stim_seq = $.ajax({ // loads in stimulus sequence from server
			url: seq_filepath,
			method: 'GET',
			dataType: 'json',
			data: JSON.stringify(),
			success: function (conditions) {
				stim_seq = conditions; 
				sequenceName = seq_filepath // get sequence name, which is pushed in saveTrialData
				// preload(practice_seq, stim_seq); // calls function to preload all scene images 
			},
	});
}

// ----------------
// set-up functions
// ----------------

$(document).ready(function(){
	// on open, add this text to the startingInstructions div and pre-load all stimuli

	document.getElementById("subjID").value = subjID;
	document.getElementById("startDate").value = startDate;
	document.getElementById("startTime").value = startTime;

	// preloadStimuli();


	$("#nextButton").show();

});

function preloadStimuli(){
	// loads all stimuli into document under hidden div so there is no lag when calling them

	for (var sceneNum=0; sceneNum<sceneCats.length; sceneNum++){ //for each scene category
		var sceneImgDict = sceneDict[sceneCats[sceneNum]]; //3 dictionaries of images per zoom
		for (var zoomNum=0; zoomNum<Object.keys(sceneImgDict).length; zoomNum++){//for each zoom
			var thisZoom = zoomCats[zoomNum];
			var thisZoomImgs = sceneImgDict[thisZoom]; //these 6 images in one zoom
			for (var zoomImg = 0; zoomImg<thisZoomImgs.length; zoomImg++){ //for each image
				var img = document.createElement("img");
				img.src = "stimuli/" + sceneCats[sceneNum] + "/scenes/" + thisZoom + "/" + thisZoomImgs[zoomImg];
			}
		}
	}
}


function showStartingInstructions(){
	$("#startingInstructions").hide();
	$("#nextButton").hide();
	$("#startingInstructions2").show();
	$("#nextButton2").show();
	
	// $(".instructions").hide(); //hide all instructions
	// $(".buttonDiv").hide(); //hide all buttons
	$("#experimentBox").hide(); //hide the experiment part
}

function showSecondInstructions(){
	$(".instructions").hide(); //hide all instructions
	$(".buttonDiv").hide(); //hide all buttons
	$("#experimentBox").hide(); //hide the experiment part
	$("#secondInstructions").show();
	$("#startPracticeButton").show();

	$.ajax({ //same as $.post, but allows for more options to be specified
		type: "GET", // since data is included in the url it is a GET request 
		url: 'https://spatial-perception-4e1b90d4f4e5.herokuapp.com/mark_pending?experiment='+ encodeURIComponent(url), //update from unsampled to pending
	
		// if it works OR fails, submit the form
		success: function(){
		},
		error: function(){
		  window.alert("Server error. Please return the task and/or message us.");
		}
	  });
}

function showInstructions(){
	// this is a generic function to show things in the instruction page format
	// have to append here instead of setting in html because variables are included

	$(".instructions").hide(); //hide all instructions
	$(".buttonDiv").hide(); //hide all buttons
	$("#experimentBox").hide(); //hide the experiment part

	if (thisBlockNum == 0){ //if its practice (because they did poorly first try)
		$("#practiceWrongInstructions").text("");
		$("#practiceWrongInstructions").append(
			"<p>You didn't do well enough on the practice section. Try again, and once you have shown an understanding of the task, the experiment will begin.</p><br>"
			+ "<br><p>Please read the instructions very carefully</p>"
			+ "<p>In this task you will see different objects on top of different scenes. On each trial you will first see a fixation cross appear followed by a scene. The scene has an object, over which there will be an oriented grating (i.e., a circle composed of lines) that is either horizontal or vertical. This scene will appear for a brief amount of time. After that, you will see a green fixation cross.</p>"
			+ "<p>Your task is to respond <strong>'Was the oriented grating - HORIZONTAL (press 'c') or VERTICAL (press 'm') </strong></p>"
			+ "<p>Please respond as quickly and accurately as possible. When you answer incorrectly, the fixation cross will turn red (<font color=red>+</font>). Try to slow down if you see you are getting many wrong!</p>"
			+ "<br><p>When you are ready to redo the practice section, click the button below.</p>");
		$("#practiceWrongInstructions").show();
		$("#redoPracticeButton").show();
	}
	else if (thisBlockNum == 1){ //if its the beginning of the experiment
		$("#firstBlockInstructions").show();
		$("#startExperimentButton").show();
	}
	else if (thisBlockNum == 2){
		$("#secondBlockInstructions").show();
		$("#startRatingExperimentButton").show();
	}
	else { //if last block
		endExpTime = new Date; //get time of end of last block to calculate total experiment time
		getAge();
	}
}

function prepareForFirstTrial(){
	// get rid of instructions page and show experiment box

	$(".instructions").hide();
	$(".buttonDiv").hide();
	if (thisBlockNum != 2){
		$("#experimentBox").show();
	}
	else{
		$("#ratingExperimentBox").show();
	}
	if (thisBlockNum == 1){
		numCorr = 0; //reset number correct for next block
		prevAcc = 1; //reset accuracy for next block so fixation is neutral and 400ms

		startExpTime = new Date;
		var trialNum = 0;
	}
}


function prepareForFirstPracticeTrial(){
	// get rid of instructions page and show experiment box

	$(".instructions").hide();
	$(".buttonDiv").hide();
	$("#experimentBox").show();

	practiceScenes = ["p0_large_cake_L_H","p1_small_apple_L_V","p2_large_dog_R_V","p3_small_shoe_R_H","p4_large_sunglasses_R_H","p5_small_hat_L_V"];

	pracTrialNum = 0;

	numCorr = 0; //reset number correct for next block
	prevAcc = 1; //reset accuracy for next block so fixation is neutral and 400ms
}

function prepareForPracticeTrial(){

	var thisPracTrial = practiceScenes[pracTrialNum];
	[thisPracScene, thisPracPresentationSize, thisPracObj, thisTrialSide, thisTrialGabor] = thisPracTrial.split("_");

	$("#sceneImage").attr("src","stimuli/" + thisPracTrial + ".png");

	// $("#wordImage").attr("src","stimuli/words/" + thisPracObj + ".png");

	fixTime = showFixation(prevAcc); //show fixation based on previous accuracy
	key = "none"; //"resetting" key press from previous trial, doesn't change if no button is pressed
}

function prepareForTrial(){

	[thisTrialScene, thisTrialObj, thisTrialSide, thisTrialObjCat, thisTrialScale, thisTrialSceneCat, objSceneSemCong, presentationSize, thisTrialGabor] = getConds();
	thisFile = chooseSetObjectScene([thisTrialScene, presentationSize, thisTrialObj, thisTrialSide, thisTrialGabor]);

	trialSequence.push(thisFile);

	fixTime = showFixation(prevAcc); //show fixation based on previous accuracy
	key = "none"; //"resetting" key press from previous trial, doesn't change if no button is pressed
}

function getConds(){
		// choose which side the target will be on
	thisTrialSide = shuffle(sideConds).pop();
	thisTrialGabor = shuffle(gaborConds).pop()

	// get condition info from json file
	// each stimulus file looks like this: c6_large_toaster_L.png
	thisTrial = stim_seq[trialNum];
	[thisTrialScene, presentationSize, thisTrialObj] = thisTrial.split("_");

	// get scene category
	if (thisTrialScene[0] == "c"){
		thisTrialSceneCat = "classroom"
	}
	else {
		thisTrialSceneCat = "kitchen"
	}

	//get object category and scale
	for (category in objDict[presentationSize]){
		for (scale in objDict[presentationSize][category]){
			if (objDict[presentationSize][category][scale].includes(thisTrialObj) == true){
				thisTrialObjCat = category;
				thisTrialScale = scale;
				break;
			}
		}
	}

	if (thisTrialSceneCat == thisTrialObjCat){
		objSceneSemCong = 1;
	}
	else{
		objSceneSemCong = 0;
	}

	return [thisTrialScene, thisTrialObj, thisTrialSide, thisTrialObjCat, thisTrialScale, thisTrialSceneCat, objSceneSemCong, presentationSize, thisTrialGabor];
}

function chooseSetObjectScene([thisTrialScene, presentationSize, thisTrialObj, thisObjSide, thisTrialGabor]){

	// get string name of png file
	thisFile = thisTrialScene + "_" + presentationSize + "_" + thisTrialObj + "_" + thisObjSide + "_" + thisTrialGabor + ".png";
	$("#sceneImage").attr("src","stimuli/" + thisFile); //set obj image
	// $("#wordImage").attr("src","stimuli/words/" + thisTrialObj + ".png");

	return thisFile;
}

// ----------------------
// presentation functions
// ----------------------

function showFixation(){
	// show fixation based on previous accuracy

	if (prevAcc==0){
		fixTime = 5000;
		$("#fixationRed").show();
		$("#incorrect").show();
	}
	if (prevAcc==1){
		fixTime = 2000;
		$("#fixationNeutral").show();
		if (thisBlockNum == 0){
			if (pracTrialNum > 0){
				$("#correct").show();
			}
		}
		else{
			if (trialNum > 0) {
				$("#correct").show();
			}
		}
	}

	return fixTime
}

// function showWord(){

	// $(".fixationDiv").hide();
	// $(".correctDiv").hide();
	// $("#word").show();
// }

function showObjScene(){
	//show objects, hiding red fixation if necessary
	$(".fixationDiv").hide();
	$(".correctDiv").hide();

	startTrialTime = new Date;

	// $("#word").hide();

	if (thisBlockNum != 2){
		$(document).ready(function(){
			$(".sceneDiv").show();
		})
	}
	else {
		$(document).ready(function(){
			$(".ratingSceneDiv").show();
		})
	}
}

function showGreenFixation(){
	// hide everything except experiment box, at end of each trial

	$("#experimentBox").children().hide();
	$("#fixationGreen").show();
}

function hideAll(){
	$("#experimentBox").children().hide();
}

function getRatingTrial(){
// use list of trialSequence to set object and scene for this trial in the second part of the experiment
	//trialSequence.push([thisTrialScene, thisTrialObj, thisTrialSide, thisTrialObjCat, thisTrialScale, thisTrialSceneCat])
	// trialSequence.shuffle();
	thisRatingTrialFile = trialSequence[0];
	trialSequence.shift(); //removes first element

	$("#ratingSceneImage").attr("src","stimuli/" + thisRatingTrialFile);

	return thisRatingTrialFile;
}

// --------------------
// experiment functions
// --------------------

function startBlock(thisBlockNum) {
	// start running one block, onkeypress for button div

	if(thisBlockNum==0){
		prepareForFirstPracticeTrial(); 
		runTrial();
	}
	else if (thisBlockNum == 1){
		prepareForFirstTrial(); //get rid of instructions page and show experiment box
		runTrial(); //starts trial presentation, recursive function

	}
	else if (thisBlockNum == 2){
		prepareForFirstTrial();
		runRatingTrial();
	}
}

function runTrial(){
	
 	// run one trial --> recursive function (calls itself inside itself until some condition is met)

	if (thisBlockNum == 0){
		prepareForPracticeTrial();
	}
	if (thisBlockNum == 1){
		prepareForTrial(); // get trial info, including category, condition, objects, and target, and set stimuli
	}
	// var objShown = setTimeout(function(){
	// 	showObj();
	// }, fixTime)
	// var wordShown = setTimeout(function(){ //show objects after fixation time (400 or 800ms)
	// 	showWord();
	// }, fixTime);
	var objSceneShown = setTimeout(function(){ //show gabors after fixation time + object time (4s)
		showObjScene();
		detectKeyPress(trialOver);
	}, fixTime);
	var trialOver = setTimeout(function(){ //hide all stimuli and gabors after fixation time + object time + gabor timeout (2s)
		nextTrial();
	}, fixTime + sceneTime)

}

function runRatingTrial(){
	// using the list of obj/scene pairs
	//show experiment box??
	// $("#practiceWrongInstructions").append("<p>How mis-scaled (too small or too big) is the " + " object to this scene?</p>")
	$(".fixationDiv").hide();
	thisRatingTrialFile = getRatingTrial(); //get image scene
	var objectName = thisRatingTrialFile.split("_")[2];
	if (objectName == "binderclip"){
		objectName = "binder clip";
	}
	if (objectName == "flashdrive"){
		objectName = "usb flash drive";
	}
	if (objectName == "saltshaker"){
		objectName = "salt shaker";
	}

	$("#scaleQuestion").text("");
	$("#likert").prepend("<p id='scaleQuestion' style='text-align:center'>How mis-scaled (too small or too big) is the <b>" + objectName + "</b> to this scene?</p>")
	showObjScene();
	$("#likert").show();
	startRatingTrialTime = new Date;

}


function detectKeyPress(trialOver){
	// see if key is pressed to end trial early
	// add event listener for keypress
	$(document).bind("keypress", function(event){
		if (event.which == 99){ //99 is js keycode for c
			key = "c";
			clearTimeout(trialOver); //get rid of end-of-trial timer
			nextTrial(); //since button was pressed, move onto next trial
		}
		else if (event.which == 109){ //109 is js keycode for m
			key = "m";
			clearTimeout(trialOver); //get rid of end-of-trial timer
			nextTrial(); //since button was pressed, move onto next trial
		}
	});
}

function nextTrial(){ //requires input variable because it is not a global variable --> different for practice and experiment blocks
	// advance to next trial OR end block

	$(document).unbind("keypress"); //assuming there has already been a keypress, remove event so it can be added for next trial
	hideAll();

	// save accuracy for this trial and update number correct for block accuracy
	if (keyDict[key] == thisTrialGabor){
		prevAcc = 1;
		numCorr++;
	}
	else if (keyDict[key] != thisTrialGabor){
		prevAcc = 0;
	}

	var prac_blockAcc = numCorr/pracTotalTrials; //update block accuracy before adding 1 to trial in block number
	var endTrialTime = new Date;
	RT = endTrialTime - startTrialTime;

	if (thisBlockNum == 0){ //if practice block
		pracTrialNum ++ 
		if (pracTrialNum >= 6){
			if (prac_blockAcc > 0.8){ //if task is understood
				thisBlockNum++; //move onto experiment
			}
			else { //if task isn't understood
				pracTries++; //note that practice has been repeated	
			}
			showInstructions();
		
		}
		else{
			runTrial(); //re-run function
		}
	}

	else if (thisBlockNum != 0){
		// if the experiment is over 
		if (trialNum >= (totalTrials-1)){
			thisBlockNum++;
			saveTrialData();
			trialNum ++;
			showInstructions();
		}
		// do not save practice data
		else if (trialNum >= 0){
			saveTrialData();
			trialNum ++;
			runTrial();
		}
		// trialNum ++ 
	}

}

function nextRatingTrial(){

	endRatingTrialTime = new Date;
	ratingRT = endRatingTrialTime - startRatingTrialTime;

	ratingTrialNum ++;

	if (thisRatingTrialFile[0] != "p"){
		saveRatingTrial();
	}

	if (ratingTrialNum >= (totalTrials+pracTotalTrials)){
		thisBlockNum++;
		showInstructions();
	}
	else if (ratingTrialNum >= 0){
		runRatingTrial();
	}
}

function validateRating() {
	if ($("input[type=radio]:checked").length == 0){
		alert('Please select an option.');
		// return false;
		console.log("error!")
	}
	else {
		clearTimeout(removeRatingScene);
		// return true;
		submitAnswer();
		nextRatingTrial();

	}
}

function submitAnswer() {

	var radios = document.getElementsByName('choice');
	var ratingVal= "";
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			ratingVal = radios[i].value; 
			document.getElementById("ratingVal").value = ratingVal;
			break;
		}
	}
	console.log(ratingVal);

	$('input[name=choice]').prop('checked',false);
}


function endExperiment(){
	// gives participant their unique code and saves data to server --> this page should look identical to redirect html (revealCode.html)
	$("#endExpInstructions").append("<br><p style='text-align:center'><strong>Your unique completion code is: </strong>" +subjID+"</p>");
	$("#revealCodeButton").hide();
	saveAllData();
}

// ---------------------
// saving data functions
// ---------------------

function saveTrialData(){
	// at the end of each trial, appends values to data dictionary

	// global variables --> will be repetitive, same value for every row (each row will represent one trial)
	thisData["subjID"].push(subjID);
	thisData["experimentName"].push("Gabor-Discrimination");
	thisData["versionName"].push("v2");
	thisData["sequenceName"].push(sequenceName);
	thisData["windowWidth"].push($(window).width());
	thisData["windowHeight"].push($(window).height());
	thisData["screenWidth"].push(screen.width);
	thisData["screenHeight"].push(screen.height);
	thisData["startDate"].push(startDate);
	thisData["startTime"].push(startTime);
	thisData["pracTries"].push(pracTries);

	// trial-by-trial variables, changes each time this function is called
	thisData["trialNum"].push(trialNum);
	thisData["scene"].push(thisTrialScene);
	thisData["object"].push(thisTrialObj);
	thisData["side"].push(thisTrialSide);
	thisData["gabor"].push(thisTrialGabor);
	thisData["objectCategory"].push(thisTrialObjCat);
	thisData["objSceneSemCong"].push(objSceneSemCong);
	thisData["scale"].push(thisTrialScale);
	thisData["image"].push(thisFile);
	thisData["presentationSize"].push(presentationSize);
	thisData["keyPress"].push(key);
	thisData["accuracy"].push(prevAcc);
	thisData["RT"].push(RT);

	// use to debug if there is an offest in the php saving 
	// for (var key in thisData){
	// 	console.log(key, thisData[key].length)
	// }
}


function saveRatingTrial(){
	thisTrialRating = parseInt(document.getElementById("ratingVal").value);
	thisData["thisRatingTrialFile"].push(thisRatingTrialFile);
	thisData["ratingTrialNum"].push(ratingTrialNum-7);
	thisData["rating"].push(thisTrialRating);
	console.log(thisData);
	// thisData["ratingObject"].push(thisRatingTrialObj);
	// thisData["ratingScene"].push(thisRatingTrialScene);
}

function saveAllData() {
	// saves last pieces of data that needed to be collected at the end, and calls sendToServer function

	for (var key in thisData){
		console.log(key, thisData[key].length)
	}

	// add experimentTime and totalTime to data dictionary
	var experimentTime = (endExpTime - startExpTime);
	var totalTime = ((new Date()) - start);
	thisData["experimentTime"]=Array(trialNum).fill(experimentTime);
	thisData["totalTime"]=Array(trialNum).fill(totalTime);
	thisData["age"]=Array(trialNum).fill(reported_age);
	thisData["gender"]=Array(trialNum).fill(reported_gender);

	// change values for input divs to pass to php
	$("#experimentData").val(JSON.stringify(thisData));
	$("#completedTrialsNum").val(trialNum); //how many trials this participant completed

	sendToServer();
}

function sendToServer() {
	// send the data to the server as string (which will be parsed IN php)
  
	$.ajax({ //same as $.post, but allows for more options to be specified
	  headers:{"Access-Control-Allow-Origin": "*", "Content-Type": "text/csv"}, //headers for request that allow for cross-origin resource sharing (CORS)
	  type: "POST", //post instead of get because data is being sent to the server
	  url: $("#saveData").attr("action"), //url to php
	  data: $("#experimentData").val(),  
  
	  // if it works OR fails, submit the form
	  success: function(){
		$.ajax({ //same as $.post, but allows for more options to be specified
		  type: "GET", // since data is included in the url it is a GET request 
		  url: 'https://spatial-perception-4e1b90d4f4e5.herokuapp.com/mark_done?experiment='+ encodeURIComponent(url), //update from unsampled to pending
	  
		  // if it works OR fails, submit the form
		  success: function(){
			console.log('marked done')
		  },
		  error: function(){
			window.alert("Server error. Please return the task and/or message us.");
		  }
		});
		document.forms[0].submit();
	  },
	  error: function(){
		document.forms[0].submit();
	  }
	});
  }

// ----------------------
// other random functions
// ----------------------

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkArrayValuesInCommon(arr1, arr2){
	for (var i=0; i < arr1.length; i++){
		var overlap = arr2.includes(arr1[i]);
		if (overlap == true){
			break;
		}
	}
	return overlap
}

function arrayRemove(arr, value) { 
	return arr.filter(function(ele){ 
		return ele != value; 
	});
}

function calculateAverageOfArray(array) {
    var total = 0;
    var count = 0;

    jQuery.each(array, function(index, value) {
        total += value;
        count++;
    });

    return total / count;
}

function getAge(){
	$(document).ready(function(){
    	$("#ratingExperimentBox").hide();
    	$("#likert").hide()
    	$("#age").show();
	})
}

function lastInstructions(){ 
	if (age_recorded == false){
		reported_age = document.getElementById("age_numb").value;
		reported_gender = document.getElementById("gender").value;
		age_recorded = true
	}

  if (age_recorded == true){
    $("#age").hide() 
    $("#container-questionnaire").hide();
    $("#lastBlockInstructions").append(
		"<p style='text-align:center'>Congratulations, you have finished the experiment. Thank you for your participation!</p>"
		+"<p style='text-align:center'>Click the button below to reveal your unique completion code.</p>")
    $("#lastBlockInstructions").show();
    $("#revealCodeButton").show();

  }
 

}
