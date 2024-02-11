import { enumerable } from "../../decorators/enumerable";
import { readOnly } from "../../decorators/readOnly";
import { Layer } from "./Layer";

/**
 * Represents the {@linkcode Layer}s of a {@linkcode Song} and provides helper functions.
 *
 * @includeExample ./examples/full/randomSong.ts
 * @category Song
 * @category Layer
 */
export class SongLayers {
	/**
	 * {@inheritDoc SongLayers#get}
	 */
	#existing: Layer[] = [];

	/**
	 * Total number of layers.
	 */
	@enumerable
	@readOnly
	public get total(): number {
		return this.#existing.length;
	}

	/**
	 * Existing layers.
	 */
	@enumerable
	@readOnly
	public get get(): readonly Layer[] {
		return Object.freeze([...this.#existing]);
	}

	/**
	 * Create and add a new blank {@linkcode Layer}.
	 */
	public create(): Layer {
		const layer = new Layer();

		this.#existing[this.#existing.length] = layer;

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
		this.#existing[this.#existing.length] = layer;
	}

	/**
	 * Delete a {@linkcode Layer}.
	 *
	 * @param index Index of the layer to be deleted
	 */
	public delete(index: number): void {
		this.#existing.splice(index, 1);
	}

	/**
	 * Iterate each tick-note pair.
	 */
	[Symbol.iterator](): Iterator<Layer> {
		return this.#existing.values();
	}
}
