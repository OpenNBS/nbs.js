import type { AutoSaveEnabled, AutoSaveInterval } from "~/headers/HeaderAutoSave";
import type {
	OptionalHeaderAuthor,
	OptionalHeaderDescription,
	OptionalHeaderImportName,
	OptionalHeaderName,
	UnknownHeaderVersion
} from "~/headers/HeaderLike";
import type { LoopCount, LoopEnabled, LoopStartTick } from "~/headers/HeaderLoop";
import type {
	BlocksAdded,
	BlocksRemoved,
	LeftClicks,
	MinutesSpent,
	RightClicks
} from "~/headers/HeaderStatistics";
import type { TicksPerSecond, UnknownTimeSignatureBeats } from "~/headers/HeaderTempo";
import type {
	InstrumentPressKey,
	OptionalInstrumentName,
	OptionalInstrumentSoundFile,
	UnknownInstrumentKey
} from "~/instruments/Instrument";
import type {
	LayerStatus,
	OptionalLayerName,
	UnknownLayerPanning,
	UnknownLayerVolume
} from "~/layers/Layer";
import type {
	UnknownNoteKey,
	UnknownNotePanning,
	UnknownNotePitch,
	UnknownNoteVolume
} from "~/notes/Note";

export interface IntermediaryHeader {
	"author": OptionalHeaderAuthor;
	"autoSaveEnabled": AutoSaveEnabled;
	"autoSaveInterval": AutoSaveInterval;
	"blocksAdded": BlocksAdded;
	"blocksRemoved": BlocksRemoved;
	"description": OptionalHeaderDescription;
	"firstCustomInstrument": number;
	"importName": OptionalHeaderImportName;
	"layerTotal": number;
	"leftClicks": LeftClicks;
	"loopCount": LoopCount;
	"loopEnabled": LoopEnabled;
	"loopStartTick": LoopStartTick;
	"minutesSpent": MinutesSpent;
	"name": OptionalHeaderName;
	"originalAuthor": OptionalHeaderAuthor;
	"rightClicks": RightClicks;
	"size": number;
	"ticksPerSecond": TicksPerSecond;
	"timeSignatureBeats": UnknownTimeSignatureBeats;
	"version": UnknownHeaderVersion;
}

export interface IntermediaryNote {
	"instrument": number;
	"key": UnknownNoteKey;
	"layer": number;
	"panning": UnknownNotePanning;
	"pitch": UnknownNotePitch;
	"tick": number;
	"volume": UnknownNoteVolume;
}

export interface IntermediaryLayer {
	"name": OptionalLayerName;
	"panning": UnknownLayerPanning;
	"status": LayerStatus;
	"volume": UnknownLayerVolume;
}

export interface IntermediaryInstrument {
	"doesPressKey": InstrumentPressKey;
	"key": UnknownInstrumentKey;
	"name": OptionalInstrumentName;
	"soundFile": OptionalInstrumentSoundFile;
}
