import { Note } from "@encode42/nbs.js";

// Instrument ID 0 is always harp
new Note(0, {
	"key": 42,
	"velocity": 80
});

new Note(0, {
	"key": 42,
	"velocity": 20,
	"panning": 50
});

// Notes do not have tick information tied to them!
// This is stored within the layer's "notes" object
