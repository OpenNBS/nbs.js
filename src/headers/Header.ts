import { HeaderLayers } from "~/headers/HeaderLayers";
import { HeaderLike } from "~/headers/HeaderLike";
import { isInteger } from "~/validators/isInteger";
import { isPositive } from "~/validators/isPositive";

export type HeaderSize = number;

export class Header extends HeaderLike {
	#size: HeaderSize = 0;

	readonly #layers = new HeaderLayers();

	public get size(): HeaderSize {
		return this.#size;
	}

	public set size(size: HeaderSize) {
		isInteger(size).ensure();
		isPositive(size).ensure();

		this.#size = size;
	}

	public get layers(): HeaderLayers {
		return this.#layers;
	}
}
