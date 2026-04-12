import type {
	NoteInstrument,
	UnknownNoteKey,
	UnknownNotePanning,
	UnknownNotePitch,
	UnknownNoteVolume
} from "~/notes/Note";

import { Note } from "~/notes/Note";

export class CompleteNoteBuilder {
	readonly #instrument: NoteInstrument;

	#key: UnknownNoteKey | undefined;
	#pitch: UnknownNotePitch | undefined;
	#volume: UnknownNoteVolume | undefined;
	#panning: UnknownNotePanning | undefined;

	public constructor(instrument: NoteInstrument) {
		this.#instrument = instrument;
	}

	public key(key: UnknownNoteKey): this {
		this.#key = key;

		return this;
	}

	public pitch(pitch: UnknownNotePitch): this {
		this.#pitch = pitch;

		return this;
	}

	public volume(volume: UnknownNoteVolume): this {
		this.#volume = volume;

		return this;
	}

	public panning(panning: UnknownNotePanning): this {
		this.#panning = panning;

		return this;
	}

	public build(): Note {
		const note = new Note(this.#instrument);

		this.assign(note);

		return note;
	}

	protected assign(note: Note): void {
		if (this.#key !== undefined) {
			note.key = this.#key;
		}

		if (this.#pitch !== undefined) {
			note.pitch = this.#pitch;
		}

		if (this.#volume !== undefined) {
			note.volume = this.#volume;
		}

		if (this.#panning !== undefined) {
			note.panning = this.#panning;
		}
	}
}

export class NoteBuilder {
	public instrument(instrument: NoteInstrument): CompleteNoteBuilder {
		return new CompleteNoteBuilder(instrument);
	}
}
