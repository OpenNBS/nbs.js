import toArrayBuffer from "./file/toArrayBuffer";
import Layer from "./Layer";
import { getLayerClass } from "../util/util";
import { defaultSongMeta } from "./interfaces/song/SongMeta";
import { defaultSongStats } from "./interfaces/song/SongStats";
import { defaultLoopOptions } from "./interfaces/song/SongLoopOptions";
import { defaultAutosaveOptions } from "./interfaces/song/SongAutosaveOptions";
import NoteOptions, { defaultNoteOptions } from "./interfaces/note/NoteOptions";
import Note from "./Note";
import SongInstrument from "./instrument/SongInstrument";
import Instrument from "./instrument/Instrument";

// TODO:
// - Shrink song when removing notes
// - Create field with loop tick (end of measure)

/**
 * Represents a full NBS song file.
 *
 * Supports reading, writing, and manipulation.
 *
 * @example
 * ```js
 * const fs = require("fs");
 * const { Song, Note, Instrument } = require("@encode42/nbs.js");
 *
 * // Create a new song
 * const song = new Song();
 * song.meta.name = "Triumph";
 * song.meta.author = "Encode42";
 * song.tempo = 20;
 *
 * // Create 3 layers for 3 instruments
 * for (let layerCount = 0; layerCount < 3; layerCount++) {
 *     const instrument = Instrument.builtIn[layerCount];
 *
 *     // Create a layer for the instrument
 *     const layer = song.createLayer();
 *     layer.meta.name = instrument.meta.name;
 *
 *     // Notes that will be placed
 *     const notes = [
 *         new Note(instrument, { "key": 40 }),
 *         new Note(instrument, { "key": 45 }),
 *         new Note(instrument, { "key": 50 }),
 *         new Note(instrument, { "key": 45 }),
 *         new Note(instrument, { "key": 57 })
 *     ];
 *
 *     // Place the notes
 *     for (let i = 0; i < notes.length; i++) {
 *         song.setNote(i * 4, layer, notes[i]);
 *     }
 * }
 *
 * // Write the song
 * fs.writeFileSync("song.nbs", Buffer.from(song.toArrayBuffer()));
 * ```
 */
export default class Song {
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
    public meta = defaultSongMeta;

    /**
     * Tempo (ticks per second) of the song.
     */
    public tempo = 10;

    /**
     * Amount of milliseconds each tick takes.
     */
    public get timePerTick(): number {
        return 20 / this.tempo * 50;
    }

    /**
     * Time signature of the song.
     *
     * If this is 3, then the signature is 3/4. This value ranges from 2-8.
     */
    public timeSignature = 4;

    /**
     * Looping options for the song.
     *
     * @see {@linkcode SongLoopOptions}
     */
    public loop = defaultLoopOptions;

    /**
     * Auto-save options for the song.
     *
     * @see {@linkcode SongAutosaveOptions}
     */
    public autosave = defaultAutosaveOptions;

    /**
     * Statistics for the song.
     *
     * @see {@linkcode SongStats}
     */
    public stats = defaultSongStats;

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
     * Returns an empty array if no errors occurred.
     */
    public errors: string[] = [];

    constructor() {
        Object.defineProperties(this.stats, {
            "hasSolo": {
                "get": () => {
                    let found = false;

                    for (const layer of this.layers) {
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
            }
        });
    }

    /**
     * Create and add a new blank layer to the song.
     */
    public createLayer(): Layer {
        const layer = new (getLayerClass())(this.layers.length + 1);
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
     * Delete a layer from the song.
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
