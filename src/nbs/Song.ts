import Layer from "./Layer";
import { getInstrumentClass, getLayerClass } from "../util/util";
import fromArrayBuffer from "./file/fromArrayBuffer";
import toArrayBuffer from "./file/toArrayBuffer";
import Instrument from "./Instrument";
import Note from "./Note";

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
 * song.name = "Triumph";
 * song.author = "Encode42";
 * song.tempo = 20;
 *
 * // Create 3 layers for 3 instruments
 * for (let layerCount = 0; layerCount < 3; layerCount++) {
 *     const instrument = Instrument.builtIn[layerCount];
 *
 *     // Create a layer for the instrument
 *     const layer = song.addLayer();
 *     layer.name = instrument.name;
 *
 *     // Notes that will be placed
 *     const notes = [
 *         new Note(instrument, 40),
 *         new Note(instrument, 45),
 *         new Note(instrument, 50),
 *         new Note(instrument, 45),
 *         new Note(instrument, 57)
 *     ];
 *
 *     // Place the notes
 *     for (let i = 0; i < notes.length; i++) {
 *         song.setNote(layer, i * 4, notes[i]);
 *     }
 * }
 *
 * // Write the song
 * fs.writeFileSync("song.nbs", Buffer.from(song.toArrayBuffer()));
 * ```
 */
export default class Song {
    /**
     * Size of the song in ticks.
     */
    public size = 0;

    /**
     * Name of the song.
     */
    public name = "";

    /**
     * Author of the song.
     */
    public author = "";

    /**
     * Original author of the song.
     */
    public originalAuthor = "";

    /**
     * Description of the song.
     */
    public description = "";

    /**
     * Name of the imported MIDI file.
     */
    public midiName = "";

    /**
     * Tempo (ticks per second) of the song.
     */
    public tempo = 10;

    /**
     * Time signature of the song.
     */
    public timeSignature = 4;

    /**
     * Whether looping is enabled.
     */
    public loopEnabled = false;

    /**
     * Maximum times to loop the song.
     */
    public maxLoopCount = 0;

    /**
     * Which tick to loop the song on.
     */
    public loopStartTick = 0;

    /**
     * Whether auto-save is enabled.
     */
    public autoSaveEnabled = false;

    /**
     * Duration of minutes between auto-saves.
     */
    public autoSaveDuration = 5;

    /**
     * Minutes spent with the song open.
     *
     * **Does not automatically increment!**
     */
    public minutesSpent = 0;

    /**
     * Times the song has received left-clicks.
     *
     * **Does not automatically increment!**
     */
    public leftClicks = 0;

    /**
     * Times the song has received right-clicks.
     *
     * **Does not automatically increment!**
     */
    public rightClicks = 0;

    /**
     * Total amount of blocks added.
     *
     * **Does not automatically increment!**
     */
    public blocksAdded = 0;

    /**
     * Total amount of blocks removed.
     *
     * **Does not automatically increment!**
     */
    public blocksRemoved = 0;

    /**
     * Whether the song has at least one solo layer.
     *
     * @see {@linkcode Layer}
     */
    public hasSolo = false;

    /**
     * Version of NBS the song has been saved to.
     *
     * @see https://opennbs.org/nbs
     */
    public nbsVersion = 5;

    /**
     * Index of the first custom instrument.
     */
    public firstCustomIndex = this.instruments.length;

    /**
     * Layers within the song.
     *
     * @see {@linkcode Layer}
     */
    public layers: Layer[] = [];

    /**
     * Errors occurred while loading, manipulating, or saving the nbs file.
     *
     * Returns an empty array if no errors occurred.
     */
    public errors: string[] = [];

    /**
     * Instruments of the song.
     */
    public get instruments() {
        return getInstrumentClass().builtIn;
    }

    /**
     * Amount of milliseconds each tick takes.
     */
    public get timePerTick(): number {
        return 20 / this.tempo * 50;
    }

    /**
     * Length of the song in milliseconds.
     */
    public get endTime(): number {
        return this.size * this.timePerTick;
    }

    /**
     * Create and add a new layer to the song.
     */
    public addLayer(): Layer {
        const layer = new (getLayerClass())(this.layers.length + 1);
        this.layers.push(layer);
        return layer;
    }

    /**
     * Set the note at a tick.
     *
     * @param layer Layer to set the note on
     * @param tick Tick to set the note
     * @param note Note to set
     */
    public setNote(layer: Layer, tick: number, note: Note): void {
        this.expand(tick);

        layer.setNote(tick, note);
    }

    /**
     * Create and add a note to a tick.
     *
     * @param layer Layer to add the note to
     * @param tick Tick to set the note
     * @param instrument The note's instrument
     * @param key The note's key
     * @param panning The note's panning
     * @param velocity The note's velocity
     * @param pitch The note's pitch
     */
    public addNote(layer: Layer, tick: number, instrument?: Instrument, key?: number, panning?: number, velocity?: number, pitch?: number): Note {
        this.expand(tick);

        // Construct the note
        return layer.addNote(tick, instrument, key, panning, velocity, pitch);
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
     * Generate and return an ArrayBuffer from this song.
     *
     * @return Generated ArrayBuffer
     * Returns an empty ArrayBuffer if an error occurred
     */
    public toArrayBuffer(): ArrayBuffer {
        return toArrayBuffer(this);
    }

    /**
     * Generate and return an ArrayBuffer from a song.
     *
     * @param song Song to parse from
     * @return Generated ArrayBuffer
     * Returns an empty ArrayBuffer if an error occurred
     */
    public static toArrayBuffer(song: Song): ArrayBuffer {
        return toArrayBuffer(song);
    }

    /**
     * Parse and return a song from a file array buffer.
     *
     * @param buffer ArrayBuffer to parse from
     * @return Parsed song
     * Returns an empty song if an error occurred
     */
    public static fromArrayBuffer(buffer: ArrayBuffer): Song {
        return fromArrayBuffer(buffer);
    }

    /**
     * Expand the song if required.
     *
     * @param tick Tick that is being added
     */
    private expand(tick: number): void {
        // Expand the song if required
        if (tick + 1 > this.size) {
            this.size = tick + 1;
        }
    }
}
