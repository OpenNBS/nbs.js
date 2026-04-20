import {
	InstrumentBuilder,
	KeyParameter,
	MinecraftInstrument,
	MinecraftInstruments,
	ResourceLocation,
	VersionParameter
} from "@nbsjs/core";

test("Ensure that instrument fields are validated", () => {
	const identifier = new ResourceLocation("custom", "foo");

	const instrument = new InstrumentBuilder().identifier(identifier).build();

	expect(() => {
		instrument.key = KeyParameter.MAX_VALUE + 1;
	}).toThrow();

	expect(() => {
		instrument.key = KeyParameter.MAX_VALUE - 0.5;
	}).toThrow();
});

test("Ensure that Minecraft instrument fields are validated", () => {
	const identifier = new ResourceLocation(MinecraftInstruments.NAMESPACE, "foo");

	const instrument = new MinecraftInstrument(identifier);

	expect(() => {
		instrument.key = KeyParameter.MAX_VALUE + 1;
	}).toThrow();

	expect(() => {
		instrument.key = KeyParameter.MAX_VALUE - 0.5;
	}).toThrow();

	expect(() => {
		instrument.supportedVersion = VersionParameter.MAX_VALUE + 1;
	}).toThrow();
});

test("Ensure that Minecraft instruments are immutable", () => {
	const instrument = MinecraftInstruments.HARP;

	expect(instrument.isImmutable).toBeTrue();

	expect(() => {
		instrument.name = MinecraftInstrument.DEFAULT_NAME;
	}).toThrow();

	expect(() => {
		instrument.soundFile = MinecraftInstrument.DEFAULT_SOUND_FILE;
	}).toThrow();

	expect(() => {
		instrument.key = MinecraftInstrument.DEFAULT_KEY;
	}).toThrow();

	expect(() => {
		instrument.doesPressKey = MinecraftInstrument.DEFAULT_PRESS_KEY;
	}).toThrow();

	expect(() => {
		instrument.supportedVersion = MinecraftInstrument.DEFAULT_SUPPORTED_VERSION;
	}).toThrow();
});
