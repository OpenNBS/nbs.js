import { readSample } from "../accuracy/samples/readSample";

import { BinaryReader, LayerBehavior } from "@nbsjs/core";

test("Read a song from an NBS file", async () => {
	// First, read a file into an array buffer
	// This depends on which runtime is in use (Node.js, Bun, browser, etc.)
	// For this example, a sample file from the accuracy tests will be used
	const sampleBuffer = (await readSample("simple.nbs")).buffer;

	// The `BinaryReader` can be used to read data from an NBS file
	const reader = new BinaryReader(sampleBuffer);

	// To read a file up until its header, use `#toHeader()`
	// Only data contained within the binary's header (name, description, statistics, etc.) will be included
	// This may be useful when reading large binary files in order to quickly display or process data
	const header = reader.toHeader();

	expect(header.name).toBe("Njalla");
	expect(header.description).toBe("A simple melody used for testing NBS.js.");

	// To read a file in its entirety, use `#toSong()`
	// The binary is processed incrementally, meaning that the data read earlier will not be re-read
	const song = reader.toSong();

	expect(song.name).toBe("Njalla");
	expect(song.description).toBe("A simple melody used for testing NBS.js.");

	expect(song.totalNotes).toBe(49);

	// The header and song are separate objects and do not impact each other
	header.name = "Foo";

	expect(header.name).toBe("Foo");
	expect(song.name).toBe("Njalla");
});

test("Alter how a song is read from an NBS file", async () => {
	const sampleBuffer = (await readSample("simple.nbs")).buffer;

	// Note Block Studio automatically adds empty layers to the end of a song depending on screen size
	// This may be undesireable, so the binary reader provides methods to alter them

	// The default behavior is `None`
	const noneReader = new BinaryReader(sampleBuffer, {
		"transformers": {
			"layers": {
				"behavior": LayerBehavior.None
			}
		}
	});

	const noneSong = noneReader.toSong();

	expect(noneSong.layers.total).toBe(34);

	// `SkipTrailing` skips those extra empty layers during the relavent processing step
	const skipTrailingReader = new BinaryReader(sampleBuffer, {
		"transformers": {
			"layers": {
				"behavior": LayerBehavior.SkipTrailing
			}
		}
	});

	const skipTrailingSong = skipTrailingReader.toSong();

	expect(skipTrailingSong.layers.total).toBe(4);

	// `Skip` skips any empty layer
	// Our sample does not contain any empty layers other than the trailing layers
	const skipReader = new BinaryReader(sampleBuffer, {
		"transformers": {
			"layers": {
				"behavior": LayerBehavior.Skip
			}
		}
	});

	const skipSong = skipReader.toSong();

	expect(skipSong.layers.total).toBe(4);

	// `Ensure` will add the specified amount of empty layers if not already present
	const ensureReader = new BinaryReader(sampleBuffer, {
		"transformers": {
			"layers": {
				"amount": 40,
				"behavior": LayerBehavior.Ensure
			}
		}
	});

	const ensureSong = ensureReader.toSong();

	expect(ensureSong.layers.total).toBe(40);
});

test("Read raw data from an NBS file", async () => {
	const sampleBuffer = (await readSample("simple.nbs")).buffer;
	const reader = new BinaryReader(sampleBuffer);

	// This library aims to provide a robust and intuitive way to read, manipulate, and write NBS files
	// As such, many fields utilize getters and setters, argument validation, and class inheritance
	// This comes at the cost of performance, which is minor in most cases, but can be noticed when dealing with large songs

	// If performance is the utmost priority, the raw intermediary data can used instead of the convenient `Header` and `Song` classes
	// As with `#toHeader` and `#toSong`, each step is processed incrementally
	const header = reader.atHeaderStep();

	expect(header.name).toBe("Njalla");
	expect(header.description).toBe("A simple melody used for testing NBS.js.");

	const notes = reader.atNotesStep();

	expect(notes.length).toBe(49);

	// The binary is always parsed in order, meaning that skipping a step will still process the step
	const instruments = reader.atInstrumentsStep();

	expect(instruments.length).toBe(0);

	// `#atLayersStep()` had been skipped, but can still be accessed since it had been processed by requirement of `#atInstrumentsStep()`
	const layers = reader.atLayersStep();

	expect(layers.length).toBe(34);
});
