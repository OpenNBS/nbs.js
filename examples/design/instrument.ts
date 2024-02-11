import { Instrument, Song } from "@encode42/nbs.js";

const instrument = new Instrument({
	"name": "Sandple",
	"soundFile": "sand.ogg" // Just a string in nbs.js, no IO is performed
});

// ONBS's built-in instruments are provided
console.dir(Instrument.builtIn);

// You'll want to add that instrument to a song, otherwise it won't do much!
const song = new Song();
song.instruments.add(instrument);
