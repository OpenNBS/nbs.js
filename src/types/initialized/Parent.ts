import type { InitializedLayer } from "~/layers/InitializedLayer";
import type { InitializedLayerNotesPiece } from "~/layers/InitializedLayerNotes";
import type { Song } from "~/songs/Song";
import type { SongInstrumentsPiece } from "~/songs/SongInstruments";

export type ParentSong = Song;
export type ParentSongInstruments = SongInstrumentsPiece;

export type ParentLayer = InitializedLayer;
export type ParentLayerNotes = InitializedLayerNotesPiece;
