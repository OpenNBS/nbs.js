import { MinecraftInstruments } from "@nbsjs/core";

test("Find and validate Minecraft instruments", async () => {
	// The built-in instruments can be accessed via the `MinecraftInstruments` class
	const harpInstrument = MinecraftInstruments.HARP;

	expect(harpInstrument.name).toBe("Harp");

	// Built-in instruments will always use the `minecraft` namespace
	expect(MinecraftInstruments.NAMESPACE).toBe("minecraft");
	expect(harpInstrument.identifier.namespace).toBe("minecraft");

	// However, any custom instrument can use this namespace, too
	// The `#validate` method should be used to check whether an `Instrument` is built-in
	expect(MinecraftInstruments.validate(harpInstrument)).toHaveProperty("ok", true);

	// All built-in instruments from the `MinecraftInstruments` class are immutable
	expect(harpInstrument.isImmutable).toBeTrue();

	expect(() => {
		harpInstrument.name = "Foo";
	}).toThrow();
});

test("Find supported instruments for version", () => {
	// Use the `#getSupportedFor` method to collect the built-in instruments for a version
	const oldInstruments = MinecraftInstruments.getSupportedFor(0);

	expect(oldInstruments.length).toBe(10);
	expect(oldInstruments.includes(MinecraftInstruments.TRUMPET)).toBeFalse();

	const newInstruments = MinecraftInstruments.getSupportedFor(6);

	expect(newInstruments.length).toBe(19);
	expect(newInstruments.includes(MinecraftInstruments.TRUMPET)).toBeTrue();
});

test("Find Minecraft instrument legacy IDs", () => {
	// An instrument can be inferred from its legacy ID using `#fromId`
	const inferredHarpInstrument = MinecraftInstruments.fromId(0);

	expect(inferredHarpInstrument).toEqual(MinecraftInstruments.HARP);

	// This works the other way around as well
	expect(MinecraftInstruments.HARP.toId()).toBe(0);

	// `#fromId` and related methods will throw if the ID doesn't match an existing instrument
	// Use the `#checkId` method to validate without throwing
	const validResult = MinecraftInstruments.checkId(0);
	const invalidResult = MinecraftInstruments.checkId(42);

	expect(validResult.ok).toBeTrue();
	expect(invalidResult.ok).toBeFalse();
});
