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

export type HeaderLike = {
	"size": HeaderSize;
	"version": MetadataVersion;
	"name": OptionalMetadataName;
	"author": OptionalMetadataAuthor;
	"originalAuthor": OptionalMetadataAuthor;
	"description": OptionalMetadataDescription;
	"importName": OptionalMetadataImportName;
	"autoSave": AutoSavePiece;
	"loop": LoopPiece;
	"statistics": StatisticsPiece;
	"tempo": TempoPiece;
};
