import Instrument from "../nbs/Instrument";
import Note from "../nbs/Note";
import Layer from "../nbs/Layer";

export class BufferReader {
    public buffer: ArrayBuffer;
    public viewer: DataView;
    public currentByte = 0;

    constructor(buffer: ArrayBuffer) {
        this.buffer = buffer;
        this.viewer = new DataView(buffer);
    }

    public readByte(): number {
        const result = this.viewer.getInt8(this.currentByte);
        this.currentByte += 1;
        return result;
    }

    public readUnsingedByte(): number {
        const result = this.viewer.getUint8(this.currentByte);
        this.currentByte += 1;
        return result;
    }

    public readShort(): number {
        const result = this.viewer.getInt16(this.currentByte, true);
        this.currentByte += 2;
        return result;
    }

    public readInt(): number {
        const result = this.viewer.getInt32(this.currentByte, true);
        this.currentByte += 4;
        return result;
    }

    public readString(): string {
        const length = this.readInt();
        let result = "";
        for (let i = 0; i < length; i++) {
            const byte = this.readUnsingedByte();
            result += String.fromCodePoint(byte);
        }
        return result;
    }
}

let LayerClass = Layer;
let NoteClass = Note;
let InstrumentClass = Instrument;

/**
 * Get the {@linkcode Layer} class.
 *
 * Utilized when a specialized layer class is required.
 */
function getLayerClass(): any {
    return LayerClass;
}

/**
 * Set the layer class.
 *
 * Utilized when a specialized layer class is required.
 *
 * @example
 * ```js
 * import { Layer, setLayerClass } from "@encode42/nbs.js"
 *
 * class CustomLayer extends Layer {
 *      // Whether the layer is a custom layer
 *      isCustomLayer = false;
 * }
 *
 * setLayerClass(CustomLayer);
 * ```
 */
function setLayerClass(clazz: any): void {
    LayerClass = clazz;
}

/**
 * Get the {@linkcode Note} class.
 *
 * Utilized when a specialized note class is required.
 */
function getNoteClass(): any {
    return NoteClass;
}

/**
 * Set the note class.
 *
 * Utilized when a specialized note class is required.
 *
 * @example
 * ```js
 * import { Note, setNoteClass } from "@encode42/nbs.js"
 *
 * class CustomNote extends Note {
 *      // The last tick the note was played.
 *      lastPlayed = 0;
 * }
 *
 * setNoteClass(CustomNote);
 * ```
 */
function setNoteClass(clazz: any): void {
    NoteClass = clazz;
}

/**
 * Get the {@linkcode Instrument} class.
 *
 * Utilized when a specialized instrument class is required.
 */
function getInstrumentClass(): any {
    return InstrumentClass;
}

/**
 * Set the instrument class.
 *
 * Utilized when a specialized instrument class is required.
 *
 * @example
 * ```js
 * import { Instrument, setInstrumentClass } from "@encode42/nbs.js"
 *
 * class CustomInstrument extends Instrument {
 *      // Texture source file of the instrument.
 *      textureSrc = "";
 * }
 *
 * setInstrumentClass(CustomInstrument);
 * ```
 */
function setInstrumentClass(clazz: any): void {
    InstrumentClass = clazz;
}

export { getLayerClass, getNoteClass, getInstrumentClass, setLayerClass, setNoteClass, setInstrumentClass };
