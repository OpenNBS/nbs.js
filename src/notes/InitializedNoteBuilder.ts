import type { LayerNoteTick, UpdateStatistics } from "~/layers/InitializedLayerNotes";
import type { InitializedNoteInstrument } from "~/notes/InitializedNote";
import type { ParentLayer, ParentLayerNotes, ParentSong } from "~/types/initialized/Parent";

import { InitializedLayerNotesPiece } from "~/layers/InitializedLayerNotes";
import { InitializedNote } from "~/notes/InitializedNote";
import { CompleteNoteBuilder, NoteBuilder } from "~/notes/NoteBuilder";

export class InitializedCompleteNoteBuilder extends CompleteNoteBuilder {
	readonly #song: ParentSong;

	readonly #layer: ParentLayer;
	readonly #layerNotes: ParentLayerNotes;

	readonly #instrument: InitializedNoteInstrument;

	#tick: LayerNoteTick | undefined;

	public constructor(
		song: ParentSong,
		layer: ParentLayer,
		layerNotes: ParentLayerNotes,
		instrument: InitializedNoteInstrument
	) {
		super(instrument);

		this.#song = song;

		this.#layer = layer;
		this.#layerNotes = layerNotes;

		this.#instrument = instrument;
	}

	public at(tick: LayerNoteTick): this {
		this.#tick = tick;

		return this;
	}

	public build(
		updateStatistics: UpdateStatistics = InitializedLayerNotesPiece.DEFAULT_UPDATE_STATISTICS
	): InitializedNote {
		const note = new InitializedNote(this.#song, this.#layer, this.#layerNotes, this.#instrument);

		this.assign(note);

		if (this.#tick === undefined) {
			this.#layerNotes.add(note, updateStatistics);
		} else {
			this.#layerNotes.set(this.#tick, note, updateStatistics);
		}

		return note;
	}
}

export class InitializedNoteBuilder extends NoteBuilder {
	readonly #song: ParentSong;

	readonly #layer: ParentLayer;
	readonly #layerNotes: ParentLayerNotes;

	public constructor(song: ParentSong, layer: ParentLayer, layerNotes: ParentLayerNotes) {
		super();

		this.#song = song;

		this.#layer = layer;
		this.#layerNotes = layerNotes;
	}

	public instrument(instrument: InitializedNoteInstrument): InitializedCompleteNoteBuilder {
		return new InitializedCompleteNoteBuilder(
			this.#song,
			this.#layer,
			this.#layerNotes,
			instrument
		);
	}
}
