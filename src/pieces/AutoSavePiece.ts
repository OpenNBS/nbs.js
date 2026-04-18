import { isInteger } from "~/validators/isInteger";
import { isPositive } from "~/validators/isPositive";

export type AutoSaveEnabled = boolean;
export type AutoSaveInterval = number;

export class AutoSavePiece {
	public static get DEFAULT_ENABLED(): AutoSaveEnabled {
		return false;
	}

	public static get DEFAULT_INTERVAL(): AutoSaveInterval {
		return 5;
	}

	#isEnabled: AutoSaveEnabled = AutoSavePiece.DEFAULT_ENABLED;
	#interval: AutoSaveInterval = AutoSavePiece.DEFAULT_INTERVAL;

	public get isEnabled(): AutoSaveEnabled {
		return this.#isEnabled;
	}

	public set isEnabled(isEnabled: AutoSaveEnabled) {
		this.#isEnabled = isEnabled;
	}

	public get interval(): AutoSaveInterval {
		return this.#interval;
	}

	public set interval(interval: AutoSaveInterval) {
		isInteger(interval).ensure();
		isPositive(interval).ensure();

		this.#interval = interval;
	}
}
