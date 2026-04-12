import type { MinecraftInstrument } from "~/instruments/MinecraftInstrument";
import type {
	NoteKey,
	NotePanning,
	NotePitch,
	NoteVolume,
	UnknownNoteKey,
	UnknownNotePanning,
	UnknownNotePitch,
	UnknownNoteVolume
} from "~/notes/Note";
import type { Panning } from "~/parameters/PanningParameter";
import type { ParentLayer, ParentSong } from "~/types/initialized/Parent";

import { InitializedInstrument } from "~/instruments/InitializedInstrument";
import { Note } from "~/notes/Note";

export type InitializedNoteInstrument = InitializedInstrument | MinecraftInstrument;

export class InitializedNote extends Note {
	readonly #song: ParentSong;
	readonly #layer: ParentLayer;

	#instrument: InitializedNoteInstrument;

	public constructor(
		parentSong: ParentSong,
		parentLayer: ParentLayer,
		instrument: InitializedNoteInstrument
	) {
		super(instrument);

		this.#song = parentSong;
		this.#layer = parentLayer;

		this.#instrument = instrument;
	}

	public get instrument(): InitializedNoteInstrument {
		return this.#instrument;
	}

	public set instrument(instrument: InitializedNoteInstrument) {
		this.#layer.checkMutable().ensure();

		if (!this.#song.instruments.has(instrument.identifier)) {
			throw "Provided instrument has not been registered within song";
		}

		this.#instrument = instrument;

		super.instrument = instrument;
	}

	public get key(): NoteKey {
		return super.key;
	}

	public set key(key: UnknownNoteKey) {
		this.#layer.checkMutable().ensure();

		super.key = key;
	}

	public get pitch(): NotePitch {
		return super.pitch;
	}

	public set pitch(pitch: UnknownNotePitch) {
		this.#layer.checkMutable().ensure();

		super.pitch = pitch;
	}

	public get volume(): NoteVolume {
		return super.volume;
	}

	public set volume(volume: UnknownNoteVolume) {
		this.#layer.checkMutable().ensure();

		super.volume = volume;
	}

	public get panning(): NotePanning {
		return super.panning;
	}

	public set panning(panning: UnknownNotePanning) {
		this.#layer.checkMutable().ensure();

		super.panning = panning;
	}

	public get effectivePanning(): Panning {
		return (this.#layer.panning + this.panning) / 2;
	}

	public static from(song: ParentSong, layer: ParentLayer, note: Note): InitializedNote {
		let initializedInstrument = song.instruments.get(note.instrument.identifier);

		if (initializedInstrument === undefined) {
			initializedInstrument = InitializedInstrument.from(song, note.instrument);

			song.instruments.register(initializedInstrument);
		}

		const initializedNote = new InitializedNote(song, layer, initializedInstrument);

		initializedNote.key = note.key;
		initializedNote.pitch = note.pitch;
		initializedNote.volume = note.volume;
		initializedNote.panning = note.panning;

		return initializedNote;
	}
}
