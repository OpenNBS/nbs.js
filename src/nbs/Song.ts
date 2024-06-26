import { enumerable } from "~/decorators/enumerable";
import { readOnly } from "~/decorators/readOnly";
import { SongInstruments } from "~/nbs/instrument/SongInstruments";
import { SongLayers } from "~/nbs/layer/SongLayers";

// TODO: Create field with loop tick (end of measure)

/**
 * Options available for {@linkcode Song#autoSave}.
 *
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
 * Represents a full {@link https://opennbs.org/nbs | NBS song}.
 *
 * @includeExample ./examples/simple/newSong.ts
 * @category Highlights
 * @category Song
 */
export class Song {
	/**
	 * {@inheritDoc Song#loop}
	 */
	#loop: SongLoop = { ...defaultLoop };

	/**
	 * {@inheritDoc Song#autoSave}
	 */
	#autoSave: SongAutoSave = { ...defaultAutoSave };

	/**
	 * {@inheritDoc Song#tempo}
	 */
	#tempo = 10;

	/**
	 * {@inheritDoc Song#timePerTick}
	 */
	#timePerTick = 100;

	/**
	 * {@inheritDoc Song#layers}
	 */
	#layers = new SongLayers();

	/**
	 * {@inheritDoc Song#instruments}
	 */
	#instruments = new SongInstruments();

	/**
	 * Length of the song in ticks.
	 */
	@enumerable
	@readOnly
	public get length(): number {
		let farthestTick = 0;

		for (const layer of this.#layers.get) {
			const lastNote = +Object.keys(layer.notes.get).at(-1);

			if (lastNote > farthestTick) {
				farthestTick = lastNote;
			}
		}

		return farthestTick;
	}

	/**
	 * Version of NBS the song has been saved to.
	 *
	 * @see https://opennbs.org/nbs
	 */
	public nbsVersion = 5;

	/**
	 * Name of the song.
	 */
	public name: string;

	/**
	 * Author of the song.
	 */
	public author: string;

	/**
	 * Original author of the song.
	 */
	public originalAuthor: string;

	/**
	 * Description of the song.
	 */
	public description: string;

	/**
	 * Imported MIDI/Schematic file name.
	 */
	public importName: string;

	/**
	 * Looping options for the song.
	 *
	 * @see {@linkcode SongLoop}
	 */
	@enumerable
	@readOnly
	public get loop(): SongLoop {
		return this.#loop;
	}

	/**
	 * Auto-save options for the song.
	 *
	 * @see {@linkcode SongAutoSave}
	 */
	@enumerable
	@readOnly
	public get autoSave(): SongAutoSave {
		return this.#autoSave;
	}

	/**
	 * Number of minutes spent on the song.
	 */
	public minutesSpent = 0;

	/**
	 * Number of times the user has left-clicked on the song.
	 */
	public leftClicks = 0;

	/**
	 * Number of times the user has right-clicked on the song.
	 */
	public rightClicks = 0;

	/**
	 * Number of times the user has added a note block.
	 */
	public blocksAdded = 0;

	/**
	 * Number of times the user have removed a note block.
	 */
	public blocksRemoved = 0;

	/**
	 * Playtime of the song in milliseconds.
	 */
	@enumerable
	@readOnly
	public get duration(): number {
		return this.length * this.#timePerTick;
	}

	/**
	 * Tick of the last measure of the song.
	 */
	@enumerable
	@readOnly
	public get lastMeasure(): number {
		return Math.ceil(this.length / this.timeSignature) * this.timeSignature;
	}

	/**
	 * Time signature of the song.
	 *
	 * @example If this is 3, then the signature is 3/4. This value ranges from 2-8.
	 */
	public timeSignature = 4;

	/**
	 * Tempo of the song.
	 *
	 * @remarks Unit is ticks per second. (TPS)
	 */
	@enumerable
	public get tempo(): number {
		return this.#tempo;
	}

	/**
	 * @remarks Adjusts the {@link Song#timePerTick | time per tick} upon modification.
	 */
	public set tempo(value: number) {
		this.#tempo = value;
		this.#timePerTick = (20 / value) * 50;
	}

	/**
	 * Amount of milliseconds each tick takes.
	 */
	@enumerable
	public get timePerTick(): number {
		return this.#timePerTick;
	}

	/**
	 * @remarks Adjusts the {@link Song#tempo | tempo} upon modification.
	 */
	public set timePerTick(value: number) {
		this.#timePerTick = value;
		this.#tempo = (50 / value) * 20;
	}

	/**
	 * Whether the song has at least one solo layer.
	 *
	 * @see {@linkcode Layer.isSolo}
	 */
	@enumerable
	@readOnly
	public get hasSolo(): boolean {
		let found = false;

		for (const layer of this.#layers.get) {
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
	@enumerable
	@readOnly
	public get instruments(): SongInstruments {
		return this.#instruments;
	}

	/**
	 * Layers within the song.
	 */
	@enumerable
	@readOnly
	public get layers(): SongLayers {
		return this.#layers;
	}
}
