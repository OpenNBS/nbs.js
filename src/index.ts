export { default as Song } from "./nbs/Song";
export { default as Layer } from "./nbs/Layer";
export { default as Note } from "./nbs/Note";
export { default as Instrument } from "./nbs/Instrument";
export {
    getInstrumentClass,
    getLayerClass,
    getNoteClass,
    setInstrumentClass,
    setLayerClass,
    setNoteClass
} from "./util/util";
export type { InstrumentOptions } from "./nbs/interfaces/InstrumentOptions";
