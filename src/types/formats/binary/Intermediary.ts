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
import type { AutoSaveEnabled, AutoSaveInterval } from "~/pieces/AutoSavePiece";
import type { LoopCount, LoopEnabled, LoopTick } from "~/pieces/LoopPiece";
import type {
	OptionalMetadataAuthor,
	OptionalMetadataDescription,
	OptionalMetadataImportName,
	OptionalMetadataName,
	UnknownVersion
} from "~/pieces/MetadataPiece";
import type {
	StatisticsBlocksAdded,
	StatisticsBlocksRemoved,
	StatisticsLeftClicks,
	StatisticsMinutesSpent,
	StatisticsRightClicks
} from "~/pieces/StatisticsPiece";
import type { TicksPerSecond, UnknownTimeSignatureBeats } from "~/pieces/TempoPiece";

export interface IntermediaryHeader {
	"author": OptionalMetadataAuthor;
	"autoSaveEnabled": AutoSaveEnabled;
	"autoSaveInterval": AutoSaveInterval;
	"blocksAdded": StatisticsBlocksAdded;
	"blocksRemoved": StatisticsBlocksRemoved;
	"description": OptionalMetadataDescription;
	"firstCustomInstrument": number;
	"importName": OptionalMetadataImportName;
	"layerTotal": number;
	"leftClicks": StatisticsLeftClicks;
	"loopCount": LoopCount;
	"loopEnabled": LoopEnabled;
	"loopStartTick": LoopTick;
	"minutesSpent": StatisticsMinutesSpent;
	"name": OptionalMetadataName;
	"originalAuthor": OptionalMetadataAuthor;
	"rightClicks": StatisticsRightClicks;
	"size": number;
	"ticksPerSecond": TicksPerSecond;
	"timeSignatureBeats": UnknownTimeSignatureBeats;
	"version": UnknownVersion;
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
