class Food {
	constructor() {}

	display() {
		for (var i = foodStock; i > 0; i = i - 1) {
			image(milkImage, i * 25, 50, 50, 50);
		}
	}
	getFoodStock(data) {
		foodStock = data.val();
	}

	updateFoodStock(foodVal) {
		database.ref('/').update({
			Food: foodVal,
		});
	}
}
