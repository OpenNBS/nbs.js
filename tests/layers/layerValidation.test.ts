import { Layer, LayerBuilder, PanningParameter, VolumeParameter } from "@nbsjs/core";

test("Ensure that layer fields are validated", () => {
	const layer = new LayerBuilder().build();

	expect(() => {
		layer.panning = PanningParameter.MAX_PANNING + 1;
	}).toThrow();

	expect(() => {
		layer.volume = VolumeParameter.MAX_VOLUME + 1;
	}).toThrow();

	expect(() => {
		layer.status = 4;
	}).toThrow();
});

test("Ensure that locked layers are immutable", () => {
	const layer = new LayerBuilder().lock().build();

	expect(layer.checkMutable().ok).toBeFalse();

	expect(() => {
		layer.name = Layer.DEFAULT_NAME;
	}).toThrow();

	expect(() => {
		layer.panning = Layer.DEFAULT_PANNING;
	}).toThrow();

	expect(() => {
		layer.volume = Layer.DEFAULT_VOLUME;
	}).toThrow();

	expect(() => {
		layer.status = Layer.DEFAULT_STATUS;
	}).not.toThrow();
});
