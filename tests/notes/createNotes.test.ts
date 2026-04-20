import {
	Instrument,
	InstrumentBuilder,
	KeyParameter,
	MinecraftInstrument,
	MinecraftInstruments,
	NoteBuilder,
	ResourceLocation
} from "@nbsjs/core";

test("Create a note", () => {
	// The `NoteBuilder` class creates a new note with validation
	const note = new NoteBuilder().instrument(MinecraftInstruments.HARP).key(45).build();

	expect(note.key).toBe(45);
	expect(note.instrument).toEqual(MinecraftInstruments.HARP);

	// The effective pitch (note and instrument key) can be accessed using `#effectivePitch`
	expect(note.effectivePitch).toBe(45);
});

test("Utilize custom instruments with notes", () => {
	const fooIdentifier = new ResourceLocation("custom", "foo");
	const fooInstrument = new InstrumentBuilder().identifier(fooIdentifier).name("Foo").build();

	// A note's insrument can be any `Instrument` or `MinecraftInstrument`
	const vanillaNote = new NoteBuilder().instrument(MinecraftInstruments.HARP).build();
	const customNote = new NoteBuilder().instrument(fooInstrument).build();

	expect(vanillaNote.instrument).toBeInstanceOf(MinecraftInstrument);
	expect(customNote.instrument).toBeInstanceOf(Instrument);

	// Note instruments are references to their original instrument instance
	fooInstrument.name = "Foobar";

	expect(customNote.instrument.name).toBe("Foobar");

	// Instruments can be modified from the notes they're associated with
	// Note that this will impact all notes that use the instrument
	customNote.instrument.name = "Foo";

	expect(customNote.instrument.name).toBe("Foo");
});

test("Check whether a note is vanilla-compatible", () => {
	const note = new NoteBuilder().instrument(MinecraftInstruments.HARP).build();

	// A note is vanilla-compatible when it can exist using Minecraft's note blocks
	// This can be due to the note's key exceeding Minecraft's two octave limit
	note.key = KeyParameter.MAX_VANILLA_KEY + 1;

	expect(note.isVanillaCompatible().ok).toBeFalse();

	note.key = KeyParameter.MAX_VANILLA_KEY;

	expect(note.isVanillaCompatible().ok).toBeTrue();

	// It can also be due to the usage of custom instruments
	const fooInstrument = new InstrumentBuilder()
		.identifier(ResourceLocation.of("custom", "foo"))
		.build();

	note.instrument = fooInstrument;

	expect(note.isVanillaCompatible().ok).toBeFalse();

	note.instrument = MinecraftInstruments.HARP;

	expect(note.isVanillaCompatible().ok).toBeTrue();

	// It can also be due to fine pitch adjustment
	note.pitch = 0.5;

	expect(note.isVanillaCompatible().ok).toBeFalse();

	note.pitch = 0;

	expect(note.isVanillaCompatible().ok).toBeTrue();
});
