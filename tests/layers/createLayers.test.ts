import { LayerBuilder, LayerStatus, PanningParameter, VolumeParameter } from "@nbsjs/core";

test("Create a layer", () => {
	// The `LayerBuilder` class creates a new layer with validation
	const fooLayer = new LayerBuilder().name("Foo").build();

	expect(fooLayer.name).toBe("Foo");

	// Layers can be made immutable by setting their lock status
	// Immutable layers will be skipped during song-wide operations
	fooLayer.status = LayerStatus.Locked;

	expect(() => {
		fooLayer.name = "Bar";
	}).toThrow();

	// To check a layer's mutable status, use the `#checkMutable` method
	expect(fooLayer.checkMutable().ok).toBeFalse();

	// Immutable layers can be made mutable by clearing their lock status
	fooLayer.status = LayerStatus.None;
	fooLayer.name = "Bar";

	expect(fooLayer.name).toBe("Bar");

	// Layers can be created as locked
	const barLayer = new LayerBuilder().lock().name("Bar").build();

	expect(barLayer.name).toBe("Bar");
	expect(barLayer.checkMutable().ok).toBeFalse();

	// A layer cannot be created as both locked and soloed
	expect(() => {
		new LayerBuilder().name("Baz").lock().solo().build();
	}).toThrow();
});

test("Validate layer parameters", () => {
	const fooLayer = new LayerBuilder().name("Foo").build();

	// Setting a layer's parameters to invalid values will throw
	expect(() => {
		fooLayer.volume = 200;
	}).toThrow();

	// To check a parameter's validity, use their relevant `Parameter` classes
	expect(VolumeParameter.validate(VolumeParameter.MAX_VOLUME).ok).toBeTrue();
	expect(VolumeParameter.validate(VolumeParameter.MAX_VOLUME + 1).ok).toBeFalse();

	expect(PanningParameter.validate(PanningParameter.MAX_PANNING).ok).toBeTrue();
	expect(PanningParameter.validate(PanningParameter.MAX_PANNING + 1).ok).toBeFalse();

	expect(() => {
		fooLayer.volume = 100;
	}).not.toThrow();
});
