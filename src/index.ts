import Song from "./nbs/Song";
import Layer from "./nbs/Layer";
import Note from "./nbs/Note";
import Instrument from "./nbs/Instrument";
import {
    getInstrumentClass,
    getLayerClass,
    getNoteClass,
    setInstrumentClass,
    setLayerClass,
    setNoteClass
} from "./util/util";

export default function NBSjs() {}

NBSjs.Song = Song;
NBSjs.Layer = Layer;
NBSjs.Note = Note;
NBSjs.Instrument = Instrument;

NBSjs.getLayerClass = getLayerClass;
NBSjs.getNoteClass = getNoteClass;
NBSjs.getInstrumentClass = getInstrumentClass;
NBSjs.setLayerClass = setLayerClass;
NBSjs.setNoteClass = setNoteClass;
NBSjs.setInstrumentClass = setInstrumentClass;
