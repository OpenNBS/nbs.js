import { BufferReader } from "../../util/util";
import { Song } from "../Song";
import { Instrument } from "../instrument/Instrument";

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

/**
 * Options for fromArrayBuffer.
 */
export interface FromArrayBufferOptions {
    /**
     * Whether to ignore (delete) unpopulated leading layers.
     *
     * @remarks
     * ONBS automatically generates extra layers past the last populated layer.
     */
    "ignoreEmptyLayers"?: boolean
}

/**
 * Default options for fromArrayBuffer.
 */
export const defaultFromArrayBufferOptions: FromArrayBufferOptions = {
    "ignoreEmptyLayers": false
};

/**
 * Parse and return a song from a file array buffer.
 *
 * @param arrayBuffer ArrayBuffer to parse from
 * @param options Options for parsing
 * @return Parsed song
 * Returns an empty song if an error occurred
 */
export function fromArrayBuffer(arrayBuffer: ArrayBuffer, options = defaultFromArrayBufferOptions): Song {
    const song = new Song();

    try {
        const reader = new BufferReader(arrayBuffer);

        let size = reader.readShort(); // Read song size

        // Check if NBS file is ONBS versioned
        if (size === 0) {
            song.nbsVersion = reader.readByte(); // Read NBS version
            song.instruments.firstCustomIndex = reader.readByte(); // Read first custom instrument

            if (song.nbsVersion >= 3) {
                size = reader.readShort(); // Read real song size
            }
        } else {
            song.nbsVersion = 0;
        }

        const totalLayers = reader.readShort(); // Read total amount of layers
        song.meta.name = reader.readString(); // Read song name
        song.meta.author = reader.readString(); // Read song author
        song.meta.originalAuthor = reader.readString(); // Read song original author
        song.meta.description = reader.readString(); // Read song description
        song.tempo = reader.readShort() / 100; // Read song tempo
        song.autosave.enabled = Boolean(reader.readByte()); // Read song auto-save status
        song.autosave.interval = reader.readByte(); // Read song auto-save interval
        song.timeSignature = reader.readByte(); // Read song time signature
        song.stats.minutesSpent = reader.readInt(); // Read minutes spent in song
        song.stats.leftClicks = reader.readInt(); // Read left-clicks on song
        song.stats.rightClicks = reader.readInt(); // Read right-clicks on song
        song.stats.blocksAdded = reader.readInt(); // Read total blocks added to song
        song.stats.blocksRemoved = reader.readInt(); // Read total blocks removed from song
        song.meta.importName = reader.readString(); // Read imported MiDi/schematic file name

        if (song.nbsVersion >= 4) {
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

        song.length = size;

        // Add layers to song
        if (arrayBuffer.byteLength > reader.nextByte) {
            for (let i = 0; i < totalLayers; i++) {
                const layer = song.createLayer();
                layer.meta.name = reader.readString(); // Read layer name

                if (song.nbsVersion >= 4) {
                    const lock = reader.readByte(); // Read layer lock status

                    // Layer is locked
                    if (lock === 1) {
                        layer.isLocked = true;
                    }

                    // Layer is solo
                    if (lock === 2) {
                        layer.isSolo = true;
                    }
                }

                layer.volume = reader.readByte(); // Read layer velocity

                let panning = 0;
                if (song.nbsVersion >= 2) {
                    panning = reader.readUnsingedByte() - 100; // Read layer panning
                }

                layer.stereo = panning;
            }
        }

        // Parse custom instruments
        const customInstruments = reader.readByte(); // Read number of custom instruments
        for (let i = 0; i < customInstruments; i++) {
            song.instruments.loaded.push(
                new Instrument(
                    Number.parseInt(reader.readString()), // Read instrument name
                    {
                        "soundFile": reader.readString(), // Read instrument file
                        "key": reader.readByte(), // Read instrument pitch
                        "pressKey": Boolean(reader.readByte()) // Read press key status
                    }
                )
            );
        }

        // Parse notes
        for (const rawNote of rawNotes) {
            // Create layer if non-existent
            if (rawNote.layer >= song.layers.length) {
                song.createLayer();
            }

            // Add note to layer
            const layer = song.layers[rawNote.layer];
            song.addNote(
                layer,
                rawNote.tick,
                rawNote.instrument,
                rawNote
            );
        }

        // Remove unpopulated layers
        // TODO: Move this to Song?
        if (options.ignoreEmptyLayers) {
            // Find the last populated layer
            const totalLayers = song.layers.length;
            let lastPopulatedLayer = 0;
            for (let i = 0; i < totalLayers; i++) {
                if (song.layers[i].notes.length > 0) {
                    lastPopulatedLayer = i + 1;
                }
            }

            // Slice
            song.layers = song.layers.splice(0, lastPopulatedLayer);
        }

        song.arrayBuffer = arrayBuffer;
    } catch (e) {
        song.errors.push(String(e));
    }

    return song;
}
