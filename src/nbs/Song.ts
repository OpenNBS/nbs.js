import { SongInstrument } from "./instrument/SongInstrument";
import { Layer } from "./Layer";
import { defaultNoteOptions, Note, NoteOptions } from "./Note";
import { Instrument } from "./instrument/Instrument";
import { toArrayBuffer } from "./file/toArrayBuffer";

// TODO:
// - Shrink song when removing notes
// - Create field with loop tick (end of measure)

/**
 * Options available for {@linkcode Song} auto-save.
 */
export interface SongAutosaveOptions {
	/**
	 * Whether auto-saving has been enabled.
	 *
	 * @default false
	 */
	"enabled": boolean;

	/**
	 * The amount of minutes between each auto-save.
	 *
	 * @remarks
	 * Range: 1-60
	 *
	 * @default 10
	 */
	"interval": number;
}

/**
 * Options available for {@linkcode Song} looping.
 */
export interface SongLoopOptions {
	/**
	 * Whether looping is enabled.
	 *
	 * @default false
	 */
	"enabled": boolean;

	/**
	 * Determines which part of the song it loops back to.
	 *
	 * @remarks
	 * Unit: Ticks
	 *
	 * @default 0
	 */
	"startTick": number;

	/**
	 * The amount of times the song loops.
	 *
	 * @remarks
	 * 0 = infinite
	 *
	 * @default 0
	 */
	"totalLoops": number;
}

/**
 * Meta information for a {@linkcode Song}.
 */
export interface SongMeta {
	/**
	 * The name of the song.
	 *
	 * @default ""
	 */
	name: string;

	/**
	 * The author of the song.
	 *
	 * @default ""
	 */
	author: string;

	/**
	 * The original author of the song.
	 *
	 * @default ""
	 */
	originalAuthor: string;

	/**
	 * The description of the song.
	 *
	 * @default ""
	 */
	description: string;

	/**
	 * Imported MIDI/Schematic file name.
	 *
	 * @remarks
	 * If the song has been imported from a .mid or .schematic file, that file name is stored here (only the name of the file, not the path).
	 *
	 * @default ""
	 */
	importName: string;
}

/**
 * Statistics available for a {@linkcode Song}.
 *
 * @remarks
 * Note: None of these values automatically increment. Functionality is implementation-dependant.
 */
export interface SongStats {
	/**
	 * Amount of minutes spent on the song.
	 *
	 * @default 0
	 */
	"minutesSpent": number;

	/**
	 * Amount of times the user has left-clicked on the song.
	 *
	 * @default 0
	 */
	"leftClicks": number;

	/**
	 * Amount of times the user has right-clicked on the song.
	 *
	 * @default 0
	 */
	"rightClicks": number;

	/**
	 * Amount of times the user has added a note block.
	 *
	 * @default 0
	 */
	"blocksAdded": number;

	/**
	 * The amount of times the user have removed a note block.
	 *
	 * @default 0
	 */
	"blocksRemoved": number;

	/**
	 * Playtime of the song in milliseconds.
	 *
	 * @remarks
	 * Getter; updates every reference.
	 */
	"duration"?: number;

	/**
	 * The tick of the last measure of the song.
	 *
	 * @remarks
	 * Getter; updates every reference.
	 */
	"lastMeasure"?: number;

	/**
	 * Whether the song has at least one solo layer.
	 *
	 * @remarks
	 * Getter; updates every reference.
	 *
	 * @see {@linkcode Layer.isSolo}
	 */
	"hasSolo"?: boolean;
}

/**
 * Default {@linkcode SongAutosaveOptions} values.
 */
export const defaultAutosaveOptions: SongAutosaveOptions = {
	"enabled": false,
	"interval": 10
};

/**
 * Default {@linkcode SongLoopOptions} values.
 */
export const defaultLoopOptions: SongLoopOptions = {
	"enabled": false,
	"startTick": 0,
	"totalLoops": 0
};

/**
 * Default {@linkcode SongMeta} values.
 */
export const defaultSongMeta: SongMeta = {
	"name": "",
	"author": "",
	"originalAuthor": "",
	"description": "",
	"importName": ""
};

/**
 * Default {@linkcode SongStats} values.
 */
export const defaultSongStats: SongStats = {
	"minutesSpent": 0,
	"leftClicks": 0,
	"rightClicks": 0,
	"blocksAdded": 0,
	"blocksRemoved": 0
};

