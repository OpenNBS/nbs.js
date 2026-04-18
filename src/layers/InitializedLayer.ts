import type { SongLayerPosition } from "~/songs/SongLayers";
import type { ParentSong } from "~/types/initialized/Parent";

import { InitializedLayerNotesPiece } from "~/layers/InitializedLayerNotes";
import { Layer } from "~/layers/Layer";

export type InitializedLayerNotes = InitializedLayerNotesPiece;

export class InitializedLayer extends Layer {
	readonly #song: ParentSong;

	readonly #notes: InitializedLayerNotesPiece;

	public constructor(song: ParentSong) {
		super();

		this.#song = song;

		this.#notes = new InitializedLayerNotesPiece(song, this);
	}

	public get notes(): InitializedLayerNotes {
		return this.#notes;
	}

	public get position(): SongLayerPosition {
		let foundPosition: SongLayerPosition | undefined;

		for (const [position, layer] of this.#song.layers) {
			if (this !== layer) {
				continue;
			}

			foundPosition = position;

			break;
		}

		if (foundPosition === undefined) {
			throw "Layer could not be found within song";
		}

		return foundPosition;
	}

	public static from(song: ParentSong, layer: Layer): InitializedLayer {
		const initializedLayer = new InitializedLayer(song);

		initializedLayer.name = layer.name;
		initializedLayer.volume = layer.volume;
		initializedLayer.panning = layer.panning;
		initializedLayer.status = layer.status;

		return initializedLayer;
	}
}
