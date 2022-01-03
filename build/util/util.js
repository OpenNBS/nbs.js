"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setInstrumentClass = exports.setNoteClass = exports.setLayerClass = exports.getInstrumentClass = exports.getNoteClass = exports.getLayerClass = exports.BufferReader = void 0;
const Instrument_1 = __importDefault(require("../nbs/Instrument"));
const Note_1 = __importDefault(require("../nbs/Note"));
const Layer_1 = __importDefault(require("../nbs/Layer"));
class BufferReader {
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
exports.BufferReader = BufferReader;
let LayerClass = Layer_1.default;
function getLayerClass() {
    return LayerClass;
}
exports.getLayerClass = getLayerClass;
function setLayerClass(clazz) {
    LayerClass = clazz;
}
exports.setLayerClass = setLayerClass;
let NoteClass = Note_1.default;
function getNoteClass() {
    return NoteClass;
}
exports.getNoteClass = getNoteClass;
function setNoteClass(clazz) {
    NoteClass = clazz;
}
exports.setNoteClass = setNoteClass;
let InstrumentClass = Instrument_1.default;
function getInstrumentClass() {
    return InstrumentClass;
}
exports.getInstrumentClass = getInstrumentClass;
function setInstrumentClass(clazz) {
    InstrumentClass = clazz;
}
exports.setInstrumentClass = setInstrumentClass;
