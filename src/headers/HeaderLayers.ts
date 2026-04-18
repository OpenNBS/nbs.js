import { isInteger } from "~/validators/isInteger";
import { isPositive } from "~/validators/isPositive";

export type LayersTotal = number;

export class HeaderLayersPiece {
	#total: LayersTotal = 0;

	public get total(): LayersTotal {
		return this.#total;
	}

	public set total(total: LayersTotal) {
		isInteger(total).ensure();
		isPositive(total).ensure();

		this.#total = total;
	}
}
