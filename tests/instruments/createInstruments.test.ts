import { Instrument, InstrumentBuilder, KeyParameter, ResourceLocation } from "@nbsjs/core";

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

test("Validate instrument parameters", () => {
	const fooIdentifier = new ResourceLocation("custom", "foo");

	// Setting an instrument's key to an invalid value will throw
	expect(() => {
		new InstrumentBuilder().identifier(fooIdentifier).key(88 /* Invalid! */).build();
	}).toThrow();

	// To check a key's validity, use the KeyParameter validataors
	expect(KeyParameter.validate(KeyParameter.MAX_KEY).ok).toBeTrue();
	expect(KeyParameter.validate(KeyParameter.MAX_KEY + 1).ok).toBeFalse();

	expect(() => {
		new InstrumentBuilder().identifier(fooIdentifier).key(87).build();
	}).not.toThrow();
});
