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
function getLayerClass(): any {
    return LayerClass;
}

function setLayerClass(clazz: any): void {
    LayerClass = clazz;
}

let NoteClass = Note;
function getNoteClass(): any {
    return NoteClass;
}

function setNoteClass(clazz: any): void {
    NoteClass = clazz;
}

let InstrumentClass = Instrument;
function getInstrumentClass(): any {
    return InstrumentClass;
}

function setInstrumentClass(clazz: any): void {
    InstrumentClass = clazz;
}

export { getLayerClass, getNoteClass, getInstrumentClass, setLayerClass, setNoteClass, setInstrumentClass };
