import { LayerBuilder, LayerStatus, Song } from "@nbsjs/core";

test("Register a layer with a song", () => {
	const song = new Song();

	const fooLayer = new LayerBuilder().name("Foo").build();

	// On their own, layers aren't able to do much
	// Add the layer to a song's layer map
	const initializedFooLayer = song.layers.register(fooLayer);

	expect(song.layers.at(0)).toBeDefined();

	// An initialized layer is a clone of the original layer
	fooLayer.name = "Bar";

	expect(fooLayer.name).toBe("Bar");
	expect(initializedFooLayer.name).toBe("Foo");

	// Layers can be registerd at a specified position
	const barLayer = new LayerBuilder().name("Bar").build();
	const initializedBarLayer = song.layers.register(barLayer, 2);

	expect(initializedBarLayer.position).toBe(2);

	expect(song.layers.at(1)).toBeUndefined();
	expect(song.layers.at(2)).toBeDefined();
});

test("Create a layer using a song", () => {
	const song = new Song();

	// Layers can be built and registered directly from a `Song`
	// They are automatically added to the song upon being built
	const initializedFooLayer = song.layers.builder().name("Foo").build();

	expect(initializedFooLayer.position).toBe(0);
	expect(song.layers.at(0)).toBeDefined();

	// Layers can be added to a specified position
	const initializedBarLayer = song.layers.builder().name("Bar").at(2).build();

	expect(initializedBarLayer.position).toBe(2);

	expect(song.layers.at(1)).toBeUndefined();
	expect(song.layers.at(2)).toBeDefined();
});

test("Initialized layer positions", () => {
	const song = new Song();

	const initializedFooLayer = song.layers.builder().name("Foo").build();
	const initializedBarLayer = song.layers.builder().name("Bar").build();
	const initializedBazLayer = song.layers.builder().name("Baz").build();

	// Layers can be moved to different positions
	// The destination position will be replaced
	expect(song.layers.at(4)).toBeUndefined();
	expect(initializedFooLayer.position).toBe(0);

	song.layers.move(initializedFooLayer.position, 4);

	expect(song.layers.at(4)).toBeDefined();
	expect(initializedFooLayer.position).toBe(4);

	song.layers.move(initializedFooLayer.position, 0);

	// Use `#shift` to move a layer to a position without replacing the destination
	// Every layer from the destination position and afterwards will be shifted forwards
	// Every layer after the source position will be shifted backwards
	expect(initializedFooLayer.position).toBe(0);
	expect(initializedBarLayer.position).toBe(1);
	expect(initializedBazLayer.position).toBe(2);

	song.layers.shift(initializedFooLayer.position, initializedBazLayer.position);

	expect(initializedFooLayer.position).toBe(2);
	expect(initializedBarLayer.position).toBe(0);
	expect(initializedBazLayer.position).toBe(1);

	// If any layer between the source and destination positions are immutable, the method will throw
	initializedBarLayer.status = LayerStatus.Locked;

	expect(() => {
		song.layers.shift(initializedBarLayer.position, initializedFooLayer.position);
	}).toThrow();

	expect(() => {
		song.layers.shift(initializedBazLayer.position, initializedFooLayer.position);
	}).not.toThrow();
});

test("Utilize initialized layers", () => {
	const song = new Song();

	const initializedFooLayer = song.layers.builder().name("Foo").build();
	const initializedBarLayer = song.layers.builder().name("Bar").build();
	const initializedBazLayer = song.layers.builder().name("Baz").build();

	expect(initializedFooLayer.position).toBe(0);
	expect(initializedBarLayer.position).toBe(1);
	expect(initializedBazLayer.position).toBe(2);

	// A song's layers are iterable
	// Iteration is in order of position rather than insertion
	song.layers.shift(initializedFooLayer.position, initializedBazLayer.position);

	const expectedPositionNames: string[] = ["Bar", "Baz", "Foo"];

	for (const [position, layer] of song.layers) {
		expect(layer.name).toBe(expectedPositionNames[position]);
	}

	// NOTE: This shifting behavior may be incorrect

	song.layers.shift(initializedFooLayer.position, initializedBarLayer.position);
	song.layers.shift(initializedBarLayer.position, initializedBazLayer.position);

	// Layers can be deleted from the song and do not shift proceeding layers
	song.layers.delete(initializedBarLayer.position);

	expect(song.layers.at(0)).toBeDefined();
	expect(song.layers.at(1)).toBeUndefined();
	expect(song.layers.at(2)).toBeDefined();
});
