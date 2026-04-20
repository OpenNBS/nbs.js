import { Header, Song } from "@nbsjs/core";

test("Create a header", () => {
	// Headers are limited forms of a song
	// They only contain the information stored within the NBS specification's header
	const header = new Header();

	// A header does nothing on its own
	// Typically, headers would only be used when partially reading a binary file
	expect(header.name).toBeUndefined();
	expect(header.description).toBeUndefined();

	// They don't contain any instruments, layers, or notes
	expect(header.layers.total).toBe(0);

	// Instruments, layers, and notes cannot be created with headers
	expect(() => {
		// @ts-expect-error
		header.layers.builder();
	}).toThrowError();

	// Songs can be created from headers
	// The created song will loose header size and total layers as they're calculated values
	header.size = 42;
	header.name = "Foo";
	header.layers.total = 10;

	const song = Song.fromHeader(header);

	expect(song.size).toBe(0);
	expect(song.name).toBe("Foo");
	expect(song.layers.total).toBe(0);

	// The same can be done vice-versa
	const secondHeader = Header.fromSong(song);

	expect(secondHeader.size).toBe(0);
	expect(secondHeader.name).toBe("Foo");
	expect(secondHeader.layers.total).toBe(0);
});
