import type { BinaryOptions } from "~/formats/binary/Binary";
import type { LayerPanning } from "~/layers/Layer";
import type { InitializedNoteInstrument } from "~/notes/InitializedNote";
import type { UnknownNotePanning, UnknownNotePitch, UnknownNoteVolume } from "~/notes/Note";
import type { SupportedVersionRange } from "~/parameters/VersionParameter";
import type {
	IntermediaryHeader,
	IntermediaryInstrument,
	IntermediaryLayer,
	IntermediaryNote
} from "~/types/formats/binary/Intermediary";
import type { HeaderLike } from "~/types/headers/HeaderLike";

import { BufferReader } from "~/buffer/reader";
import { Binary, BinaryStep, LayerAction } from "~/formats/binary//Binary";
import { Header } from "~/headers/Header";
import { ResourceLocation } from "~/identifiers/ResourceLocation";
import { Instrument } from "~/instruments/Instrument";
import { MinecraftInstruments } from "~/instruments/MinecraftInstruments";
import { Layer, LayerStatus } from "~/layers/Layer";
import { AutoSavePiece } from "~/pieces/AutoSavePiece";
import { LoopPiece } from "~/pieces/LoopPiece";
import { MetadataPiece } from "~/pieces/MetadataPiece";
import { StatisticsPiece } from "~/pieces/StatisticsPiece";
import { TempoPiece } from "~/pieces/TempoPiece";
import { Song } from "~/songs/Song";

import type { PartialDeep } from "type-fest";

type IntermediaryInstrumentMap = Record<number, ResourceLocation>;

function convertEmpty(argument: string): string | undefined {
	return argument === "" ? undefined : argument;
}

export interface BinaryReaderOptions extends BinaryOptions {}

export type FrozenIntermediaryHeader = Readonly<IntermediaryHeader>;
export type FrozenIntermediaryNotes = readonly IntermediaryNote[];
export type FrozenIntermediaryLayers = readonly IntermediaryLayer[];
export type FrozenIntermediaryInstruments = readonly IntermediaryInstrument[];

export class BinaryReader extends Binary<
	FrozenIntermediaryHeader,
	FrozenIntermediaryNotes,
	FrozenIntermediaryLayers,
	FrozenIntermediaryInstruments
