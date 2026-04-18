import type {
	LayerStatus,
	OptionalLayerName,
	UnknownLayerPanning,
	UnknownLayerVolume
} from "~/layers/Layer";

import { Layer } from "~/layers/Layer";

import type { PartialDeep } from "type-fest";

export enum BinaryStep {
	Header,
	Notes,
	Layers,
	Instruments,
	Complete
}

export enum LayerBehavior {
	None,
	Skip,
	SkipTrailing,
	Ensure
}

export interface LayerTransformerBase {
	"behavior": LayerBehavior;
}

export interface LayerTransformerStandard extends LayerTransformerBase {
	"behavior": LayerBehavior.None | LayerBehavior.Skip | LayerBehavior.SkipTrailing;
}

export interface LayerTransformerEnsure extends LayerTransformerBase {
	"amount": number;
	"behavior": LayerBehavior.Ensure;
}

export type EmptyLayerOptions = LayerTransformerStandard | LayerTransformerEnsure;

export interface BinaryTransformers {
	"layers": EmptyLayerOptions;
}

export interface BinaryOptions {
	"transformers": BinaryTransformers;
}

export interface BasicLayer {
	"isPopulated": boolean;
	"name": OptionalLayerName;
	"panning": UnknownLayerPanning;
	"status": LayerStatus;
	"volume": UnknownLayerVolume;
}

export enum LayerAction {
	Add,
	Remove
}

export type LayerActionMap = Map<number, LayerAction>;

export abstract class Binary<
	HeaderType,
	NotesType = HeaderType,
	LayersType = HeaderType,
	InstrumentsType = HeaderType
> {
	public static get DEFAULT_BINARY_STEP(): BinaryStep {
		return BinaryStep.Header;
	}

	public static get DEFAULT_LAYER_TRANSFORMER(): EmptyLayerOptions {
		return {
			"behavior": LayerBehavior.None
		};
	}

	readonly #layerTransformer: EmptyLayerOptions;

	public constructor(options: PartialDeep<BinaryOptions> = {}) {
		this.#layerTransformer =
			(options.transformers?.layers as EmptyLayerOptions) ?? Binary.DEFAULT_LAYER_TRANSFORMER;
	}

	// biome-ignore lint/style/useReadonlyClassProperties: Step is re-assigned in inherited classes
	public step: BinaryStep = Binary.DEFAULT_BINARY_STEP;

	public abstract atHeaderStep(): HeaderType;
	public abstract atNotesStep(): NotesType;
	public abstract atLayersStep(): LayersType;
	public abstract atInstrumentsStep(): InstrumentsType;

	protected processUntil(step: BinaryStep): void {
		if (this.step >= step) {
			return;
		}

		for (let currentProcessStep = this.step; currentProcessStep < step; currentProcessStep++) {
			switch (currentProcessStep) {
				case BinaryStep.Header: {
					this.processHeader();

					break;
				}

				case BinaryStep.Notes: {
					this.processNotes();

					break;
				}

				case BinaryStep.Layers: {
					this.processLayers();

					break;
				}

				case BinaryStep.Instruments: {
					this.processInstruments();

					break;
				}
			}
		}
	}

	protected abstract processHeader(): void;
	protected abstract processNotes(): void;
	protected abstract processLayers(): void;
	protected abstract processInstruments(): void;

	protected findEmptyLayers(layers: BasicLayer[]): LayerActionMap {
		const layerActions: LayerActionMap = new Map();

		if (this.#layerTransformer.behavior !== LayerBehavior.None) {
			let trailingEmptyLayers = 0;

			for (let index = layers.length - 1; index >= 0; index--) {
				const layer = layers[index];

				if (
					layer.isPopulated ||
					layer.name !== Layer.DEFAULT_NAME ||
					layer.volume !== Layer.DEFAULT_VOLUME ||
					layer.panning !== Layer.DEFAULT_PANNING ||
					layer.status !== Layer.DEFAULT_STATUS
				) {
					if (
						this.#layerTransformer.behavior === LayerBehavior.SkipTrailing ||
						this.#layerTransformer.behavior === LayerBehavior.Ensure
					) {
						break;
					}

					continue;
				}

				trailingEmptyLayers++;

				if (
					this.#layerTransformer.behavior === LayerBehavior.Skip ||
					this.#layerTransformer.behavior === LayerBehavior.SkipTrailing
				) {
					layerActions.set(index, LayerAction.Remove);
				}
			}

			if (this.#layerTransformer.behavior === LayerBehavior.Ensure) {
				for (let index = trailingEmptyLayers; index < this.#layerTransformer.amount; index++) {
					layerActions.set(index, LayerAction.Add);
				}
			}
		}

		return layerActions;
	}

	protected ensureStep(step: BinaryStep): void {
		if (this.step !== step) {
			throw `Parsing step mismatch between current step "${this.step}" and required step "${step}"`;
		}
	}
}
