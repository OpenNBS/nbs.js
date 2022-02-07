import Instrument from "./nbs/instrument/Instrument";
import Layer from "./nbs/Layer";
import Note from "./nbs/Note";
import { setInstrumentClass, setLayerClass, setNoteClass } from "./util/util";

setInstrumentClass(Instrument);
setLayerClass(Layer);
setNoteClass(Note);

export { default as Song } from "./nbs/Song";
export { default as Layer } from "./nbs/Layer";
export { default as Note } from "./nbs/Note";
export { default as Instrument } from "./nbs/instrument/Instrument";
export { default as SongInstrument } from "./nbs/instrument/SongInstrument";
export { default as fromArrayBuffer } from "./nbs/file/fromArrayBuffer";
export { default as toArrayBuffer } from "./nbs/file/toArrayBuffer";
export { getInstrumentClass, getLayerClass, getNoteClass, setInstrumentClass, setLayerClass, setNoteClass } from "./util/util";
export type { default as SongMeta, defaultSongMeta } from "./nbs/interfaces/song/SongMeta";
export type { default as SongLoopOptions, defaultLoopOptions } from "./nbs/interfaces/song/SongLoopOptions";
export type { default as SongAutosaveOptions, defaultAutosaveOptions } from "./nbs/interfaces/song/SongAutosaveOptions";
export type { default as SongStats, defaultSongStats } from "./nbs/interfaces/song/SongStats";
export type { default as LayerMeta, defaultLayerMeta } from "./nbs/interfaces/layer/LayerMeta";
export type { default as NoteOptions, defaultNoteOptions } from "./nbs/interfaces/note/NoteOptions";
export type { default as InstrumentOptions, defaultInstrumentOptions } from "./nbs/interfaces/instrument/InstrumentOptions";
export type { default as InstrumentMeta, defaultInstrumentMeta } from "./nbs/interfaces/instrument/InstrumentMeta";
