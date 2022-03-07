import { Instrument } from "./nbs/instrument/Instrument";
import { Layer } from "./nbs/Layer";
import { Note } from "./nbs/Note";
import { setInstrumentClass, setLayerClass, setNoteClass } from "./util/util";

setInstrumentClass(Instrument);
setLayerClass(Layer);
setNoteClass(Note);

export * from "./nbs/Song";
export * from "./nbs/Layer";
export * from "./nbs/Note";
export * from "./nbs/instrument/Instrument";
export * from "./nbs/instrument/SongInstrument";
export * from "./nbs/file/fromArrayBuffer";
export * from "./nbs/file/toArrayBuffer";
export * from "./util/util";
