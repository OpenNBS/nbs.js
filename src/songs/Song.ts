import type { HeaderSize } from "~/headers/Header";

import { HeaderLoopPiece } from "~/headers/HeaderLoop";
import { AutoSavePiece } from "~/pieces/AutoSavePiece";
import { MetadataPiece } from "~/pieces/MetadataPiece";
import { StatisticsPiece } from "~/pieces/StatisticsPiece";
import { TempoPiece } from "~/pieces/TempoPiece";
import { SongInstrumentsPiece } from "~/songs/SongInstruments";
import { SongLayersPiece } from "~/songs/SongLayers";
import { HeaderLike } from "~/types/headers/HeaderLike";
import type { InitializedLayerNotesPiece } from "../layers/InitializedLayerNotes";

export type SongHasNotes = boolean;

export type SongAutoSave = AutoSavePiece;
export type SongStatistics = StatisticsPiece;
export type SongTempo = TempoPiece;

export type SongLoop = HeaderLoopPiece;

export type SongInstruments = SongInstrumentsPiece;
export type SongLayerNotes = InitializedLayerNotesPiece;
export type SongLayers = SongLayersPiece;

export class Song extends MetadataPiece implements HeaderLike {
	readonly #autoSave: SongAutoSave = new AutoSavePiece();
	readonly #statistics: SongStatistics = new StatisticsPiece();
	readonly #tempo: SongTempo = new TempoPiece();

	readonly #loop: SongLoop = new HeaderLoopPiece(this);

	readonly #instruments: SongInstruments = new SongInstrumentsPiece(this);
	readonly #layers: SongLayers = new SongLayersPiece(this);

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

	public get hasNotes(): SongHasNotes {
		let hasNotes = false;

		for (const layer of this.#layers.values()) {
			if (layer.notes.total === 0) {
				continue;
			}

			hasNotes = true;
			break;
		}

		return hasNotes;
	}

	public get totalNotes(): number {
		let totalNotes = 0;

		for (const layer of this.#layers.values()) {
			totalNotes += layer.notes.total;
		}

		return totalNotes;
	}

	public get autoSave(): SongAutoSave {
		return this.#autoSave;
	}

	public get statistics(): SongStatistics {
		return this.#statistics;
	}

	public get tempo(): SongTempo {
		return this.#tempo;
	}

	public get loop(): SongLoop {
		return this.#loop;
	}

	public get instruments(): SongInstruments {
		return this.#instruments;
	}

	public get layers(): SongLayers {
		return this.#layers;
	}

	public static fromHeader(header: HeaderLike): Song {
		const song = new Song();

		HeaderLike.assignHeader(header, song);

		return song;
	}
}
