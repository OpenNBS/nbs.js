import { Instrument, InstrumentBuilder, ResourceLocation } from "@nbsjs/core";

test("Create a custom instrument", () => {
	const fooIdentifier = new ResourceLocation("custom", "foo");

	// The `InstrumentBuilder` class creates a new instrument with validation
	const fooInstrument = new InstrumentBuilder()
		.identifier(fooIdentifier)
		.name("Foo")
		.pressKey()
		.build();

	expect(fooInstrument.identifier).toEqual(fooIdentifier);

	expect(fooInstrument.name).toBe("Foo");
	expect(fooInstrument.doesPressKey).toBeTrue();

	// Alternatively, the `Instrument` class can be instantiated directly
	const barIdentifier = new ResourceLocation("custom", "bar");

	const barInstrument = new Instrument(barIdentifier);

	barInstrument.name = "Bar";
	barInstrument.doesPressKey = true;

	expect(barInstrument.identifier).toEqual(barIdentifier);

	expect(barInstrument.name).toBe("Bar");
	expect(barInstrument.doesPressKey).toBeTrue();
});
