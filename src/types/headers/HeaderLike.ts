import type { HeaderSize } from "~/headers/Header";
import type { AutoSavePiece } from "~/pieces/AutoSavePiece";
import type { LoopPiece } from "~/pieces/LoopPiece";
import type {
	MetadataVersion,
	OptionalMetadataAuthor,
	OptionalMetadataDescription,
	OptionalMetadataImportName,
	OptionalMetadataName
} from "~/pieces/MetadataPiece";
import type { StatisticsPiece } from "~/pieces/StatisticsPiece";
import type { TempoPiece } from "~/pieces/TempoPiece";

export abstract class HeaderLike {
	public abstract size: HeaderSize;
	public abstract version: MetadataVersion;
	public abstract name: OptionalMetadataName;
	public abstract author: OptionalMetadataAuthor;
	public abstract originalAuthor: OptionalMetadataAuthor;
	public abstract description: OptionalMetadataDescription;
	public abstract importName: OptionalMetadataImportName;
	public abstract autoSave: AutoSavePiece;
	public abstract loop: LoopPiece;
	public abstract statistics: StatisticsPiece;
	public abstract tempo: TempoPiece;

	public static assignHeader(fromHeader: HeaderLike, toHeader: HeaderLike): void {
		toHeader.version = fromHeader.version;
		toHeader.name = fromHeader.name;
		toHeader.author = fromHeader.author;
		toHeader.originalAuthor = fromHeader.originalAuthor;
		toHeader.description = fromHeader.description;
		toHeader.importName = fromHeader.importName;
		toHeader.autoSave.isEnabled = fromHeader.autoSave.isEnabled;
		toHeader.autoSave.interval = fromHeader.autoSave.interval;
		toHeader.loop.isEnabled = fromHeader.loop.isEnabled;
		toHeader.loop.count = fromHeader.loop.count;
		toHeader.loop.startTick = fromHeader.loop.startTick;
		toHeader.statistics.minutesSpent = fromHeader.statistics.minutesSpent;
		toHeader.statistics.blocksAdded = fromHeader.statistics.blocksAdded;
		toHeader.statistics.blocksRemoved = fromHeader.statistics.blocksRemoved;
		toHeader.statistics.leftClicks = fromHeader.statistics.leftClicks;
		toHeader.statistics.rightClicks = fromHeader.statistics.rightClicks;
		toHeader.tempo.beats = fromHeader.tempo.beats;
		toHeader.tempo.note = fromHeader.tempo.note;
		toHeader.tempo.ticksPerSecond = fromHeader.tempo.ticksPerSecond;
	}
}
