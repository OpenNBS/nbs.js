import type { HeaderLike } from "~/types/headers/HeaderLike";

import { HeaderLayersPiece } from "~/headers/HeaderLayers";
import { HeaderLoopPiece } from "~/headers/HeaderLoop";
import { AutoSavePiece } from "~/pieces/AutoSavePiece";
import { MetadataPiece } from "~/pieces/MetadataPiece";
import { StatisticsPiece } from "~/pieces/StatisticsPiece";
import { TempoPiece } from "~/pieces/TempoPiece";
import { isInteger } from "~/validators/isInteger";
import { isPositive } from "~/validators/isPositive";

export type HeaderSize = number;

export type HeaderAutoSave = AutoSavePiece;
export type HeaderStatistics = StatisticsPiece;
export type HeaderTempo = TempoPiece;

export type HeaderLoop = HeaderLoopPiece;
export type HeaderLayers = HeaderLayersPiece;

export class Header extends MetadataPiece implements HeaderLike {
	#size: HeaderSize = 0;

	readonly #autoSave: HeaderAutoSave = new AutoSavePiece();
	readonly #statistics: HeaderStatistics = new StatisticsPiece();
	readonly #tempo: HeaderTempo = new TempoPiece();

	readonly #loop: HeaderLoop = new HeaderLoopPiece(this);
	readonly #layers: HeaderLayers = new HeaderLayersPiece();

	public get size(): HeaderSize {
		return this.#size;
	}

	public set size(size: HeaderSize) {
		isInteger(size).ensure();
		isPositive(size).ensure();

		this.#size = size;
	}

	public get autoSave(): HeaderAutoSave {
		return this.#autoSave;
	}

	public get statistics(): HeaderStatistics {
		return this.#statistics;
	}

	public get tempo(): HeaderTempo {
		return this.#tempo;
	}

	public get loop(): HeaderLoop {
		return this.#loop;
	}

	public get layers(): HeaderLayers {
		return this.#layers;
	}
}
