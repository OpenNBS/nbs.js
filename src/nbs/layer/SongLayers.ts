import { enumerable } from "~/decorators/enumerable";
import { readOnly } from "~/decorators/readOnly";
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
	 * {@inheritDoc SongLayers#get}
	 */
	#existing: Layer[] = [];

	/**
	 * A cached frozen copy of {@linkcode SongLayers##existing}.
	 *
	 * {@inheritDoc SongLayers#get}
	 */
	#frozenExisting: Readonly<Layer[]> = [];

	/**
	 * Whether {@linkcode SongLayers##frozenExisting} should be re-created.
	 */
	#frozenExistingIsValid = true;

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
		if (!this.#frozenExistingIsValid) {
			this.#frozenExisting = Object.freeze([...this.#existing]);

			this.#frozenExistingIsValid = true;
		}

		return this.#frozenExisting;
	}

	/**
	 * Same as {@linkcode SongLayers#get}, but without creating a frozen clone.
	 *
	 * Only use this if you know what you're doing!
	 *
	 * @internal
	 */
	public get unsafeGet(): readonly Layer[] {
		return this.#existing;
	}

	/**
	 * Create and add a new blank {@linkcode Layer}.
	 */
	public create(): Layer {
		this.#invalidate();

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
		this.#invalidate();

		this.#existing[this.#existing.length] = layer;
	}

	/**
	 * Delete a {@linkcode Layer}.
	 *
	 * @param index Index of the layer to be deleted
	 */
	public delete(index: number): void {
		this.#invalidate();

		this.#existing.splice(index, 1);
	}

	/**
	 * Iterate each tick-note pair.
	 */
	[Symbol.iterator](): Iterator<Layer> {
		return this.#existing.values();
	}

	/**
	 * Specifies that the cached frozen copy ({@linkcode SongLayers##frozenExisting}) needs to be updated.
	 */
	#invalidate() {
		if (!this.#frozenExistingIsValid) {
			return;
		}

		this.#frozenExistingIsValid = false;
	}
}
