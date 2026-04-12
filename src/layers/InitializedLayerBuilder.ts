import type { SongLayerPosition } from "~/songs/SongLayers";
import type { ParentSong } from "~/types/initialized/Parent";

import { InitializedLayer } from "~/layers/InitializedLayer";
import { LayerBuilder } from "~/layers/LayerBuilder";

export class InitializedLayerBuilder extends LayerBuilder {
	readonly #song: ParentSong;

	#position: SongLayerPosition | undefined;

	public constructor(song: ParentSong) {
		super();

		this.#song = song;
	}

	public at(position: SongLayerPosition): this {
		this.#position = position;

		return this;
	}

	public build(): InitializedLayer {
		const layer = new InitializedLayer(this.#song);

		this.assign(layer);

		if (this.#position === undefined) {
			this.#song.layers.add(layer);
		} else {
			this.#song.layers.set(this.#position, layer);
		}

		return layer;
	}
}
