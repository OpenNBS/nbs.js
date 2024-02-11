import { Note, Song } from "@encode42/nbs.js";

// Create the song
const song = new Song();
song.name = "Hello";
song.description = "World!";

// Add a layer and a note
const layer = song.layers.create();
const note = new Note(0, {
	"key": 42
});

// Add the note to the layer
layer.notes.set(0, note);

// Alternatively, create a note directly on the layer
layer.notes.add(4, 0, {
	"key": 24
});

console.dir(song.layers);
