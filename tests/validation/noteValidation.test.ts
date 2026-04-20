import {
	LayerStatus,
	MinecraftInstruments,
	Note,
	NoteBuilder,
	PanningParameter,
	PitchParameter,
	Song,
	VolumeParameter
} from "@nbsjs/core";

test("Ensure that note fields are validated", () => {
	const note = new NoteBuilder().instrument(MinecraftInstruments.HARP).build();

	expect(() => {
		note.pitch = PitchParameter.MAX_VALUE + 1;
	}).toThrow();

	expect(() => {
		note.panning = PanningParameter.MAX_VALUE + 1;
	}).toThrow();

	expect(() => {
		note.panning = PanningParameter.MAX_VALUE - 0.5;
	}).toThrow();

	expect(() => {
		note.volume = VolumeParameter.MAX_VALUE + 1;
	}).toThrow();

	expect(() => {
		note.volume = VolumeParameter.MAX_VALUE - 0.5;
	}).toThrow();

	expect(() => {
		// @ts-expect-error
		note.instrument = 0;
	}).toThrow();
});

test("Ensure that notes in locked layers are immutable", () => {
	const song = new Song();
	const layer = song.layers.builder().build();

	const note = layer.notes.builder().instrument(MinecraftInstruments.HARP).build();

	layer.status = LayerStatus.Locked;

	expect(() => {
		note.pitch = Note.DEFAULT_PITCH;
	}).toThrow();

	expect(() => {
		note.panning = Note.DEFAULT_PANNING;
	}).toThrow();

	expect(() => {
		note.volume = Note.DEFAULT_VOLUME;
	}).toThrow();

	expect(() => {
		note.instrument = MinecraftInstruments.HARP;
	}).toThrow();
});
