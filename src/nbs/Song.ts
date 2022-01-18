import Layer from "./Layer";
import { BufferReader, getInstrumentClass, getLayerClass } from "../util/util";

/**
 * Raw structure of a note.
 */
interface RawNote {
    /**
     * Instrument of the note.
     */
    "instrument": number,

    /**
     * Key of the note.
     */
    "key": number,

    /**
     * Panning of the note.
     */
    "panning": number,

    /**
     * Velocity of the note.
     */
    "velocity": number,

    /**
     * Pitch of the note.
     */
    "pitch": number,

    /**
     * Layer ID of the note.
     */
    "layer": number,

    /**
     * Tick the note is placed on.
     */
    "tick": number
}

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
     * Total amount of blocks removed
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
        const layer = new (getLayerClass())(this, this.layers.length + 1);
        this.layers.push(layer);
        return layer;
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
        const song = new this();

        try {
            const reader = new BufferReader(buffer);

            let size = reader.readShort(); // Read song size

            // Check if NBS file is ONBS versioned
            if (size === 0) {
                song.nbsVersion = reader.readByte(); // Read NBS version
                reader.readByte(); // Read first custom instrument

                if (song.nbsVersion >= 3) {
                    size = reader.readShort(); // Read real song size
                }
            }

            const totalLayers = reader.readShort(); // Read total amount of layers
            song.name = reader.readString(); // Read song name
            song.author = reader.readString(); // Read song author
            song.originalAuthor = reader.readString(); // Read song original author
            song.description = reader.readString(); // Read song description
            song.tempo = reader.readShort() / 100; // Read song tempo
            song.autoSaveEnabled = Boolean(reader.readByte()); // Read song auto-save status
            song.autoSaveDuration = reader.readByte(); // Read song auto-save interval
            song.timeSignature = reader.readByte(); // Read song time signature
            song.minutesSpent = reader.readInt(); // Read minutes spent in song
            song.leftClicks = reader.readInt(); // Read left-clicks on song
            song.rightClicks = reader.readInt(); // Read right-clicks on song
            song.blocksAdded = reader.readInt(); // Read total blocks added to song
            song.blocksRemoved = reader.readInt(); // Read total blocks removed from song
            song.midiName = reader.readString(); // Read imported MIDI file name

            if (song.nbsVersion >= 4) {
                song.loopEnabled = Boolean(reader.readByte()); // Read loop status
                song.maxLoopCount = reader.readByte(); // Read maximum loop count
                song.loopStartTick = reader.readShort(); // Read loop start tick
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
                    let panning = 100;
                    let pitch = 0;
                    if (song.nbsVersion >= 4) {
                        velocity = reader.readByte(); // Read velocity of note
                        panning = reader.readUnsingedByte() - 100; // Read panning of note
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
            if (song.nbsVersion > 0 && song.nbsVersion < 3) {
                size = tick;
            }

            song.size = size;

            // Add layers to song
            if (buffer.byteLength > reader.currentByte) {
                for (let i = 0; i < totalLayers; i++) {
                    const layer = song.addLayer();
                    layer.name = reader.readString(); // Read layer name

                    if (song.nbsVersion >= 4) {
                        layer.locked = Boolean(reader.readByte()); // Read layer lock status
                    }

                    layer.velocity = reader.readByte(); // Read layer velocity

                    let panning = 0;
                    if (song.nbsVersion >= 2) {
                        panning = reader.readUnsingedByte() - 100; // Read layer panning
                    }

                    layer.panning = panning;
                }
            }

            // Parse custom instruments
            const customInstruments = reader.readByte(); // Read number of custom instruments
            for (let i = 0; i < customInstruments; i++) {
                song.instruments.push(
                    new (getInstrumentClass())(
                        reader.readString(), // Read instrument name
                        song.instruments.length,
                        {
                            "audioSrc": reader.readString(), // Read instrument file
                            "pitch": reader.readByte(), // Read instrument pitch
                            "key": reader.readByte()// Read instrument key
                        }
                    )
                );
            }

            // Parse notes
            for (const rawNote of rawNotes) {
                // Create layer if non-existent
                if (rawNote.layer >= song.layers.length) {
                    song.addLayer();
                }

                // Add note to layer
                const layer = song.layers[rawNote.layer];
                layer.addNote(
                    rawNote.tick,
                    song.instruments[rawNote.instrument],
                    rawNote.key,
                    rawNote.panning,
                    rawNote.velocity,
                    rawNote.pitch
                );
            }
        } catch (e) {
            song.errors.push(String(e));
        }

        return song;
    }
}
