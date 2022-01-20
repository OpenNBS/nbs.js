import { BufferReader, getInstrumentClass } from "../../util/util";
import Song from "../Song";

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

export default function fromArrayBuffer(buffer: ArrayBuffer): Song {
    const song = new Song();

    try {
        const reader = new BufferReader(buffer);

        let size = reader.readShort(); // Read song size

        // Check if NBS file is ONBS versioned
        if (size === 0) {
            song.nbsVersion = reader.readByte(); // Read NBS version
            song.firstCustomIndex = reader.readByte(); // Read first custom instrument

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
                    const lock = reader.readByte(); // Read layer lock status

                    // Layer is locked
                    if (lock === 1) {
                        layer.locked = true;
                    }

                    // Layer is solo
                    if (lock === 2) {
                        layer.solo = song.hasSolo = true;
                    }
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
                        "key": reader.readByte(), // Read instrument key
                        "pressKey": Boolean(reader.readByte()) // Read press key status
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
            song.addNote(
                layer,
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
