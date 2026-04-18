import type { LoopTick } from "~/pieces/LoopPiece";
import type { HeaderLike } from "~/types/headers/HeaderLike";

import { LoopPiece } from "~/pieces/LoopPiece";

export class HeaderLoopPiece extends LoopPiece {
	readonly #header: HeaderLike;

	public constructor(header: HeaderLike) {
		super();

		this.#header = header;
	}

	public get endTick(): LoopTick {
		return this.#header.size;
	}

	public get endMeasureTick(): LoopTick {
		const size = this.#header.size;
		const beats = this.#header.tempo.beats;

		return size + (beats - (size % beats));
	}
}
