import type { InitializedLayer } from "~/layers/InitializedLayer";
import type { Song } from "~/songs/Song";
import type { SongInstruments } from "~/songs/SongInstruments";
import type { SongLayerNotes } from "~/songs/SongLayerNotes";

export type ParentSong = Song;
export type ParentSongInstruments = SongInstruments;

export type ParentLayer = InitializedLayer;
export type ParentLayerNotes = SongLayerNotes;
