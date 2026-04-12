/** biome-ignore-all assist/source/useSortedKeys: <explanation> */
import { BinaryWriter, InstrumentBehavior, LayerBehavior } from "./formats/binary/BinaryWriter";
import { MinecraftInstruments } from "./instruments/MinecraftInstruments";
import { Song } from "./songs/Song";

const song: Song = new Song();

new BinaryWriter(song, {
	"version": 1,

	"transformers": {
		"instruments": {
			"behavior": InstrumentBehavior.Fallback,
			"to": MinecraftInstruments.HARP
		},

		"layers": {
			"behavior": LayerBehavior.SkipTrailing
		}
	}
});
