import type { PanningRange, UnknownPanningRange } from "~/parameters/PanningParameter";
import type { UnknownVolumeRange, VolumeRange } from "~/parameters/VolumeParameter";
import type { Result } from "~/types/validators/Result";

import { PanningParameter } from "~/parameters/PanningParameter";
import { VolumeParameter } from "~/parameters/VolumeParameter";
import { isWithinRange } from "~/validators/isWithinRange";
import { fail, ok } from "~/validators/results";

import type { Optional } from "type-fest";

export type LayerName = string;
export type LayerVolume = VolumeRange;
export type LayerPanning = PanningRange;

export type OptionalLayerName = Optional<LayerName>;

export type UnknownLayerVolume = UnknownVolumeRange;
export type UnknownLayerPanning = UnknownPanningRange;

export enum LayerStatus {
	None,
	Locked,
	Solo
}

export class Layer {
	public static get DEFAULT_NAME(): OptionalLayerName {
		return undefined;
	}

	public static get DEFAULT_VOLUME(): LayerVolume {
		return 100;
	}

	public static get DEFAULT_PANNING(): LayerPanning {
		return 0;
	}

	public static get DEFAULT_STATUS(): LayerStatus {
		return LayerStatus.None;
	}

	#name: OptionalLayerName = Layer.DEFAULT_NAME;
	#volume: LayerVolume = Layer.DEFAULT_VOLUME;
	#panning: LayerPanning = Layer.DEFAULT_PANNING;

	#status: LayerStatus = Layer.DEFAULT_STATUS;

	public get name(): OptionalLayerName {
		return this.#name;
	}

	public set name(name: OptionalLayerName) {
		this.#name = name;
	}

	public get volume(): LayerVolume {
		return this.#volume;
	}

	public set volume(volume: UnknownLayerVolume) {
		VolumeParameter.validate(volume).ensure();

		this.#volume = volume as LayerVolume;
	}

	public get panning(): LayerPanning {
		return this.#panning;
	}

	public set panning(panning: UnknownLayerPanning) {
		PanningParameter.validate(panning).ensure();

		this.#panning = panning as LayerPanning;
	}

	public get isSolo(): boolean {
		return this.#status === LayerStatus.Solo;
	}

	public get isLocked(): boolean {
		return this.#status === LayerStatus.Locked;
	}

	public get status(): LayerStatus {
		return this.#status;
	}

	public set status(status: LayerStatus) {
		isWithinRange(status, LayerStatus.None, LayerStatus.Solo).ensure();

		this.#status = status;
	}

	public checkMutable(): Result {
		return this.#status === LayerStatus.Locked ? fail("Layer is locked") : ok();
	}
}
