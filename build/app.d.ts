declare function NBSjs(): void;
declare namespace NBSjs {
    var Song: typeof import("./nbs/Song").default;
    var Layer: typeof import("./nbs/Layer").default;
    var Note: typeof import("./nbs/Note").default;
    var Instrument: typeof import("./nbs/Instrument").default;
    var getLayerClass: typeof import("./util/util").getLayerClass;
    var getNoteClass: typeof import("./util/util").getNoteClass;
    var getInstrumentClass: typeof import("./util/util").getInstrumentClass;
    var setLayerClass: typeof import("./util/util").setLayerClass;
    var setNoteClass: typeof import("./util/util").setNoteClass;
    var setInstrumentClass: typeof import("./util/util").setInstrumentClass;
}
export default NBSjs;
