import type { SupportedVersionRange } from "~/parameters/VersionParameter";
import type { SongLayer } from "~/songs/SongLayers";
import type { HeaderLike } from "~/types/headers/HeaderLike";

import { BufferWriter } from "~/buffer/writer";
import { Header } from "~/headers/Header";
import { InitializedInstrument } from "~/instruments/InitializedInstrument";
import { MinecraftInstrument } from "~/instruments/MinecraftInstrument";
import { MinecraftInstruments } from "~/instruments/MinecraftInstruments";
import { Layer } from "~/layers/Layer";
import { Song } from "~/songs/Song";
import type { BinaryOptions, BinaryTransformers } from "./Binary";
import { Binary, BinaryStep, LayerAction } from "./Binary";

import type { PartialDeep } from "type-fest";

export enum InstrumentBehavior {
	Skip,
	Fallback
}

export type BinaryWriterVersion = SupportedVersionRange;

export interface InstrumentTransformerBase {
	"behavior": InstrumentBehavior;
}

export interface InstrumentTransformerSkip extends InstrumentTransformerBase {
	"behavior": InstrumentBehavior.Skip;
}

export interface InstrumentTransformerFallback extends InstrumentTransformerBase {
	"behavior": InstrumentBehavior.Fallback;
	"to": InitializedInstrument | MinecraftInstrument;
}

export type UnsupportedInstrumentOptions =
	| InstrumentTransformerSkip
	| InstrumentTransformerFallback;

export interface BinaryWriterTransformers extends BinaryTransformers {
	"instruments": UnsupportedInstrumentOptions;
}

export interface BinaryWriterOptions extends BinaryOptions {
	"transformers": BinaryWriterTransformers;
	"version": BinaryWriterVersion;
}

export class BinaryWriter extends Binary<ArrayBufferLike> {
	public static get DEFAULT_INSTRUMENT_TRANSFORMER(): UnsupportedInstrumentOptions {
		return {
			"behavior": InstrumentBehavior.Skip
		};
	}

	readonly #writer: BufferWriter;
	readonly #header: HeaderLike;

	readonly #version: BinaryWriterVersion;
	readonly #instrumentTransformer: UnsupportedInstrumentOptions;

	public constructor(header: HeaderLike, options: PartialDeep<BinaryWriterOptions> = {}) {
		super(options);

		this.#writer = new BufferWriter();
		this.#header = header;

		this.#version = options.version ?? header.version;
		this.#instrumentTransformer =
			(options.transformers?.instruments as UnsupportedInstrumentOptions) ??
			BinaryWriter.DEFAULT_INSTRUMENT_TRANSFORMER;

		if (this.#instrumentTransformer.behavior === InstrumentBehavior.Fallback) {
			const fallbackInstrument = this.#instrumentTransformer.to;

			if (
				fallbackInstrument instanceof MinecraftInstrument &&
				fallbackInstrument.supportedVersion > this.#version
			) {
				throw `Specified fallback instrument "${fallbackInstrument.name}" is not supported by provided version "${this.#version}"`;
			}
		}
	}

	public atHeaderStep(): ArrayBufferLike {
		this.processUntil(BinaryStep.Header);

		return this.#writer.buffer;
	}

	public atNotesStep(): ArrayBufferLike {
		this.processUntil(BinaryStep.Layers);

		return this.#writer.buffer;
	}

	public atLayersStep(): ArrayBufferLike {
		this.processUntil(BinaryStep.Instruments);

		return this.#writer.buffer;
	}

	public atInstrumentsStep(): ArrayBufferLike {
		this.processUntil(BinaryStep.Complete);

		return this.#writer.buffer;
	}

	public toArrayBuffer(): ArrayBufferLike {
		this.processUntil(BinaryStep.Complete);

		return this.#writer.buffer;
	}

