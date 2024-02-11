import { Song, toJSON } from "@encode42/nbs.js";

const song = new Song();
song.name = "Chaos";
song.description = "A randomly generated song.";
song.author = "Pseudorandomness";

// Create four random layers
for (let i = 0; i < 4; i++) {
	createRandomLayer(i);
}

// Create a new layer with random notes
function createRandomLayer(number: number) {
	const layer = song.layers.create();
	layer.name = `Randomness ${number}`;
	layer.stereo = number % 2 === 0 ? -100 : 100;

	// Add ten notes with random key and instrument, four ticks apart
	for (let i = 0; i < 10; i++) {
		layer.notes.add(i + 4, random(1, song.instruments.total - 1), {
			"key": random(0, 87)
		});
	}
}

// Ye Olde RNG
function random(min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min;
}

console.dir(JSON.stringify(toJSON(song), undefined, 4));
