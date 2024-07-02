import { SongInstruments } from "~/nbs/instrument/SongInstruments";
import { SongLayers } from "~/nbs/layer/SongLayers";

// TODO: Create field with loop tick (end of measure)

/**
 * Options available for {@linkcode Song#autoSave}.
 *
 * @remarks
 * These properties are not used within `nbs.js` for anything other than storage.
 *
 * They only exist as data fields to work with other applications that implement functionality.
 * @category Song
 */
export interface SongAutoSave {
	/**
	 * Whether auto-saving has been enabled.
	 */
	"enabled": boolean;

	/**
	 * Number of minutes between each auto-save.
	 *
	 * @remarks Ranges from 1 to 60.
	 */
	"interval": number;
}

/**
 * Options available for {@linkcode Song#loop}.
 *
 * @remarks
 * These properties are not used within `nbs.js` for anything other than storage.
 *
 * They only exist as data fields to work with other applications that implement functionality.
 * @category Song
 */
export interface SongLoop {
	/**
	 * Whether looping is enabled.
	 */
	"enabled": boolean;

	/**
	 * Where the song should loop back to.
	 *
	 * @remarks Unit is ticks.
	 */
	"startTick": number;

	/**
	 * Number of times the song should loop.
	 *
	 * @remarks `0` designates infinite.
	 */
	"totalLoops": number;
}

/**
 * Default {@linkcode Song#autoSave} values.
 *
 * @category Song
 * @internal
 */
export const defaultAutoSave: SongAutoSave = {
	"enabled": false,
	"interval": 10
};

/**
 * Default {@linkcode Song#loop} values.
 *
 * @category Song
 * @internal
 */
export const defaultLoop: SongLoop = {
	"enabled": false,
	"startTick": 0,
	"totalLoops": 0
};

/**
 * Represents a {@link https://opennbs.org/nbs | note block song} with helper methods.
 *
 * @includeExample ./examples/simple/newSong.ts
 * @category Highlights
 * @category Song
 */
export class Song {
	/**
	 * {@inheritDoc Song#getTempo}
	 */
	#tempo = 10;

	/**
	 * {@inheritDoc Song#getTimePerTick}
	 */
	#timePerTick = 100;

	/**
	 * Length of the song in ticks.
	 */
	public getLength(): number {
		// TODO: use on-demand setter rather than calculation
		let farthestTick = 0;

		for (const layer of this.layers.all) {
			const lastNote = +Object.keys(layer.notes.all).at(-1);

			if (lastNote > farthestTick) {
				farthestTick = lastNote;
			}
		}

		return farthestTick;
	}

	/**
	 * Version of NBS the song has been made with.
	 *
	 * @remarks Currently, this does not affect the exported song structure properly, and should always be upgraded to `5`.
	 * @see https://opennbs.org/nbs
	 */
	public version = 5;

	/**
	 * Name of the song.
	 */
	public name?: string;

	/**
	 * Author of the song.
	 */
	public author?: string;

	/**
	 * Original author of the song.
	 */
	public originalAuthor?: string;

	/**
	 * Description of the song.
	 */
	public description?: string;

	/**
	 * Imported MIDI/Schematic file name.
	 */
	public importName?: string;

	/**
	 * Looping options for the song.
	 *
	 * @see {@linkcode SongLoop}
	 */
	public readonly loop: SongLoop = { ...defaultLoop };

	/**
	 * Auto-save options for the song.
	 *
	 * @see {@linkcode SongAutoSave}
	 */
	public readonly autoSave: SongAutoSave = { ...defaultAutoSave };

	/**
	 * Number of minutes spent on the song.
	 *
	 * @remarks This value **is not** updated by `nbs.js`!
	 */
	public minutesSpent = 0;

	/**
	 * Number of times the user has left-clicked on the song.
	 *
	 * @remarks This value **does not** update when methods such as {@linkcode LayerNotes#add} is used!
	 */
	public leftClicks = 0;

	/**
	 * Number of times the user has right-clicked on the song.
	 *
	 * @remarks This value **does not** update when methods such as {@linkcode LayerNotes#delete} is used!
	 */
	public rightClicks = 0;

	/**
	 * Number of times the user has added a note block.
	 *
	 * @remarks This value **does not** update when methods such as {@linkcode LayerNotes#add} is used!
	 */
	public blocksAdded = 0;

	/**
	 * Number of times the user have removed a note block.
	 *
	 * @remarks This value **does not** update when methods such as {@linkcode LayerNotes#delete} is used!
	 */
	public blocksRemoved = 0;

	/**
	 * Playtime of the song in milliseconds.
	 *
	 * @remarks This currently **does not** support Note Block Studio's *unofficial* tempo changer layer.
	 */
	public getDuration(): number {
		return this.getLength() * this.#timePerTick;
	}

	/**
	 * Tick of the last measure of the song.
	 */
	public getLastMeasure(): number {
		return Math.ceil(this.getLength() / this.timeSignature) * this.timeSignature;
	}

	/**
	 * Time signature of the song.
	 *
	 * @remarks From 2 to 8.
	 * @example If this is 3, then the signature is 3/4.
	 */
	public timeSignature = 4;

	/**
	 * Tempo of the song in ticks per second.
	 */
	public getTempo(): number {
		return this.#tempo;
	}

	/**
	 * Sets the song's tempo in ticks per second.
	 *
	 * @remarks Adjusts the {@link Song#getTimePerTick | time per tick} upon modification.
	 */
	public setTempo(ticksPerSecond: number): void {
		this.#tempo = ticksPerSecond;
		this.#timePerTick = (20 / ticksPerSecond) * 50;
	}

	/**
	 * Amount of milliseconds each tick takes.
	 */
	public getTimePerTick(): number {
		return this.#timePerTick;
	}

	/**
	 * Sets the song's amount of milliseconds per tick.
	 *
	 * @remarks Adjusts the {@link Song#getTempo | tempo} upon modification.
	 */
	public setTimePerTick(milliseconds: number): void {
		this.#timePerTick = milliseconds;
		this.#tempo = (50 / milliseconds) * 20;
	}

	/**
	 * Whether the song has at least one solo layer.
	 *
	 * @see {@linkcode Layer.isSolo}
	 */
	public hasSolo(): boolean {
		let found = false;

		for (const layer of this.layers.all) {
			if (layer.isSolo) {
				found = true;
				break;
			}
		}

		return found;
	}

	/**
	 * Instruments of the song.
	 */
	public readonly instruments = new SongInstruments();

	/**
	 * Layers within the song.
	 */
	public readonly layers = new SongLayers();
}
