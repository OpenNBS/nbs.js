import { isInteger } from "~/validators/isInteger";
import { isPositive } from "~/validators/isPositive";

export type MinutesSpent = number;
export type LeftClicks = number;
export type RightClicks = number;
export type BlocksAdded = number;
export type BlocksRemoved = number;

export class HeaderStatistics {
	public static get DEFAULT_MINUTES_SPENT(): MinutesSpent {
		return 0;
	}

	public static get DEFAULT_LEFT_CLICKS(): LeftClicks {
		return 0;
	}

	public static get DEFAULT_RIGHT_CLICKS(): RightClicks {
		return 0;
	}

	public static get DEFAULT_BLOCKS_ADDED(): BlocksAdded {
		return 0;
	}

	public static get DEFAULT_BLOCKS_REMOVED(): BlocksRemoved {
		return 0;
	}

	#minutesSpent: MinutesSpent = HeaderStatistics.DEFAULT_MINUTES_SPENT;
	#leftClicks: LeftClicks = HeaderStatistics.DEFAULT_LEFT_CLICKS;
	#rightClicks: RightClicks = HeaderStatistics.DEFAULT_RIGHT_CLICKS;
	#blocksAdded: BlocksAdded = HeaderStatistics.DEFAULT_BLOCKS_ADDED;
	#blocksRemoved: BlocksRemoved = HeaderStatistics.DEFAULT_BLOCKS_REMOVED;

	public get minutesSpent(): MinutesSpent {
		return this.#minutesSpent;
	}

	public set minutesSpent(minutesSpent: MinutesSpent) {
		isInteger(minutesSpent).ensure();
		isPositive(minutesSpent).ensure();

		this.#minutesSpent = minutesSpent;
	}

	public get leftClicks(): LeftClicks {
		return this.#leftClicks;
	}

	public set leftClicks(leftClicks: LeftClicks) {
		isInteger(leftClicks).ensure();
		isPositive(leftClicks).ensure();

		this.#leftClicks = leftClicks;
	}

	public get rightClicks(): RightClicks {
		return this.#rightClicks;
	}

	public set rightClicks(rightClicks: RightClicks) {
		isInteger(rightClicks).ensure();
		isPositive(rightClicks).ensure();

		this.#rightClicks = rightClicks;
	}

	public get blocksAdded(): BlocksAdded {
		return this.#blocksAdded;
	}

	public set blocksAdded(blocksAdded: BlocksAdded) {
		isInteger(blocksAdded).ensure();
		isPositive(blocksAdded).ensure();

		this.#blocksAdded = blocksAdded;
	}

	public get blocksRemoved(): BlocksRemoved {
		return this.#blocksRemoved;
	}

	public set blocksRemoved(blocksRemoved: BlocksRemoved) {
		isInteger(blocksRemoved).ensure();
		isPositive(blocksRemoved).ensure();

		this.#blocksRemoved = blocksRemoved;
	}
}
