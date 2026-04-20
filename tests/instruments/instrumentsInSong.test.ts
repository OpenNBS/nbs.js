import { Instrument, InstrumentBuilder, ResourceLocation, Song } from "@nbsjs/core";

test("Register a custom instrument with a song", () => {
	const song = new Song();

	const fooIdentifier = new ResourceLocation("custom", "foo");
	const fooInstrument = new InstrumentBuilder().identifier(fooIdentifier).name("Foo").build();

	// On their own, instruments aren't able to do much
	// Add the instrument to a song's registry for easy reference!
	const initializedFooInstrument = song.instruments.register(fooInstrument);

	expect(song.instruments.has(initializedFooInstrument.identifier)).toBeTrue();

	// An initialized instrument is a clone of the original instrument
	fooInstrument.name = "Bar";

	expect(fooInstrument.name).toBe("Bar");
	expect(initializedFooInstrument.name).toBe("Foo");

	// Modifying an instrument's parameters updates within the registry
	initializedFooInstrument.name = "Bar";

	expect(song.instruments.get(initializedFooInstrument.identifier)?.name).toBe("Bar");
});

test("Create a custom instrument using a song", () => {
	const song = new Song();

	const fooIdentifier = new ResourceLocation("custom", "foo");

	// Instruments can be built and registered directly from a `Song`
	// They are automatically added to the registry upon being built
	const initializedFooInstrument = song.instruments
		.builder()
		.identifier(fooIdentifier)
		.name("Foo")
		.build();

	expect(initializedFooInstrument.name).toBe("Foo");

	expect(song.instruments.has(fooIdentifier)).toBeTrue();
	expect(song.instruments.total).toBe(1);
});

test("Utilize initialized instruments", () => {
	const song = new Song();

	const fooIdentifier = new ResourceLocation("custom", "foo");
	const barIdentifier = new ResourceLocation("custom", "bar");

	const initializedFooInstrument = song.instruments
		.builder()
		.identifier(fooIdentifier)
		.name("Foo")
		.build();

	const initializedBarInstrument = song.instruments
		.builder()
		.identifier(barIdentifier)
		.name("Bar")
		.build();

	// The instrument registry doesn't use IDs for flexibility with built-in Minecraft instruments
	// However, their ID can still be inferred for use with `MinecraftInstruments#getSupportedFor`
	expect(initializedFooInstrument.toId()).toBe(0);
	expect(initializedBarInstrument.toId()).toBe(1);

	// A song's instruments are iterable
	for (const [identifier, instrument] of song.instruments) {
		expect(instrument.key).toBe(Instrument.DEFAULT_KEY);

		// Instruments can be deleted from the song after being registered
		song.instruments.delete(identifier);
	}

	expect(song.instruments.has(fooIdentifier)).toBeFalse();
	expect(song.instruments.total).toBe(0);
});
