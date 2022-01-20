import { BufferWriter } from "../../util/util";
import Song from "../Song";

export default function toArrayBuffer(song: Song): ArrayBuffer {
    // Dry run to get target size
    const size = write(song, 0, true).currentByte;

    // Create the actual buffer
    return write(song, size).buffer;
}

function write(song: Song, size: number, dry = false): BufferWriter {
    const writer = new BufferWriter(new ArrayBuffer(size), dry);

    try {
        if (song.nbsVersion >= 1) {
            writer.writeShort(0); // Write ONBS spec
            writer.writeByte(song.nbsVersion); // Write NBS version
            writer.writeByte(song.firstCustomIndex); // First custom instrument index
        }

        if (song.nbsVersion === 0 || song.nbsVersion >= 3) {
            writer.writeShort(song.size); // Write song size
        }

        writer.writeShort(song.layers.length); // Write total amount of layers
        writer.writeString(song.name); // Write song name
        writer.writeString(song.author); // Write song author
        writer.writeString(song.originalAuthor); // Write song original author
        writer.writeString(song.description); // Write song description
        writer.writeShort(song.tempo * 100); // Write song tempo
        writer.writeByte(+song.autoSaveEnabled); // Write song auto-save status
        writer.writeByte(song.autoSaveDuration); // Write auto-save interval
        writer.writeByte(song.timeSignature); // Write song time signature
        writer.writeInt(Math.floor(song.minutesSpent)); // Write minutes spent in song
        writer.writeInt(song.leftClicks); // Write left-clicks on song
        writer.writeInt(song.rightClicks); // Write right-clicks on song
        writer.writeInt(song.blocksAdded); // Write total blocks added to song
        writer.writeInt(song.blocksRemoved); // Write total blocks removed from song
        writer.writeString(song.midiName); // Write imported MIDI file name

        if (song.nbsVersion >= 4) {
            writer.writeByte(+song.loopEnabled); // Write loop status
            writer.writeByte(song.maxLoopCount); // Write maximum loop count
            writer.writeByte(song.loopStartTick); // Write loop start tick
        }

        writer.writeByte(0); // Write end of header

        // Iterate each tick
        let currentTick = -1;
        for (let i = 0; i <= song.size; i++) {
            // Ensure the layer has notes at the tick
            let hasNotes = false;
            for (const layer of song.layers) {
                if (layer.notes[i]) {
                    hasNotes = true;
                    break;
                }
            }

            if (!hasNotes) {
                continue;
            }

            // Get amount of ticks to jump
            const jumpTicks = i - currentTick;
            currentTick = i;

            writer.writeShort(jumpTicks); // Write amount of ticks to jump

            // Iterate each layer
            let currentLayer = -1;
            for (let j = 0; j < song.layers.length; j++) {
                const layer = song.layers[j];
                const note = layer.notes[i];

                if (note) {
                    const jumpLayers = j - currentLayer;
                    currentLayer = j;

                    writer.writeShort(jumpLayers); // Write amount of layers to jump

                    writer.writeByte(note.instrument.id); // Write instrument of note
                    writer.writeByte(note.key); // Write key of note

                    if (song.nbsVersion >= 4) {
                        writer.writeByte(note.velocity); // Write velocity of note
                        writer.writeUnsignedByte(note.panning + 100); // Write panning of note
                        writer.writeShort(note.pitch); // Write pitch of note
                    }
                }
            }

            writer.writeShort(0); // Write end of tick
        }

        writer.writeShort(0); // Write end of notes

        for (const layer of song.layers) {
            writer.writeString(layer.name); // Write layer name

            if (song.nbsVersion >= 4) {
                let val = 0;

                // Layer is locked
                if (layer.locked) {
                    val = 1;
                }

                // Layer is solo
                if (layer.solo) {
                    val = 2;
                }

                writer.writeByte(val); // Write layer lock status
            }

            writer.writeByte(layer.velocity); // Write layer velocity

            if (song.nbsVersion >= 2) {
                writer.writeByte(layer.panning + 100); // Write layer panning
            }
        }

        writer.writeByte(song.instruments.length - song.firstCustomIndex); // Write number of custom instruments
        for (let i = 0; i < song.instruments.length; i++) {
            const instrument = song.instruments[i];
            if (!instrument.builtIn) {
                writer.writeString(instrument.name); // Write instrument name
                writer.writeString(instrument.audioSrc); // Write instrument filename
                writer.writeByte(instrument.key); // Write instrument key
                writer.writeByte(+instrument.pressKey); // Write press key status
            }
        }
    } catch (e) {
        song.errors.push(String(e));
    }

    return writer;
}
