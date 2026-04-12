import { isInteger } from "~/validators/isInteger";
import { isPositive } from "~/validators/isPositive";

export type HeaderLayersTotal = number;

export class HeaderLayers {
	#total: HeaderLayersTotal = 0;

	public get total(): HeaderLayersTotal {
		return this.#total;
	}

	public set total(total: HeaderLayersTotal) {
		isInteger(total).ensure();
		isPositive(total).ensure();

		this.#total = total;
	}
}
