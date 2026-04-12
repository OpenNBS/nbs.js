/** biome-ignore-all lint/style/noNonNullAssertion: Disabled for brevity */
import { BinaryReader, MinecraftInstruments } from "@nbsjs/core";

test("Add notes to an existing song", async () => {
	const sampleFile = Bun.file("tests/sample/simple.nbs");
	const binaryReader = new BinaryReader(await sampleFile.arrayBuffer());

	const song = binaryReader.toSong();

	const harpLayer = song.layers.at(0)!;

	const plingLayerTop = song.layers.at(4)!;
	const plingLayerMiddle = song.layers.at(5)!;
	const plingLayerBottom = song.layers.at(6)!;

	expect(song.statistics.blocksAdded).toBe(26);

	harpLayer.notes.builder().instrument(MinecraftInstruments.HARP).key(46).at(64).build(false);
	harpLayer.notes.builder().instrument(MinecraftInstruments.HARP).key(45).at(72).build(false);

	expect(song.statistics.blocksAdded).toBe(26);

	plingLayerTop.notes.builder().instrument(MinecraftInstruments.PLING).key(46).at(64).build();
	plingLayerTop.notes.builder().instrument(MinecraftInstruments.PLING).key(45).at(72).build();

	plingLayerMiddle.notes.builder().instrument(MinecraftInstruments.PLING).key(41).at(64).build();
	plingLayerMiddle.notes.builder().instrument(MinecraftInstruments.PLING).key(38).at(72).build();

	plingLayerBottom.notes.builder().instrument(MinecraftInstruments.PLING).key(38).at(64).build();
	plingLayerBottom.notes.builder().instrument(MinecraftInstruments.PLING).key(34).at(72).build();

	expect(song.statistics.blocksAdded).toBe(32);

	expect(harpLayer.notes.at(64)?.instrument).toBe(MinecraftInstruments.HARP);
	expect(plingLayerTop.notes.at(64)?.instrument).toBe(MinecraftInstruments.PLING);
});