/**
 * Represents a full NBS song file.
 *
 * @remarks
 * Supports reading, writing, and manipulation.
 *
 * @example
 * ```js
 * const { writeFileSync } = require("node:fs");
 * const { Song, Note, Instrument } = require("@encode42/nbs.js");
 *
 * // Creating the song
 * const song = new Song();
 * song.meta.name = "Triumph";
 * song.meta.author = "encode42";
 * song.tempo = 20;
 *
 * // The following will add 3 layers for 3 instruments, each containing five notes
 * for (let layerCount = 0; layerCount < 3; layerCount++) {
 * 	const instrument = Instrument.builtIn[layerCount];
 *
 * 	// Create a layer for the instrument
 * 	const layer = song.createLayer();
 * 	layer.meta.name = instrument.meta.name;
 *
 * 	const notes = [
 * 		new Note(instrument, { "key": 40 }),
 * 		new Note(instrument, { "key": 45 }),
 * 		new Note(instrument, { "key": 50 }),
 * 		new Note(instrument, { "key": 45 }),
 * 		new Note(instrument, { "key": 57 })
 * 	];
 *
 * 	// Place the notes
 * 	for (let i = 0; i < notes.length; i++) {
 * 		song.setNote(i * 4, layer, notes[i]); // "i * 4" is placeholder - this is the tick to place on
 * 	}
 * }
 *
 * // Write the song to a file
 * writeFileSync("song.nbs", Buffer.from(song.toArrayBuffer()));
 * ```
 */
export class Song {
	/**
	 * Length of the song in ticks.
	 */
	public length = 0;

	/**
	 * Version of NBS the song has been saved to.
	 *
	 * @see https://opennbs.org/nbs
	 */
	public nbsVersion = 5;

	/**
	 * Meta information for the song.
	 *
	 * @see {@linkcode SongMeta}
	 */
	public meta = { ...defaultSongMeta };

	/**
	 * Looping options for the song.
	 *
	 * @see {@linkcode SongLoopOptions}
	 */
	public loop = { ...defaultLoopOptions };

	/**
	 * Auto-save options for the song.
	 *
	 * @see {@linkcode SongAutosaveOptions}
	 */
	public autosave = { ...defaultAutosaveOptions };

	/**
	 * Statistics for the song.
	 *
	 * @see {@linkcode SongStats}
	 */
	public stats = { ...defaultSongStats };

	/**
	 * Tempo of the song.
	 *
	 * @remarks
	 * Unit: TPS (Ticks Per Second)
	 */
	public tempo = 10;

	/**
	 * Time signature of the song.
	 *
	 * @remarks
	 * If this is 3, then the signature is 3/4. This value ranges from 2-8.
	 */
	public timeSignature = 4;

	/**
	 * Amount of milliseconds each tick takes.
	 *
	 * @remarks
	 * Getter; updates every reference.
	 */
	public get timePerTick(): number {
		return (20 / this.tempo) * 50;
	}

	/**
	 * Instruments of the song.
	 *
	 * @see {@linkcode SongInstrument}
	 */
	public instruments = new SongInstrument();

	/**
	 * Layers within the song.
	 *
	 * @see {@linkcode Layer}
	 */
	public layers: Layer[] = [];

	/**
	 * The `ArrayBuffer` used to load the song.
	 */
	public arrayBuffer: ArrayBuffer | undefined = undefined;

	/**
	 * Errors occurred while loading, manipulating, or saving the nbs file.
	 *
	 * @remarks
	 * Returns an empty array if no errors occurred.
	 */
	public errors: string[] = [];

	constructor() {
		Object.defineProperties(this.stats, {
			"hasSolo": {
				"get": () => {
					let found = false;

					// Iterate each layer
					for (const layer of this.layers) {
						// Solo layer found
						if (layer.isSolo) {
							found = true;
							break;
						}
					}

					return found;
				}
			},
			"duration": {
				"get": () => {
					return this.length * this.timePerTick;
				}
			},
			"lastMeasure": {
				"get": () => {
					return Math.ceil(this.length / this.timeSignature) * this.timeSignature;
				}
			}
		});
	}

	/**
	 * Create and add a new blank {@linkcode Layer} to the song.
	 */
	public createLayer(): Layer {
		const layer = new Layer(this.layers.length + 1);
		this.layers.push(layer);
		return layer;
	}

	/**
	 * Set the note at a tick.
	 *
	 * @param tick Tick to set the note
	 * @param layer Layer to set the note on
	 * @param note Note to set
	 */
	public setNote(tick: number, layer: Layer, note: Note): void {
		this.expand(tick);

		layer.setNote(tick, note);
	}

	/**
	 * Create and add a note to a tick.
	 *
	 * @param layer Layer to add the note to
	 * @param tick Tick to set the note
	 * @param instrument The note's instrument
	 * @param options Options for the note
	 */
	public addNote(layer: Layer, tick: number, instrument: Instrument | number = 0, options: NoteOptions = defaultNoteOptions): Note {
		this.expand(tick);

		// Construct the note
		return layer.addNote(tick, instrument, options);
	}

	/**
	 * Delete a {@linkcode Layer} from the song.
	 *
	 * @param layer Layer to delete.
	 */
	public deleteLayer(layer: Layer): void {
		this.layers.splice(this.layers.indexOf(layer), 1);
	}

	/**
	 * Expand the song if required.
	 *
	 * @param tick Tick that is being added
	 */
	private expand(tick: number): void {
		// Expand the song if required
		if (tick + 1 > this.length) {
			this.length = tick + 1;
		}
	}

	/**
	 * Generate and return an ArrayBuffer from this song.
	 *
	 * @return Generated ArrayBuffer
	 * Returns an empty ArrayBuffer if an error occurred
	 */
	public toArrayBuffer(): ArrayBuffer {
		return toArrayBuffer(this);
	}
}
