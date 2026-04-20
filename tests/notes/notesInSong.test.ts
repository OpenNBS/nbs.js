import type { LayerNoteTick, NoteKey } from "@nbsjs/core";
import {
	InstrumentBuilder,
	KeyParameter,
	LayerStatus,
	MinecraftInstruments,
	NoteBuilder,
	ResourceLocation,
	Song
} from "@nbsjs/core";

test("Register a note", () => {
	const song = new Song();
	const layer = song.layers.builder().build();

	const note = new NoteBuilder().instrument(MinecraftInstruments.HARP).key(45).build();

	// On their own, notes aren't able to do much
	// Add the note to a song layer
	const initializedNote = layer.notes.register(note, 0);

	expect(layer.notes.has(initializedNote.tick)).toBeTrue();

	// An initialized note is a clone of the original note
	note.key = 50;

	expect(note.key).toBe(50);
	expect(initializedNote.key).toBe(45);

	// The effective panning (note and layer panning) can be accessed using `#effectivePanning`
	expect(initializedNote.effectivePanning).toBe(0);

	layer.panning = 50;
	initializedNote.panning = 50;

	expect(initializedNote.effectivePanning).toBe(75);
});

test("Register a note that uses an unregistered custom instrument", () => {
	const song = new Song();
	const layer = song.layers.builder().build();

	const fooIdentifier = new ResourceLocation("custom", "foo");
	const fooInstrument = new InstrumentBuilder().identifier(fooIdentifier).name("Foo").build();

	// When registered with a song, a note's instrument will automatically be added to its registry
	// As with registering instruments, this creates a clone of the original instrument
	const note = new NoteBuilder().instrument(fooInstrument).build();
	const initializedNote = layer.notes.register(note, 0);

	expect(song.instruments.has(fooIdentifier)).toBeTrue();

	fooInstrument.name = "Foobar";

	expect(fooInstrument.name).toBe("Foobar");
	expect(initializedNote.instrument.name).toBe("Foo");

	// The note's instrument will not be initialized more than once
	layer.notes.register(note, 4);

	expect(song.instruments.total).toBe(1);
});

test("Create a note using a song", () => {
	const song = new Song();
	const layer = song.layers.builder().build();

	// Notes can be built and registered directly from `Song#layers`
	// They are automatically added to the song upon being built
	const initializedNote = layer.notes
		.builder()
		.instrument(MinecraftInstruments.HARP)
		.key(45)
		.build();

	expect(initializedNote.key).toBe(45);

	expect(layer.notes.has(initializedNote.tick)).toBeTrue();
	expect(layer.notes.total).toBe(1);
});

test("Utilize initialized notes", () => {
	const song = new Song();
	const layer = song.layers.builder().build();

	// If a layer is locked, all notes contained within will be immutable
	const note = layer.notes.builder().instrument(MinecraftInstruments.HARP).key(45).build();

	layer.status = LayerStatus.Locked;

	expect(() => {
		note.key = 50;
	}).toThrow();

	// New notes cannot be created on immutable layers
	expect(() => {
		layer.notes.builder().instrument(MinecraftInstruments.HARP).key(50).at(3).build();
	}).toThrow();

	// A song's notes are iterable
	// Iteration is in order of tick rather than insertion
	layer.status = LayerStatus.None;

	layer.notes.builder().instrument(MinecraftInstruments.HARP).key(50).at(3).build();
	layer.notes.builder().instrument(MinecraftInstruments.HARP).key(55).at(7).build();

	const expectedTickKeys: Record<LayerNoteTick, NoteKey> = {
		0: 45,
		3: 50,
		7: 55
	};

	for (const [tick, note] of layer.notes) {
		expect(expectedTickKeys).toHaveProperty(tick.toString());

		expect(expectedTickKeys[tick]).toBe(note.key);
	}
});

test("Utilize registered custom instruments with notes", () => {
	const song = new Song();
	const layer = song.layers.builder().build();

	const fooIdentifier = new ResourceLocation("custom", "foo");

	// A note can use a custom instrument from a song's registry
	const initializedFooInstrument = song.instruments
		.builder()
		.identifier(fooIdentifier)
		.name("Foo")
		.build();

	const initializedNote = layer.notes
		.builder()
		.instrument(initializedFooInstrument)
		.key(45)
		.build();

	expect(initializedNote.instrument.name).toBe("Foo");
});

test("Generate a song using random notes", () => {
	const song = new Song();
	const layer = song.layers.builder().build();

	const fooIdentifier = new ResourceLocation("custom", "foo");
	const fooInstrument = song.instruments.builder().identifier(fooIdentifier).name("Foo").build();

	// A song will be built using notes with random keys
	const totalNotes = 50;

	for (let noteIndex = 0; noteIndex < totalNotes; noteIndex++) {
		layer.notes
			.builder()
			.instrument(fooInstrument)
			.key(random(KeyParameter.MIN_VANILLA_KEY, KeyParameter.MAX_VANILLA_KEY))
			.at(noteIndex + 4)
			.build();
	}

	expect(layer.notes.total).toBe(50);

	// Changes to the instrument impact all notes registered with the instrument
	fooInstrument.name = "Foobar";

	let allNamedFoobar = true;

	for (const note of layer.notes.values()) {
		if (note.instrument.name === "Foobar") {
			continue;
		}

		allNamedFoobar = false;

		break;
	}

	expect(allNamedFoobar).toBeTrue();

	// Deleting a registered custom instrument will delete all associated notes
	song.instruments.delete(fooIdentifier);

	expect(layer.notes.total).toBe(0);
});

function random(minimum: number, maximum: number): number {
	return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}
