import { BufferWriter } from "../../util/util";
import { Song } from "../Song";

/**
 * Options for {@linkcode toArrayBuffer}.
 */
export interface ToArrayBufferOptions {
	/**
	 * Whether to ignore unpopulated leading layers.
	 */
	"ignoreEmptyLayers"?: boolean;
}

/**
 * Default options for {@linkcode toArrayBuffer}.
 */
export const defaultToArrayBufferOptions: ToArrayBufferOptions = {
	"ignoreEmptyLayers": false
};

/**
 * Generate and return an ArrayBuffer from a song.
 *
 * @param song Song to parse from
 * @return Generated ArrayBuffer
 * Returns an empty ArrayBuffer if an error occurred
 */
export function toArrayBuffer(song: Song, options: ToArrayBufferOptions = defaultToArrayBufferOptions): ArrayBuffer {
	if (options.ignoreEmptyLayers) {
		for (const layer of song.layers) {
			if (Object.keys(layer.notes).length > 0) {
				continue;
			}

			song.deleteLayer(layer);
		}
	}

	// Dry run to get target size
	const size = write(song, 0, true).nextByte;

	// Create the actual buffer
	return write(song, size).buffer;
}

function write(song: Song, size: number, dry = false): BufferWriter {
	const writer = new BufferWriter(new ArrayBuffer(size), dry);

	try {
		if (song.nbsVersion >= 1) {
			writer.writeShort(0); // Write ONBS spec
			writer.writeByte(song.nbsVersion); // Write NBS version
			writer.writeByte(song.instruments.firstCustomIndex); // First custom instrument index
		}

		if (song.nbsVersion === 0 || song.nbsVersion >= 3) {
			writer.writeShort(song.length); // Write song size
		}

		writer.writeShort(song.layers.length); // Write total amount of layers
		writer.writeString(song.meta.name); // Write song name
		writer.writeString(song.meta.author); // Write song author
		writer.writeString(song.meta.originalAuthor); // Write song original author
		writer.writeString(song.meta.description); // Write song description
		writer.writeShort(song.tempo * 100); // Write song tempo
		writer.writeByte(+song.autosave.enabled); // Write song auto-save status
		writer.writeByte(song.autosave.interval); // Write auto-save interval
		writer.writeByte(song.timeSignature); // Write song time signature
		writer.writeInt(Math.floor(song.stats.minutesSpent)); // Write minutes spent in song
		writer.writeInt(song.stats.leftClicks); // Write left-clicks on song
		writer.writeInt(song.stats.rightClicks); // Write right-clicks on song
		writer.writeInt(song.stats.blocksAdded); // Write total blocks added to song
		writer.writeInt(song.stats.blocksRemoved); // Write total blocks removed from song
		writer.writeString(song.meta.importName); // Write imported MiDi/schematic file name

		if (song.nbsVersion >= 4) {
			writer.writeByte(+song.loop.enabled); // Write loop status
			writer.writeByte(song.loop.totalLoops); // Write maximum loop count
			writer.writeByte(song.loop.startTick); // Write loop start tick
		}

		writer.writeByte(0); // Write end of header

		// Iterate each tick
		let currentTick = -1;
		for (let i = 0; i <= song.length; i++) {
			// Ensure the layer has notes at the tick
			let hasNotes = false;
			for (const layer of song.layers) {
				if (layer.notes[i]) {
					hasNotes = true;
					break;
				}
			}

			if (!hasNotes) {
				continue;
			}

			// Get amount of ticks to jump
			const jumpTicks = i - currentTick;
			currentTick = i;

			writer.writeShort(jumpTicks); // Write amount of ticks to jump

			// Iterate each layer
			let currentLayer = -1;
			for (let j = 0; j < song.layers.length; j++) {
				const layer = song.layers[j];
				const note = layer.notes[i];

				if (note) {
					const jumpLayers = j - currentLayer;
					currentLayer = j;

					writer.writeShort(jumpLayers); // Write amount of layers to jump

					writer.writeByte(note.instrument); // Write instrument ID of note
					writer.writeByte(note.key); // Write key of note

					if (song.nbsVersion >= 4) {
						writer.writeByte(note.velocity); // Write velocity of note
						writer.writeUnsignedByte((note.panning ?? 0) + 100); // Write panning of note
						writer.writeShort(note.pitch); // Write pitch of note
					}
				}
			}

			writer.writeShort(0); // Write end of tick
		}

		writer.writeShort(0); // Write end of notes

		for (const layer of song.layers) {
			writer.writeString(layer.meta.name); // Write layer name

			if (song.nbsVersion >= 4) {
				let val = 0;

				// Layer is locked
				if (layer.isLocked) {
					val = 1;
				}

				// Layer is solo
				if (layer.isSolo) {
					val = 2;
				}

				writer.writeByte(val); // Write layer lock status
			}

			writer.writeByte(layer.volume); // Write layer velocity

			if (song.nbsVersion >= 2) {
				writer.writeByte(layer.stereo + 100); // Write layer panning
			}
		}

		writer.writeByte(song.instruments.loaded.length - song.instruments.firstCustomIndex); // Write number of custom instruments
		for (let i = 0; i < song.instruments.loaded.length; i++) {
			const instrument = song.instruments.loaded[i];
			if (!instrument.builtIn) {
				writer.writeString(instrument.meta.name); // Write instrument name
				writer.writeString(instrument.meta.soundFile); // Write instrument filename
				writer.writeByte(instrument.key); // Write instrument key
				writer.writeByte(+(instrument.pressKey ?? 0)); // Write press key status
			}
		}
	} catch (e) {
		song.errors.push(String(e));
	}

	return writer;
}
