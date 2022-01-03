export declare class BufferReader {
    buffer: ArrayBuffer;
    viewer: DataView;
    currentByte: number;
    constructor(buffer: ArrayBuffer);
    readByte(): number;
    readUnsingedByte(): number;
    readShort(): number;
    readInt(): number;
    readString(): string;
}
declare function getLayerClass(): any;
declare function setLayerClass(clazz: any): void;
declare function getNoteClass(): any;
declare function setNoteClass(clazz: any): void;
declare function getInstrumentClass(): any;
declare function setInstrumentClass(clazz: any): void;
export { getLayerClass, getNoteClass, getInstrumentClass, setLayerClass, setNoteClass, setInstrumentClass };
