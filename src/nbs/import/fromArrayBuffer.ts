import { BufferReader } from "~/buffer/reader";
import { Instrument } from "~/nbs/instrument/Instrument";
import { Song } from "~/nbs/Song";
import { omitEmptyLayers } from "~/util/omitEmptyLayers";

/**
 * Raw structure of a note.
 *
 * @category Array Buffer
 */
interface RawNote {
	/**
	 * Instrument of the note.
	 */
	"instrument": number;

	/**
	 * Key of the note.
	 */
	"key": number;

	/**
	 * Panning of the note.
	 */
	"panning": number;

	/**
	 * Velocity of the note.
	 */
	"velocity": number;

	/**
	 * Pitch of the note.
	 */
	"pitch": number;

	/**
	 * Layer ID of the note.
	 */
	"layer": number;

	/**
	 * Tick the note is placed on.
	 */
	"tick": number;
}

/**
 * Options for {@linkcode fromArrayBuffer}.
 *
 * @category Array Buffer
 * @internal
 */
export interface FromArrayBufferOptions {
	/**
	 * Whether to ignore (delete) unpopulated leading layers.
	 *
	 * @remarks Open Note Block Studio automatically generates extra layers past the last populated layer.
	 */
	"ignoreEmptyLayers"?: boolean;
}

/**
 * Default options for {@linkcode fromArrayBuffer}.
 *
 * @category Array Buffer
 * @internal
 */
export const defaultFromArrayBufferOptions: FromArrayBufferOptions = {
	"ignoreEmptyLayers": false
};

/**
 * Parse and return a {@linkcode Song} from a file array buffer.
 *
 * @param arrayBuffer Array buffer to parse from
 * @param options Options for parsing
 * @return Parsed song, empty if unsuccessful
 * @includeExample ./examples/simple/read.ts
 * @category Highlights
 * @category Song
 * @category Array Buffer
 */
export function fromArrayBuffer(arrayBuffer: ArrayBufferLike, options = defaultFromArrayBufferOptions): Song {
	const song = new Song();
	const reader = new BufferReader(arrayBuffer);

	let size = reader.readShort(); // Read song size

	// Check if NBS file is ONBS versioned
	if (size === 0) {
		song.version = reader.readByte(); // Read NBS version
		reader.readByte(); // Read first custom instrument

		if (song.version >= 3) {
			size = reader.readShort(); // Read real song size
		}
	} else {
		song.version = 0;
	}

	if (song.version > 5) {
		throw new Error("This library does not support Note Block Songs created with versions greater than 5.");
	}

	const totalLayers = reader.readShort(); // Read total amount of layers
	song.name = reader.readString(); // Read song name
	song.author = reader.readString(); // Read song author
	song.originalAuthor = reader.readString(); // Read song original author
	song.description = reader.readString(); // Read song description
	song.setTempo(reader.readShort() / 100); // Read song tempo
	song.autoSave.enabled = Boolean(reader.readByte()); // Read song auto-save status
	song.autoSave.interval = reader.readByte(); // Read song auto-save interval
	song.timeSignature = reader.readByte(); // Read song time signature
	song.minutesSpent = reader.readInt(); // Read minutes spent in song
	song.leftClicks = reader.readInt(); // Read left-clicks on song
	song.rightClicks = reader.readInt(); // Read right-clicks on song
	song.blocksAdded = reader.readInt(); // Read total blocks added to song
	song.blocksRemoved = reader.readInt(); // Read total blocks removed from song
	song.importName = reader.readString(); // Read imported MiDi/schematic file name

	for (const key of ["name", "author", "originalAuthor", "description", "importName"]) {
		if (song[key] !== "") {
			continue;
		}

		song[key] = undefined;
	}

	if (song.version >= 4) {
		song.loop.enabled = Boolean(reader.readByte()); // Read loop status
		song.loop.totalLoops = reader.readByte(); // Read maximum loop count
		song.loop.startTick = reader.readShort(); // Read loop start tick
	}

	// Read layer and note data
	const rawNotes: RawNote[] = [];
	let tick = -1;
	while (true) {
		// Jump to the next tick
		const jumpTicks = reader.readShort(); // Read amount of ticks to jump
		if (jumpTicks === 0) {
			break;
		}

		tick += jumpTicks;

		let layer = -1;
		while (true) {
			// Jump to the next layer
			const jumpLayers = reader.readShort(); // Read amount of layers to jump
			if (jumpLayers === 0) {
				break;
			}

			layer += jumpLayers;

			// Get note at tick
			const instrument = reader.readByte(); // Read instrument of note
			const key = reader.readByte(); // Read key of note
			let velocity = 100;
			let panning = 0;
			let pitch = 0;
			if (song.version >= 4) {
				velocity = reader.readByte(); // Read velocity of note
				panning = reader.readUnsignedByte() - 100; // Read panning of note
				pitch = reader.readShort(); // Read pitch of note
			}

			// Push the note data to raw notes array
			rawNotes.push({
				"instrument": instrument,
				"key": key,
				"velocity": velocity,
				"panning": panning,
				"pitch": pitch,
				"layer": layer,
				"tick": tick
			});
		}
	}

	// Guess song size for ONBS versions without size byte
	if (song.version > 0 && song.version < 3) {
		size = tick;
	}

	// Add layers to song
	if (arrayBuffer.byteLength > reader.nextByte) {
		for (let i = 0; i < totalLayers; i++) {
			const layer = song.layers.create();

			const name = reader.readString(); // Read layer name
			layer.name = name === "" ? undefined : name;

			if (song.version >= 4) {
				const lock = reader.readByte(); // Read layer lock status

				if (lock === 1) {
					layer.isLocked = true;
				}

				if (lock === 2) {
					layer.isSolo = true;
				}
			}

			layer.volume = reader.readByte(); // Read layer velocity

			let panning = 0;
			if (song.version >= 2) {
				panning = reader.readUnsignedByte() - 100; // Read layer panning
			}

			layer.stereo = panning;
		}
	}

	// Parse custom instruments
	const customInstruments = reader.readByte(); // Read number of custom instruments
	for (let i = 0; i < customInstruments; i++) {
		const name = reader.readString(); // Read instrument name

		song.instruments.set(
			song.instruments.firstCustomIndex + i,
			new Instrument({
				"name": name === "" ? undefined : name,
				"soundFile": reader.readString(), // Read instrument file
				"key": reader.readByte(), // Read instrument pitch
				"pressKey": Boolean(reader.readByte()) // Read press key status
			})
		);
	}

	// Parse notes
	for (const rawNote of rawNotes) {
		let layer = song.layers.all[rawNote.layer];
		if (!layer) {
			layer = song.layers.create();
		}

		layer.notes.create(rawNote.tick, rawNote.instrument, {
			"key": rawNote.key,
			"panning": rawNote.panning,
			"pitch": rawNote.pitch,
			"velocity": rawNote.velocity
		});
	}

	return options.ignoreEmptyLayers ? omitEmptyLayers(song, false) : song;
}
