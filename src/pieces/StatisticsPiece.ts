import { isInteger } from "~/validators/isInteger";
import { isPositive } from "~/validators/isPositive";

export type StatisticsMinutesSpent = number;
export type StatisticsLeftClicks = number;
export type StatisticsRightClicks = number;
export type StatisticsBlocksAdded = number;
export type StatisticsBlocksRemoved = number;

export class StatisticsPiece {
	public static get DEFAULT_MINUTES_SPENT(): StatisticsMinutesSpent {
		return 0;
	}

	public static get DEFAULT_LEFT_CLICKS(): StatisticsLeftClicks {
		return 0;
	}

	public static get DEFAULT_RIGHT_CLICKS(): StatisticsRightClicks {
		return 0;
	}

	public static get DEFAULT_BLOCKS_ADDED(): StatisticsBlocksAdded {
		return 0;
	}

	public static get DEFAULT_BLOCKS_REMOVED(): StatisticsBlocksRemoved {
		return 0;
	}

	#minutesSpent: StatisticsMinutesSpent = StatisticsPiece.DEFAULT_MINUTES_SPENT;
	#leftClicks: StatisticsLeftClicks = StatisticsPiece.DEFAULT_LEFT_CLICKS;
	#rightClicks: StatisticsRightClicks = StatisticsPiece.DEFAULT_RIGHT_CLICKS;
	#blocksAdded: StatisticsBlocksAdded = StatisticsPiece.DEFAULT_BLOCKS_ADDED;
	#blocksRemoved: StatisticsBlocksRemoved = StatisticsPiece.DEFAULT_BLOCKS_REMOVED;

	public get minutesSpent(): StatisticsMinutesSpent {
		return this.#minutesSpent;
	}

	public set minutesSpent(minutesSpent: StatisticsMinutesSpent) {
		isInteger(minutesSpent).ensure();
		isPositive(minutesSpent).ensure();

		this.#minutesSpent = minutesSpent;
	}

	public get leftClicks(): StatisticsLeftClicks {
		return this.#leftClicks;
	}

	public set leftClicks(leftClicks: StatisticsLeftClicks) {
		isInteger(leftClicks).ensure();
		isPositive(leftClicks).ensure();

		this.#leftClicks = leftClicks;
	}

	public get rightClicks(): StatisticsRightClicks {
		return this.#rightClicks;
	}

	public set rightClicks(rightClicks: StatisticsRightClicks) {
		isInteger(rightClicks).ensure();
		isPositive(rightClicks).ensure();

		this.#rightClicks = rightClicks;
	}

	public get blocksAdded(): StatisticsBlocksAdded {
		return this.#blocksAdded;
	}

	public set blocksAdded(blocksAdded: StatisticsBlocksAdded) {
		isInteger(blocksAdded).ensure();
		isPositive(blocksAdded).ensure();

		this.#blocksAdded = blocksAdded;
	}

	public get blocksRemoved(): StatisticsBlocksRemoved {
		return this.#blocksRemoved;
	}

	public set blocksRemoved(blocksRemoved: StatisticsBlocksRemoved) {
		isInteger(blocksRemoved).ensure();
		isPositive(blocksRemoved).ensure();

		this.#blocksRemoved = blocksRemoved;
	}
}
