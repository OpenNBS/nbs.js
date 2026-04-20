/** biome-ignore-all lint/style/noNonNullAssertion: Disabled for brevity */

import { readSample } from "../accuracy/samples/readSample";

import {
	BinaryReader,
	BinaryStep,
	BinaryWriter,
	InstrumentBehavior,
	MinecraftInstruments,
	Song
} from "@nbsjs/core";

function readTotalNotes(writer: BinaryWriter): number {
	const arrayBuffer = writer.toArrayBuffer();

	const reader = new BinaryReader(arrayBuffer);
	const song = reader.toSong();

	return song.totalNotes;
}

test("Write a song to an NBS file", () => {
	const song = new Song();

	song.name = "Foo";
	song.description = "Bar";

	// The `BinaryWriter` can be used to write data to a buffer
	const writer = new BinaryWriter(song);

	const arrayBuffer = writer.toArrayBuffer();

	// It's that easy! Saving the array buffer depends on which runtime is in use (Node.js, Bun, browser, etc.)
	// To demonstrate the buffer's integrity, it will be read back into a song
	const restoredReader = new BinaryReader(arrayBuffer);
	const restoredSong = restoredReader.toSong();

	expect(restoredSong.name).toBe("Foo");
	expect(restoredSong.description).toBe("Bar");
});

test("Write a manipulated song to an NBS file", async () => {
	// Since the binary writer accepts any `Song` instance, manipulating an existing NBS file is easy
	// For this example, a sample file from the accuracy tests will be used
	const sampleBuffer = (await readSample("simple.nbs")).buffer;
	const reader = new BinaryReader(sampleBuffer);
	const song = reader.toSong();

	expect(song.name).toBe("Njalla");

	song.name = "Foo";

	const writer = new BinaryWriter(song);
	const arrayBuffer = writer.toArrayBuffer();

	// To demonstrate the buffer's integrity, it will be read back into a song
	const restoredReader = new BinaryReader(arrayBuffer);
	const restoredSong = restoredReader.toSong();

	expect(restoredSong.name).toBe("Foo");
});

test("Alter how a song's parameters are written to an NBS file", async () => {
	const song = new Song();

	// Since the NBS specification has multiple versions, certain data may be omitted when writing for older versions
	const layer = song.layers.builder().name("Foo").volume(75).panning(-50).build();
	const note = layer.notes.builder().instrument(MinecraftInstruments.HARP).pitch(0.2).build();

	expect(layer.volume).toBe(75);
	expect(layer.panning).toBe(-50);

	expect(note.pitch).toBe(0.2);

	const ancientWriter = new BinaryWriter(song, {
		"version": 0
	});

	const arrayBuffer = ancientWriter.toArrayBuffer();

	// To demonstrate this, it will be read back into a song
	const restoredReader = new BinaryReader(arrayBuffer);
	const restoredSong = restoredReader.toSong();

	const restoredLayer = restoredSong.layers.at(0)!;
	const restoredNote = restoredLayer.notes.at(0)!;

	expect(restoredLayer.volume).toBe(75);
	expect(restoredLayer.panning).toBe(0);

	expect(restoredNote.pitch).toBe(0);
});

test("Alter how a song's instruments are written to an NBS file", () => {
	const song = new Song();

	const harpLayer = song.layers.builder().build();
	const trumpetLayer = song.layers.builder().build();

	for (let tick = 0; tick < 16; tick += 4) {
		harpLayer.notes.builder().instrument(MinecraftInstruments.HARP).at(tick).build();
		trumpetLayer.notes.builder().instrument(MinecraftInstruments.TRUMPET).at(tick).build();
	}

	// The layer transformers from `BinaryReader` are supported by the binary writer as well
	// Check the `binaryReader` test for relevant examples

	// The NBS specification exists in multiple versions that support different features and instruments
	// Methods are provided to alter notes that are unavailable on a specified version

	const modernWriter = new BinaryWriter(song, {
		"version": 6
	});

	expect(readTotalNotes(modernWriter)).toBe(8);

	// The default behavior is `Skip`
	const skipWriter = new BinaryWriter(song, {
		"transformers": {
			"instruments": {
				"behavior": InstrumentBehavior.Skip
			}
		},
		"version": 0
	});

	expect(readTotalNotes(skipWriter)).toBe(4);

	// `Fallback` transforms notes with unsupported instruments to utilize the specified instrument instead
	const fallbackWriter = new BinaryWriter(song, {
		"transformers": {
			"instruments": {
				"behavior": InstrumentBehavior.Fallback,
				"to": MinecraftInstruments.DOUBLE_BASS
			}
		},
		"version": 0
	});

	expect(readTotalNotes(fallbackWriter)).toBe(8);

	// If the specified fallback instrument isn't supported by the written version, an error will be thrown
	expect(() => {
		new BinaryWriter(song, {
			"transformers": {
				"instruments": {
					"behavior": InstrumentBehavior.Fallback,
					"to": MinecraftInstruments.PLING
				}
			},
			"version": 0
		});
	}).toThrow();
});

test("Ensure that a completed binary reader cannot be re-used", () => {
	const song = new Song();
	const writer = new BinaryWriter(song);

	// Binary writers are processed incrementally
	// They cannot be re-used once they've completed processing
	song.name = "Foo";

	expect(writer.step).toBe(BinaryStep.Header);

	const fooArrayBuffer = writer.toArrayBuffer();

	expect(writer.step).toBe(BinaryStep.Complete);

	// If a song is modified past its relevant step, the writer will not reflect such a change
	song.name = "Bar";

	const barArrayBuffer = writer.toArrayBuffer();

	expect(Buffer.compare(new Uint8Array(fooArrayBuffer), new Uint8Array(barArrayBuffer))).toBe(0);
});
