import type { SongLayerPosition } from "~/songs/SongLayers";
import type { ParentSong } from "~/types/initialized/Parent";

import { Layer } from "~/layers/Layer";
import { SongLayerNotes } from "~/songs/SongLayerNotes";

export class InitializedLayer extends Layer {
	readonly #song: ParentSong;

	readonly #notes: SongLayerNotes;

	public constructor(song: ParentSong) {
		super();

		this.#song = song;

		this.#notes = new SongLayerNotes(song, this);
	}

	public get notes(): SongLayerNotes {
		return this.#notes;
	}

	public get position(): SongLayerPosition {
		let foundPosition: number | undefined;

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
