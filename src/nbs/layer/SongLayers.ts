import { Layer } from "~/nbs/layer/Layer";

/**
 * Represents the {@linkcode Layer}s of a {@linkcode Song} and provides helper functions.
 *
 * @includeExample ./examples/full/randomSong.ts
 * @category Song
 * @category Layer
 */
export class SongLayers {
	/**
	 * Array of every layer in the song.
	 */
	public readonly all: Layer[] = [];

	/**
	 * Alias for {@linkcode SongLayers#all.length}
	 */
	public getTotal(): number {
		return this.all.length;
	}

	/**
	 * Create and add a new blank {@linkcode Layer}.
	 */
	public create(): Layer {
		const layer = new Layer();

		this.all[this.all.length] = layer;

		return layer;
	}

	/**
	 * Add an existing {@linkcode Layer}.
	 *
	 * @remarks Any existing layer with the same ID as the added layer will be overwritten.
	 *
	 * @param layer Layer to add
	 */
	public add(layer: Layer): void {
		this.all[this.all.length] = layer;
	}

	/**
	 * Delete a {@linkcode Layer}.
	 *
	 * @param index Index of the layer to be deleted
	 */
	public delete(index: number): void {
		this.all.splice(index, 1);
	}

	/**
	 * Iterate each layer.
	 */
	*[Symbol.iterator](): Iterator<Layer> {
		for (const layer of this.all) {
			yield layer;
		}
	}
}