	protected processHeader(): void {
		this.ensureStep(BinaryStep.Header);

		const supportedInstruments = MinecraftInstruments.getSupportedFor(this.#version);

		if (this.#version >= 1) {
			this.#writer.writeShort(0); // Define the usage of the new NBS specification
			this.#writer.writeByte(this.#version); // NBS specification version
			this.#writer.writeByte(supportedInstruments.length + 1); // First custom instrument index
		}

		if (this.#version === 0 || this.#version >= 3) {
			let size = 0;

			if (this.#header instanceof Header || this.#header instanceof Song) {
				size = this.#header.size;
			}

			this.#writer.writeShort(size); // Song size in total ticks
		}

		let totalLayers = 0;

		if (this.#header instanceof Header) {
			totalLayers = this.#header.layers.total;
		}

		if (this.#header instanceof Song) {
			totalLayers = this.#header.layers.total;
		}

		this.#writer.writeShort(totalLayers); // Total amount of layers

		this.#writer.writeString(this.#header.name); // Song name
		this.#writer.writeString(this.#header.author); // Song author
		this.#writer.writeString(this.#header.originalAuthor); // Song original author
		this.#writer.writeString(this.#header.description); // Song description

		this.#writer.writeShort(this.#header.tempo.ticksPerSecond * 100); // Song tempo

		this.#writer.writeBoolean(this.#header.autoSave.isEnabled); // Song auto-save status
		this.#writer.writeByte(this.#header.autoSave.interval); // Song auto-save interval

		this.#writer.writeByte(this.#header.tempo.beats); // Song time signature (beats)

		this.#writer.writeInt(this.#header.statistics.minutesSpent); // Minutes spent with song open
		this.#writer.writeInt(this.#header.statistics.leftClicks); // Amount of left-clicks on the song
		this.#writer.writeInt(this.#header.statistics.rightClicks); // Amount of right-clicks on the song
		this.#writer.writeInt(this.#header.statistics.blocksAdded); // Amount of blocks added to the song
		this.#writer.writeInt(this.#header.statistics.blocksRemoved); // Amount of blocks removed from the song

		this.#writer.writeString(this.#header.importName); // Imported MIDI/schematic file name

		if (this.#version >= 4) {
			this.#writer.writeBoolean(this.#header.loop.isEnabled); // Song loop status
			this.#writer.writeByte(this.#header.loop.count); // Song maximum loop count
			this.#writer.writeShort(this.#header.loop.startTick); // Song loop start tick
		}

		this.step = BinaryStep.Notes;
	}

	protected processNotes(): void {
		this.ensureStep(BinaryStep.Notes);

		if (!(this.#header instanceof Song)) {
			this.#writer.writeShort(0); // End of notes section

			return;
		}

		let size = 0;
		if (this.#header instanceof Header || this.#header instanceof Song) {
			size = this.#header.size;
		}

		const customInstrumentIndex = MinecraftInstruments.getSupportedFor(this.#version).length + 1;

		let previousTick = -1;

		for (let currentTick = 0; currentTick <= size; currentTick++) {
			let tickHasNotes = false;

			for (const layer of this.#header.layers.values()) {
				if (!layer.notes.has(currentTick)) {
					continue;
				}

				tickHasNotes = true;
				break;
			}

			if (!tickHasNotes) {
				continue;
			}

			const jumpTicks = currentTick - previousTick;
			previousTick = currentTick;

			this.#writer.writeShort(jumpTicks); // Amount of ticks to jump by

			let previousLayer = -1;

			for (const [currentLayer, layer] of this.#header.layers) {
				const note = layer.notes.at(currentTick);
				if (note === undefined) {
					continue;
				}

				let instrumentId: number;

				// Handle instruments outside of the exported version range
				if (
					note.instrument instanceof MinecraftInstrument &&
					note.instrument.supportedVersion > this.#version
				) {
					if (this.#instrumentTransformer.behavior !== InstrumentBehavior.Fallback) {
						continue;
					}

					instrumentId = this.#instrumentTransformer.to.toId();
				} else if (note.instrument instanceof InitializedInstrument) {
					instrumentId = note.instrument.toId() + customInstrumentIndex;
				} else {
					instrumentId = note.instrument.toId();
				}

				const jumpLayers = currentLayer - previousLayer;
				previousLayer = currentLayer;

				this.#writer.writeShort(jumpLayers); // Amount of layers to jump by

				this.#writer.writeByte(instrumentId); // Note instrument ID
				this.#writer.writeByte(note.key); // Note key

				if (this.#version >= 4) {
					this.#writer.writeByte(note.volume); // Note volume
					this.#writer.writeUnsignedByte(note.panning + 100); // Note panning
					this.#writer.writeShort(note.pitch * 100); // Note pitch
				}
			}

			this.#writer.writeShort(0); // End of tick section
		}

		this.#writer.writeShort(0); // End of notes section

		this.step = BinaryStep.Layers;
	}

	protected processLayers(): void {
		this.ensureStep(BinaryStep.Layers);

		if (!(this.#header instanceof Song)) {
			return;
		}

		const layers: Layer[] = this.#header.layers.values().toArray();

		const emptyLayers = this.findEmptyLayers(
			layers.map((layer) => ({
				"isPopulated": (layer as SongLayer).notes.total > 0,
				"name": layer.name,
				"panning": layer.panning,
				"status": layer.status,
				"volume": layer.volume
			}))
		);

		for (const [position, action] of emptyLayers) {
			if (action === LayerAction.Add) {
				layers[position] = new Layer();

				continue;
			}

			layers.slice(position, 1);
		}

		for (const layer of layers) {
			this.#writer.writeString(layer.name); // Layer name

			if (this.#version >= 4) {
				this.#writer.writeByte(layer.status); // Layer lock status
			}

			this.#writer.writeByte(layer.volume); // Layer volume

			if (this.#version >= 2) {
				this.#writer.writeByte(layer.panning + 100); // Layer panning;
			}
		}

		this.step = BinaryStep.Instruments;
	}

	protected processInstruments(): void {
		this.ensureStep(BinaryStep.Instruments);

		if (!(this.#header instanceof Song)) {
			return;
		}

		this.#writer.writeByte(this.#header.instruments.total); // Amount of custom instruments

		for (const instrument of this.#header.instruments.values()) {
			this.#writer.writeString(instrument.name); // Instrument name
			this.#writer.writeString(instrument.soundFile); // Instrument sound file
			this.#writer.writeByte(instrument.key); // Instrument key
			this.#writer.writeBoolean(instrument.doesPressKey); // Instrument press key status
		}

		this.step = BinaryStep.Complete;
	}
}
