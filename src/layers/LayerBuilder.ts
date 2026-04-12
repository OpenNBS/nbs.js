import type { OptionalLayerName, UnknownLayerPanning, UnknownLayerVolume } from "~/layers/Layer";

import { Layer, LayerStatus } from "~/layers/Layer";

export class LayerBuilder {
	#name: OptionalLayerName | undefined;
	#volume: UnknownLayerVolume | undefined;
	#panning: UnknownLayerPanning | undefined;
	#status: LayerStatus | undefined;

	public name(name: OptionalLayerName): this {
		this.#name = name;

		return this;
	}

	public volume(volume: UnknownLayerVolume): this {
		this.#volume = volume;

		return this;
	}

	public panning(panning: UnknownLayerPanning): this {
		this.#panning = panning;

		return this;
	}

	public solo(): this {
		this.#ensureNoneStatus();

		this.#status = LayerStatus.Solo;

		return this;
	}

	public lock(): this {
		this.#ensureNoneStatus();

		this.#status = LayerStatus.Locked;

		return this;
	}

	public status(status: LayerStatus): this {
		this.#ensureNoneStatus();

		this.#status = status;

		return this;
	}

	public build(): Layer {
		const layer = new Layer();

		this.assign(layer);

		return layer;
	}

	protected assign(layer: Layer): void {
		if (this.#name !== undefined) {
			layer.name = this.#name;
		}

		if (this.#volume !== undefined) {
			layer.volume = this.#volume;
		}

		if (this.#panning !== undefined) {
			layer.panning = this.#panning;
		}

		if (this.#status !== undefined) {
			layer.status = this.#status;
		}
	}

	#ensureNoneStatus(): void {
		if (this.#status === LayerStatus.None) {
			return;
		}

		throw "Layer status has already been specified";
	}
}
