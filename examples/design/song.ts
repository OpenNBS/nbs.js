import { Layer, Song } from "@nbsjs/core";

const song = new Song();
song.name = "Demo";
song.description = "A song used for demonstration purposes.";
song.author = "nbs.js";

// To read and modify layers and notes, use "song.layers";
const firstLayer = song.layers.create();
const secondLayer = song.layers.add(
	new Layer({
		"name": "Second layer"
	})
);

song.layers.delete(0); // Goodbye firstLayer!

console.dir(song.layers.all);

// Some properties affect others
console.log(song.getTimePerTick());
song.tempo = 20;
console.log(song.getTimePerTick());
