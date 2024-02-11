import { Layer, Song, SongLayers } from "@encode42/nbs.js";

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

console.dir(song.layers.get);

// Some properties affect others
console.log(song.timePerTick);
song.tempo = 20;
console.log(song.timePerTick);

// Some properties are read-only (TypeError and error thrown)
song.layers.get = new SongLayers();
song.duration = 5;
