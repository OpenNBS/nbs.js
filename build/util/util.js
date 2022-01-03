import Instrument from "../nbs/Instrument";
import Note from "../nbs/Note";
import Layer from "../nbs/Layer";
export class BufferReader {
    constructor(buffer) {
        this.currentByte = 0;
        this.buffer = buffer;
        this.viewer = new DataView(buffer);
    }
    readByte() {
        const result = this.viewer.getInt8(this.currentByte);
        this.currentByte += 1;
        return result;
    }
    readUnsingedByte() {
        const result = this.viewer.getUint8(this.currentByte);
        this.currentByte += 1;
        return result;
    }
    readShort() {
        const result = this.viewer.getInt16(this.currentByte, true);
        this.currentByte += 2;
        return result;
    }
    readInt() {
        const result = this.viewer.getInt32(this.currentByte, true);
        this.currentByte += 4;
        return result;
    }
    readString() {
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
function getLayerClass() {
    return LayerClass;
}
function setLayerClass(clazz) {
    LayerClass = clazz;
}
let NoteClass = Note;
function getNoteClass() {
    return NoteClass;
}
function setNoteClass(clazz) {
    NoteClass = clazz;
}
let InstrumentClass = Instrument;
function getInstrumentClass() {
    return InstrumentClass;
}
function setInstrumentClass(clazz) {
    InstrumentClass = clazz;
}
export { getLayerClass, getNoteClass, getInstrumentClass, setLayerClass, setNoteClass, setInstrumentClass };
