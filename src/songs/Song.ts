import type { HeaderSize } from "~/headers/Header";

import { HeaderLike } from "~/headers/HeaderLike";
import { SongInstruments } from "~/songs/SongInstruments";
import { SongLayers } from "~/songs/SongLayers";

export class Song extends HeaderLike {
	readonly #instruments = new SongInstruments(this);
	readonly #layers = new SongLayers(this);

	public get size(): HeaderSize {
		let lastTick = 0;

		for (const layer of this.#layers.values()) {
			const layerLastTick = layer.notes.last();

			if (layerLastTick > lastTick) {
				lastTick = layerLastTick;
			}
		}

		return lastTick;
	}

	public get instruments(): SongInstruments {
		return this.#instruments;
	}

	public get layers(): SongLayers {
		return this.#layers;
	}
}
