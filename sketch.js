var dogImg, happyDogImg;
var dogSprite;
var database = firebase.database();
var milkImage;
var foodStock = 0;
var lastFed = {hour: undefined, minute: undefined, dayHalf: undefined, day: undefined};
var lastFedRefHour, lastFedRefMinute, lastFedRefDayHalf, gameStateRef;
var foodRef;
var feedButton, restockButton;
var foodObj;
var gameState = 'Playing';
var bedroomImg, gardenImg, bathroomImg, livingRoomImg;

function getFoodStock(data) {
	foodStock = data.val();
}

function feed() {
	foodStock = foodStock - 1;
	if (foodStock < 0) {
		console.log(alert('Error: You have no food'));
		foodStock++;
		return;
	}
	lastFed.day = day();
	lastFed.hour = hour();

	if (lastFed.hour > 11) {
		lastFed.hour = lastFed.hour % 12;
		lastFed.dayHalf = 'PM';
		if (lastFed.hour === 0) {
			lastFed.hour = 12;
		}
	}
	lastFed.minute = minute();

	if (lastFed.minute < 10) {
		lastFed.minute = '0' + minute();
	}

	database.ref('/').update({
		Food: foodStock,
	});

	database.ref('LastFeedTime').update({
		hour: lastFed.hour,
		minute: lastFed.minute,
		DayHalf: lastFed.dayHalf,
		day: lastFed.day,
	});
}

function restock() {
	foodStock++;
	if (foodStock > 20) {
		foodStock -= 1;
		console.log(alert('Error: Cannot add more food to the stock'));
	}
	database.ref('/').update({
		Food: foodStock,
	});
}

function updateGameState() {
	database.ref('/').update({
		GameState: gameState,
	});
}

//SPACER

function preload() {
	dogImg = loadImage('images/Dog.png');
	milkImage = loadImage('images/Milk.png');
	happyDogImg = loadImage('images/happydog.png');

	bedroomImg = loadImage('images/Bed Room.png');
	bathroomImg = loadImage('images/Wash Room.png');
	gardenImg = loadImage('images/Garden.png');
	livingRoomImg = loadImage('images/Living Room.png');
}

function setup() {
	createCanvas(500, 500);
	dogSprite = createSprite(250, 250, 1, 1);
	dogSprite.addImage(dogImg);
	dogSprite.scale = 0.3;

	foodObj = new Food();

	foodRef = database.ref('Food');
	foodRef.on('value', getFoodStock);

	lastFedRefHour = database.ref('LastFeedTime/hour');
	lastFedRefHour.on('value', (data) => {
		lastFed.hour = data.val();
	});

	lastFedRefMinute = database.ref('LastFeedTime/minute');
	lastFedRefMinute.on('value', (data) => {
		lastFed.minute = data.val();
	});

	lastFedRefDayHalf = database.ref('LastFeedTime/DayHalf');
	lastFedRefDayHalf.on('value', (data) => {
		lastFed.dayHalf = data.val();
	});

	feedButton = createButton('Feed');
	feedButton.position(500, 60);
	feedButton.mousePressed(feed);

	restockButton = createButton('Restock Food');
	restockButton.position(400, 60);
	restockButton.mousePressed(restock);

	
}

function draw() {
	//background('black');

	if (hour() % 12 === lastFed.hour || hour() === lastFed.hour) {
		background(livingRoomImg);
		dogSprite.visible = false;
		feedButton.hide();
		restockButton.hide();
	} else if (hour() % 12 === lastFed.hour || hour() === lastFed.hour) {
		background(gardenImg);
		dogSprite.visible = false;
		feedButton.hide();
		restockButton.hide();
	} else if (hour() % 12 === lastFed.hour + 1) {
		background(bathroomImg);
		dogSprite.visible = false;
		feedButton.hide();
		restockButton.hide();
	} else if (hour() % 12 === lastFed.hour + 2) {
		background(bedroomImg);
		dogSprite.visible = false;
		feedButton.hide();
		restockButton.hide();
	} else if (hour() % 12 === lastFed.hour + 3) {
		background('#1BDD26');
		dogSprite.visible = true;
		dogSprite.addImage(dogImg);
		feedButton.show();
		restockButton.show();
	} else if (hour() % 12 === lastFed.hour + 10) {
		background('#1BDD26');
		dogSprite.visible = true;
		dogSprite.addImage('images/deadDog.png');
		feedButton.show();
		restockButton.show();
	} else {
		background(livingRoomImg);
	}

	drawSprites();

	stroke('#000000');
	fill('#000000');
	textSize(20);
	text('Food: ' + foodStock, 400, 30);

	/*
	if (hour() < lastFed.hour + 5) {
		dogSprite.addImage(happyDogImg);
	} else {
		dogSprite.addImage(dogImg);
	}
	*/

	textSize(30);
	text('Last Fed: ' + lastFed.hour + ':' + lastFed.minute + ' ' + lastFed.dayHalf, 125, 490);

	foodObj.display();
}
