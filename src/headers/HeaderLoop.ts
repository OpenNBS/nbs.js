import { isInteger } from "~/validators/isInteger";
import { isPositive } from "~/validators/isPositive";

export type LoopEnabled = boolean;
export type LoopStartTick = number;
export type LoopCount = number;

export class HeaderLoop {
	public static get DEFAULT_ENABLED(): LoopEnabled {
		return false;
	}

	public static get DEFAULT_START_TICK(): LoopStartTick {
		return 0;
	}

	public static get DEFAULT_COUNT(): LoopCount {
		return 0;
	}

	#isEnabled: LoopEnabled = HeaderLoop.DEFAULT_ENABLED;
	#startTick: LoopStartTick = HeaderLoop.DEFAULT_START_TICK;
	#count: LoopCount = HeaderLoop.DEFAULT_COUNT;

	public get isEnabled(): LoopEnabled {
		return this.#isEnabled;
	}

	public set isEnabled(isEnabled: LoopEnabled) {
		this.#isEnabled = isEnabled;
	}

	public get startTick(): LoopStartTick {
		return this.#startTick;
	}

	public set startTick(startTick: LoopStartTick) {
		isInteger(startTick).ensure();
		isPositive(startTick).ensure();

		this.#startTick = startTick;
	}

	public get count(): LoopCount {
		return this.#count;
	}

	public set count(count: LoopCount) {
		isInteger(count).ensure();
		isPositive(count).ensure();

		this.#count = count;
	}
}
