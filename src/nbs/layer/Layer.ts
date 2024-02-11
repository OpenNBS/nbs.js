import { enumerable } from "../../decorators/enumerable";
import { readOnly } from "../../decorators/readOnly";
import { LayerNotes } from "../note/LayerNotes";

/**
 * Options available for a {@linkcode Layer}.
 *
 * @category Layer
 */
export interface LayerOptions {
	/**
	 * {@inheritDoc Layer#name}
	 */
	"name"?: string;

	/**
	 * {@inheritDoc Layer#isLocked}
	 */
	"isLocked"?: boolean;

	/**
	 * {@inheritDoc Layer#isSolo}
	 */
	"isSolo"?: boolean;

	/**
	 * {@inheritDoc Layer#volume}
	 */
	"volume"?: number;

	/**
	 * {@inheritDoc Layer#stereo}
	 */
	"stereo"?: number;
}

/**
 * Default {@linkcode Layer} values.
 *
 * @category Layer
 * @internal
 */
export const defaultLayerOptions: Required<LayerOptions> = {
	"name": undefined,
	"isLocked": false,
	"isSolo": false,
	"volume": 100,
	"stereo": 0
};

/**
 * Represents a layer.
 *
 * @includeExample ./examples/design/layer.ts
 * @category Layer
 */
export class Layer {
	/**
	 * {@inheritDoc Layer#notes}
	 */
	#notes: LayerNotes = new LayerNotes();

	/**
	 * Name of the layer.
	 */
	public name?: string = defaultLayerOptions.name;

	/**
	 * Whether this layer has been marked as locked.
	 */
	public isLocked = defaultLayerOptions.isLocked;

	/**
	 * Whether this layer has been marked as solo.
	 */
	public isSolo = defaultLayerOptions.isSolo;

	/**
	 * Volume of the layer.
	 *
	 * @remarks Unit is percentage.
	 */
	public volume = defaultLayerOptions.volume;

	/**
	 * How much this layer is panned to the left or right.
	 *
	 * @example -100 is 2 blocks right, 0 is center, 100 is 2 blocks left.
	 */
	public stereo = defaultLayerOptions.stereo;

	/**
	 * Notes within the layer.
	 */
	@readOnly
	@enumerable
	public get notes(): LayerNotes {
		return this.#notes;
	}

	constructor(options: LayerOptions = defaultLayerOptions) {
		const mergedOptions = {
			...defaultLayerOptions,
			...options
		};

		this.name = mergedOptions.name;
		this.isLocked = mergedOptions.isLocked;
		this.isSolo = mergedOptions.isSolo;
		this.volume = mergedOptions.volume;
		this.stereo = mergedOptions.stereo;
	}
}