> {
	public static get DEFAULT_HEADER(): IntermediaryHeader {
		return {
			"author": MetadataPiece.DEFAULT_AUTHOR,
			"autoSaveEnabled": AutoSavePiece.DEFAULT_ENABLED,
			"autoSaveInterval": AutoSavePiece.DEFAULT_INTERVAL,
			"blocksAdded": StatisticsPiece.DEFAULT_BLOCKS_ADDED,
			"blocksRemoved": StatisticsPiece.DEFAULT_BLOCKS_REMOVED,
			"description": MetadataPiece.DEFAULT_DESCRIPTION,
			"firstCustomInstrument": 16,
			"importName": MetadataPiece.DEFAULT_IMPORT_NAME,
			"layerTotal": 0,
			"leftClicks": StatisticsPiece.DEFAULT_LEFT_CLICKS,
			"loopCount": LoopPiece.DEFAULT_COUNT,
			"loopEnabled": LoopPiece.DEFAULT_ENABLED,
			"loopStartTick": LoopPiece.DEFAULT_START_TICK,
			"minutesSpent": StatisticsPiece.DEFAULT_MINUTES_SPENT,
			"name": MetadataPiece.DEFAULT_NAME,
			"originalAuthor": MetadataPiece.DEFAULT_ORIGINAL_AUTHOR,
			"rightClicks": StatisticsPiece.DEFAULT_RIGHT_CLICKS,
			"size": 0,
			"ticksPerSecond": TempoPiece.DEFAULT_TICKS_PER_SECOND,
			"timeSignatureBeats": TempoPiece.DEFAULT_BEATS,
			"version": Header.DEFAULT_VERSION
		};
	}

	public static get DEFAULT_NOTES(): IntermediaryNote[] {
		return [];
	}

	public static get DEFAULT_LAYERS(): IntermediaryLayer[] {
		return [];
	}

	public static get DEFAULT_INSTRUMENTS(): IntermediaryInstrument[] {
		return [];
	}

	readonly #reader: BufferReader;

	readonly #header: IntermediaryHeader = BinaryReader.DEFAULT_HEADER;
	readonly #notes: IntermediaryNote[] = BinaryReader.DEFAULT_NOTES;
	readonly #layers: IntermediaryLayer[] = BinaryReader.DEFAULT_LAYERS;
	readonly #instruments: IntermediaryInstrument[] = BinaryReader.DEFAULT_INSTRUMENTS;

	public constructor(file: ArrayBufferLike, options: PartialDeep<BinaryReaderOptions> = {}) {
		super(options);

		this.#reader = new BufferReader(file);
	}

	public atHeaderStep(): FrozenIntermediaryHeader {
		this.processUntil(BinaryStep.Notes);

		return Object.freeze(this.#header);
	}

	public atNotesStep(): FrozenIntermediaryNotes {
		this.processUntil(BinaryStep.Layers);

		return Object.freeze(this.#notes);
	}

	public atLayersStep(): FrozenIntermediaryLayers {
		this.processUntil(BinaryStep.Instruments);

		return Object.freeze(this.#layers);
	}

	public atInstrumentsStep(): FrozenIntermediaryInstruments {
		this.processUntil(BinaryStep.Complete);

		return Object.freeze(this.#instruments);
	}

	public toHeader(): Header {
		this.processUntil(BinaryStep.Notes);

		const header = new Header();

		this.#assignHeader(header);

		header.layers.total = this.#header.layerTotal;

		return header;
	}

	public toSong(): Song {
		this.processUntil(BinaryStep.Complete);

		const song = new Song();

		this.#assignHeader(song);

		const instrumentMap: IntermediaryInstrumentMap = {};

		for (const [id, instrument] of this.#instruments.entries()) {
			const identifier = new ResourceLocation(
				"custom",
				ResourceLocation.sanitizePath(instrument.name ?? id.toString())
			);

			const builder = song.instruments
				.builder()
				.identifier(identifier)
				.name(instrument.name)
				.soundFile(instrument.soundFile)
				.key(instrument.key);

			if (instrument.doesPressKey) {
				builder.pressKey();
			}

			instrumentMap[this.#header.firstCustomInstrument + id] = identifier;

			builder.build();
		}

		for (const layer of this.#layers) {
			const builder = song.layers
				.builder()
				.name(layer.name)
				.volume(layer.volume)
				.panning(layer.panning);

			if (layer.status === LayerStatus.Locked) {
				builder.lock();
			}

			if (layer.status === LayerStatus.Solo) {
				builder.solo();
			}

			builder.build();
		}

		for (const note of this.#notes) {
			let instrument: InitializedNoteInstrument | undefined;

			if (note.instrument >= this.#header.firstCustomInstrument) {
				const instrumentIdentifier = instrumentMap[note.instrument];

				if (instrumentIdentifier === undefined) {
					throw `Custom instrument with ID ${note.instrument} could not be found in intermediary map`;
				}

				instrument = song.instruments.get(instrumentIdentifier);
			} else {
				instrument = MinecraftInstruments.fromId(note.instrument);
			}

			if (instrument === undefined) {
				throw `Instrument with ID ${note.instrument} could not be found in song`;
			}

			const layer = song.layers.at(note.layer);
			if (layer === undefined) {
				throw `Layer at position ${note.layer} could not be found in song`;
			}

			layer.notes
				.builder()
				.instrument(instrument)
				.key(note.key)
				.volume(note.volume)
				.panning(note.panning)
				.pitch(note.pitch)
				.at(note.tick)
				.build(false);
		}

		return song;
	}

	#assignHeader(header: HeaderLike): void {
		if (header instanceof Header) {
			header.size = this.#header.size;
		}

		header.version = this.#header.version as SupportedVersionRange;

		header.name = this.#header.name;
		header.author = this.#header.author;
		header.originalAuthor = this.#header.originalAuthor;
		header.description = this.#header.description;
		header.importName = this.#header.importName;

		header.autoSave.isEnabled = this.#header.autoSaveEnabled;
		header.autoSave.interval = this.#header.autoSaveInterval;

		header.loop.isEnabled = this.#header.loopEnabled;
		header.loop.count = this.#header.loopCount;
		header.loop.startTick = this.#header.loopStartTick;

		header.statistics.minutesSpent = this.#header.minutesSpent;
		header.statistics.leftClicks = this.#header.leftClicks;
		header.statistics.rightClicks = this.#header.rightClicks;
		header.statistics.blocksAdded = this.#header.blocksAdded;
		header.statistics.blocksRemoved = this.#header.blocksRemoved;

		header.tempo.beats = this.#header.timeSignatureBeats;
		header.tempo.ticksPerSecond = this.#header.ticksPerSecond;
	}

	protected processHeader(): void {
		this.ensureStep(BinaryStep.Header);

		this.#header.size = this.#reader.readShort(); // Song length or NBSv1 header

		if (this.#header.size === 0) {
			this.#header.version = this.#reader.readByte(); // NBS version

			this.#header.firstCustomInstrument = this.#reader.readByte(); // First custom instrument index

			if (this.#header.version >= 3) {
				let size = this.#reader.readShort(); // Song size in total ticks

				// Account for one overflow (it's stored as a signed short rather than unsigned)
				// This is replaced by the real size when using the `Song` class
				if (size < 0) {
					const difference = -1 * (BufferReader.MIN_SHORT - size) + 2;

					size = BufferReader.MAX_SHORT + difference;
				}

				this.#header.size = size;
			}
		} else {
			this.#header.version = 0;
		}

		this.#header.layerTotal = this.#reader.readShort(); // Total amount of layers

		this.#header.name = convertEmpty(this.#reader.readString()); // Song name
		this.#header.author = convertEmpty(this.#reader.readString()); // Song author
		this.#header.originalAuthor = convertEmpty(this.#reader.readString()); // Song original author
		this.#header.description = convertEmpty(this.#reader.readString()); // Song description

		this.#header.ticksPerSecond = this.#reader.readShort() / 100; // Song tempo

		this.#header.autoSaveEnabled = this.#reader.readBoolean(); // Song auto-save status
		this.#header.autoSaveInterval = this.#reader.readByte(); // Song auto-save interval

		this.#header.timeSignatureBeats = this.#reader.readByte(); // Song time signature (beats)

		this.#header.minutesSpent = this.#reader.readInt(); // Minutes spent with song open
		this.#header.leftClicks = this.#reader.readInt(); // Amount of left-clicks on the song
		this.#header.rightClicks = this.#reader.readInt(); // Amount of right-clicks on the song
		this.#header.blocksAdded = this.#reader.readInt(); // Amount of blocks added to the song
		this.#header.blocksRemoved = this.#reader.readInt(); // Amount of blocks removed from the song

		this.#header.importName = convertEmpty(this.#reader.readString()); // Imported MIDI/schematic file name

		if (this.#header.version >= 4) {
			this.#header.loopEnabled = this.#reader.readBoolean(); // Song loop status
			this.#header.loopCount = this.#reader.readByte(); // Song maximum loop count
			this.#header.loopStartTick = this.#reader.readShort(); // Song loop start tick
		}

		this.step = BinaryStep.Notes;
	}

	protected processNotes(): void {
		this.ensureStep(BinaryStep.Notes);

		let tick = -1;

		while (true) {
			const jumpTicks = this.#reader.readShort(); // Amount of ticks to jump
			if (jumpTicks === 0) {
				break;
			}

			tick += jumpTicks;

			let layer = -1;
			while (true) {
				const jumpLayers = this.#reader.readShort(); // Amount of layers to jump
				if (jumpLayers === 0) {
					break;
				}

				layer += jumpLayers;

				const instrument = this.#reader.readByte(); // Note instrument ID

				const key = this.#reader.readByte(); // Note key

				let volume: UnknownNoteVolume = 100;
				let panning: UnknownNotePanning = 0;
				let pitch: UnknownNotePitch = 0;

				if (this.#header.version >= 4) {
					volume = this.#reader.readByte(); // Note volume
					panning = this.#reader.readUnsignedByte() - 100; // Note panning
					pitch = this.#reader.readShort() / 100; // Note pitch
				}

				this.#notes.push({
					instrument,
					key,
					layer,
					panning,
					pitch,
					tick,
					volume
				});
			}
		}

		if (this.#header.version > 0 && this.#header.version < 3) {
			this.#header.size = tick;
		}

		this.step = BinaryStep.Layers;
	}

	protected processLayers(): void {
		this.ensureStep(BinaryStep.Layers);

		for (let layerIndex = 0; layerIndex < this.#header.layerTotal; layerIndex++) {
			const layer: IntermediaryLayer = {
				"name": Layer.DEFAULT_NAME,
				"panning": Layer.DEFAULT_PANNING,
				"status": Layer.DEFAULT_STATUS,
				"volume": Layer.DEFAULT_VOLUME
			};

			layer.name = convertEmpty(this.#reader.readString()); // Layer name

			if (this.#header.version >= 4) {
				const lockStatus = this.#reader.readByte(); // Layer locked/solo status

				switch (lockStatus) {
					case 1: {
						layer.status = LayerStatus.Locked;

						break;
					}

					case 2: {
						layer.status = LayerStatus.Solo;

						break;
					}

					default: {
						layer.status = LayerStatus.None;
					}
				}
			}

			layer.volume = this.#reader.readByte(); // Layer volume

			let panning: LayerPanning = 0;

			if (this.#header.version >= 2) {
				panning = this.#reader.readUnsignedByte() - 100; // Layer panning
			}

			layer.panning = panning;

			this.#layers.push(layer);
		}

		const populatedLayers = new Set(this.#notes.map((note) => note.layer));

		const emptyLayers = this.findEmptyLayers(
			this.#layers.map((layer, position) => ({
				"isPopulated": populatedLayers.has(position),
				...layer
			}))
		);

		for (const [position, action] of emptyLayers) {
			switch (action) {
				case LayerAction.Add: {
					this.#layers[position] = {
						"name": Layer.DEFAULT_NAME,
						"panning": Layer.DEFAULT_PANNING,
						"status": Layer.DEFAULT_STATUS,
						"volume": Layer.DEFAULT_VOLUME
					};

					break;
				}

				case LayerAction.Remove: {
					this.#layers.splice(position, 1);

					break;
				}
			}
		}

		this.step = BinaryStep.Instruments;
	}

	protected processInstruments(): void {
		this.ensureStep(BinaryStep.Instruments);

		const instrumentTotal = this.#reader.readByte(); // Amount of custom instruments

		for (let instrumentIndex = 0; instrumentIndex < instrumentTotal; instrumentIndex++) {
			const instrument: IntermediaryInstrument = {
				"doesPressKey": Instrument.DEFAULT_PRESS_KEY,
				"key": Instrument.DEFAULT_KEY,
				"name": Instrument.DEFAULT_NAME,
				"soundFile": Instrument.DEFAULT_SOUND_FILE
			};

			instrument.name = convertEmpty(this.#reader.readString()); // Instrument name
			instrument.soundFile = convertEmpty(this.#reader.readString()); // Instrument sound file
			instrument.key = this.#reader.readByte(); // Instrument pitch
			instrument.doesPressKey = this.#reader.readBoolean(); // Instrument press key status

			this.#instruments.push(instrument);
		}

		this.step = BinaryStep.Complete;
	}
}
