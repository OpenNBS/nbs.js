import { BufferWriter } from "~/buffer/writer";
import type { Song } from "~/nbs/Song";
import { omitEmptyLayers } from "~/util/omitEmptyLayers";

/**
 * Options for {@linkcode toArrayBuffer}.
 *
 * @category Array Buffer
 * @internal
 */
export interface ToArrayBufferOptions {
	/**
	 * Whether to ignore unpopulated leading layers.
	 */
	"ignoreEmptyLayers"?: boolean;
}

/**
 * Default options for {@linkcode toArrayBuffer}.
 *
 * @category Array Buffer
 * @internal
 */
export const defaultToArrayBufferOptions: ToArrayBufferOptions = {
	"ignoreEmptyLayers": false
};

/**
 * Generate an {@linkcode ArrayBuffer} from a {@linkcode Song}.
 *
 * @param song Song to parse from
 * @param options Optional arguments that impact export behavior
 * @return Generated array buffer, empty if unsuccessful
 * @includeExample ./examples/simple/write.ts
 * @category Highlights
 * @category Array Buffer
 */
export function toArrayBuffer(song: Song, options: ToArrayBufferOptions = defaultToArrayBufferOptions): ArrayBuffer {
	let workingClass = song;

	if (options.ignoreEmptyLayers) {
		workingClass = omitEmptyLayers(song);
	}

	// Dry run to get target size
	const size = write(workingClass, 0, true).nextByte;

	// Create the actual buffer
	return write(workingClass, size).buffer;
}

/**
 * {@inheritDoc toArrayBuffer}
 * @param song The song that is being exported
 * @param size Size of the array buffer
 * @param dry Whether to execute a dry run
 * @category Array Buffer
 */
function write(song: Song, size: number, dry = false): BufferWriter {
	const writer = new BufferWriter(new ArrayBuffer(size), dry);

	if (song.nbsVersion >= 1) {
		writer.writeShort(0); // Write ONBS spec
		writer.writeByte(song.nbsVersion); // Write NBS version
		writer.writeByte(song.instruments.firstCustomIndex); // First custom instrument index
	}

	if (song.nbsVersion === 0 || song.nbsVersion >= 3) {
		writer.writeShort(song.length); // Write song size
	}

	writer.writeShort(song.layers.total); // Write total amount of layers
	writer.writeString(song.name ?? ""); // Write song name
	writer.writeString(song.author ?? ""); // Write song author
	writer.writeString(song.originalAuthor ?? ""); // Write song original author
	writer.writeString(song.description ?? ""); // Write song description
	writer.writeShort(song.tempo * 100); // Write song tempo
	writer.writeByte(+song.autoSave.enabled); // Write song auto-save status
	writer.writeByte(song.autoSave.interval); // Write auto-save interval
	writer.writeByte(song.timeSignature); // Write song time signature
	writer.writeInt(Math.floor(song.minutesSpent)); // Write minutes spent in song
	writer.writeInt(song.leftClicks); // Write left-clicks on song
	writer.writeInt(song.rightClicks); // Write right-clicks on song
	writer.writeInt(song.blocksAdded); // Write total blocks added to song
	writer.writeInt(song.blocksRemoved); // Write total blocks removed from song
	writer.writeString(song.importName ?? ""); // Write imported MiDi/schematic file name

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
		for (const layer of song.layers.get) {
			if (layer.notes.get[i]) {
				hasNotes = true;
				break;
			}
		}

		if (!hasNotes) {
			continue;
		}

		const jumpTicks = i - currentTick;
		currentTick = i;

		writer.writeShort(jumpTicks); // Write amount of ticks to jump

		let currentLayer = -1;
		for (let j = 0; j < song.layers.total; j++) {
			const layer = song.layers.get[j];
			const note = layer.notes.get[i];

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

	for (const layer of song.layers.get) {
		writer.writeString(layer.name ?? ""); // Write layer name

		if (song.nbsVersion >= 4) {
			let lock = 0;

			if (layer.isLocked) {
				lock = 1;
			}

			if (layer.isSolo) {
				lock = 2;
			}

			writer.writeByte(lock); // Write layer lock status
		}

		writer.writeByte(layer.volume); // Write layer velocity

		if (song.nbsVersion >= 2) {
			writer.writeByte(layer.stereo + 100); // Write layer panning
		}
	}

	const totalInstruments = Object.keys(song.instruments.get).length;

	writer.writeByte(totalInstruments - song.instruments.firstCustomIndex); // Write number of custom instruments
	for (let i = 0; i < totalInstruments; i++) {
		const instrument = song.instruments.get[i];
		if (!instrument.isBuiltIn) {
			writer.writeString(instrument.name ?? ""); // Write instrument name
			writer.writeString(instrument.soundFile); // Write instrument filename
			writer.writeByte(instrument.key); // Write instrument key
			writer.writeByte(+(instrument.pressKey ?? 0)); // Write press key status
		}
	}

	return writer;
}
