import Layer from "./Layer";
import { getInstrumentClass, getLayerClass } from "../util/util";
import fromArrayBuffer from "./file/fromArrayBuffer";
import toArrayBuffer from "./file/toArrayBuffer";
import Instrument from "./Instrument";
import Note from "./Note";

// TODO: Functional example

/**
 * Represents a full NBS song file.
 *
 * Supports reading, writing, and manipulation.
 *
 * @example
 * ```js
 * import { Song, Note, Instrument } from "@encode42/nbs.js;
 *
 * // Create a song
 * const song = new Song();
 * song.name = "Circles";
 * song.author = "Encode42";
 *
 * // Construct the song
 * const layer = song.addLayer();
 * layer.name = "Harp";
 *
 * // Create the notes
 * const notes = [
 *   new Note(Instrument.builtIn[0], 40),
 *   new Note(Instrument.builtIn[1], 45),
 *   new Note(Instrument.builtIn[2], 50)
 * ];
 *
 * // Populate the layer
 * for (let i = 0; i < notes.length; i++) {
 *   layer.setNote(i + 5, notes[i]);
 * }
 *
 * // Generate a file array buffer
 * const result = song.toArrayBuffer();
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
     * Version of NBS the song has been saved to.
     *
     * @see https://opennbs.org/nbs
     */
    public nbsVersion = 0;

    /**
     * Index of the first custom instrument.
     */
    public firstCustomIndex = 0;

    /**
     * Layers within the song.
     *
     * @see {@linkcode Layer}
     */
    public layers: Layer[] = [];

    /**
     * Whether the song has at least one solo layer.
     */
    public hasSolo = false;

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

    public addNote(layer: Layer, tick: number, instrument?: Instrument, key?: number, panning?: number, velocity?: number, pitch?: number): Note {
        // Expand the song if required
        if (tick + 1 > this.size) {
            this.size = tick + 1;
        }

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
     * Parse and return a song from a file array buffer.
     *
     * @param buffer ArrayBuffer to parse from
     * @return Parsed song
     * Returns an empty song if an error occured
     */
    public static fromArrayBuffer(buffer: ArrayBuffer): Song {
        return fromArrayBuffer(buffer);
    }

    /**
     * Generate and return an ArrayBuffer from a song.
     *
     * @param song Song to parse from
     * @return Generated ArrayBuffer
     * Returns an empty ArrayBuffer if an error occured
     */
    public static toArrayBuffer(song: Song): ArrayBuffer {
        return toArrayBuffer(song);
    }

    /**
     * Generate and return an ArrayBuffer from this song.
     *
     * @return Generated ArrayBuffer
     * Returns an empty ArrayBuffer if an error occured
     */
    public toArrayBuffer(): ArrayBuffer {
        return toArrayBuffer(this);
    }
}
