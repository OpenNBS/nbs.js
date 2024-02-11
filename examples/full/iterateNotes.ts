import { readFileSync, writeFileSync } from "node:fs";
import { fromArrayBuffer, toArrayBuffer } from "@encode42/nbs.js";

// Read a NBS file named "song.nbs"
const originalFile = readFileSync("song.nbs");
const originalBuffer = new Uint8Array(originalFile).buffer;
const song = fromArrayBuffer(originalBuffer);

// "get" is a getter function and should be cached during these operations
const instruments = song.instruments.get;

for (const layer of song.layers) {
	// Every layer
	for (const [tick, note] of layer.notes) {
		// Every note in the layer
		const songInstrument = instruments[note.instrument];
		console.log(`Note on layer ${layer.name}, tick ${tick}, is a ${songInstrument.name}`);

		note.key++;
		console.log(`The note's key has been increased to ${note.key}`);

		// Delete notes above or below the octave limit
		if (note.key < 33 || note.key > 57) {
			layer.notes.delete(tick);
		}
	}

	console.log(`There are now ${layer.notes.total} notes in this layer.`);
}

// Done transforming! Write the result to "transformed.nbs"
const exportedBuffer = toArrayBuffer(song);
writeFileSync("transformed.nbs", new Uint8Array(exportedBuffer));
