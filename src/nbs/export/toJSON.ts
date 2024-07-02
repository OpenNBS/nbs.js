import type { SongInstruments } from "~/nbs/instrument/SongInstruments";
import type { SongLayers } from "~/nbs/layer/SongLayers";
import type { Song, SongAutoSave, SongLoop } from "~/nbs/Song";

/**
 * Structure for {@linkcode ignoredValues}.
 *
 * @category JSON
 * @internal
 */
export interface IgnoredValues {
	/**
	 * Key to ignore if equal to value.
	 */
	[key: string]: unknown;
}

/**
 * A {@linkcode Song} represented by basic JSON notation.
 *
 * @category Song
 * @category JSON
 */
export interface SongObject {
	/**
	 * {@inheritDoc Song#getLength}
	 */
	"length": number;

	/**
	 * {@inheritDoc Song#version}
	 */
	"version": number;

	/**
	 * {@inheritDoc Song#name}
	 */
	"name"?: string;

	/**
	 * {@inheritDoc Song#author}
	 */
	"author"?: string;

	/**
	 * {@inheritDoc Song#originalAuthor}
	 */
	"originalAuthor"?: string;

	/**
	 * {@inheritDoc Song#description}
	 */
	"description"?: string;

	/**
	 * {@inheritDoc Song#importName}
	 */
	"importName"?: string;

	/**
	 * {@inheritDoc Song#loop}
	 */
	"loop": SongLoop;

	/**
	 * {@inheritDoc Song#autoSave}
	 */
	"autoSave": SongAutoSave;

	/**
	 * {@inheritDoc Song#minutesSpent}
	 */
	"minutesSpent": number;

	/**
	 * {@inheritDoc Song#leftClicks}
	 */
	"leftClicks": number;

	/**
	 * {@inheritDoc Song#rightClicks}
	 */
	"rightClicks": number;

	/**
	 * {@inheritDoc Song#blocksAdded}
	 */
	"blocksAdded": number;

	/**
	 * {@inheritDoc Song#blocksRemoved}
	 */
	"blocksRemoved": number;

	/**
	 * {@inheritDoc Song#getDuration}
	 */
	"duration": number;

	/**
	 * {@inheritDoc Song#getLastMeasure}
	 */
	"lastMeasure": number;

	/**
	 * {@inheritDoc Song#timeSignature}
	 */
	"timeSignature": number;

	/**
	 * {@inheritDoc Song#getTempo}
	 */
	"tempo": number;

	/**
	 * {@inheritDoc Song#getTimePerTick}
	 */
	"timePerTick": number;

	/**
	 * {@inheritDoc Song#hasSolo}
	 */
	"hasSolo": boolean;

	/**
	 * {@inheritDoc Song#instruments}
	 */
	"instruments": SongInstruments; // TODO: Convert these into unique objects

	/**
	 * {@inheritDoc Song#getLength}
	 */
	"layers": SongLayers; // TODO: Convert these into unique objects
}

/**
 * Values that will be ignored during export if matched.
 *
 * @category JSON
 * @internal
 */
export const ignoredValues: IgnoredValues = {
	"pressKey": false,
	"isLocked": false,
	"isSolo": false,
	"volume": 0,
	"stereo": 0,
	"velocity": 100,
	"panning": 0,
	"pitch": 0,
	"isBuiltIn": true
} as const;

/**
 * Generate a {@linkcode JSON} object from a {@linkcode Song}.
 *
 * @see **Currently untested!**
 *
 * @param song Song to parse from
 * @returns Generated {@linkcode JSON} object
 *
 * @includeExample ./examples/full/toJSON.ts
 * @category JSON
 */
export function toJSON(song: Song): object {
	const workingClass = song; //omitEmptyLayers(song);

	const songObject: SongObject = {
		...workingClass,
		"length": workingClass.getLength(),
		"duration": workingClass.getDuration(),
		"lastMeasure": workingClass.getLastMeasure(),
		"tempo": workingClass.getTempo(),
		"timePerTick": workingClass.getTimePerTick(),
		"hasSolo": workingClass.hasSolo()
	};

	return JSON.parse(
		JSON.stringify(songObject, (key, value) => {
			if (ignoredValues[key] !== undefined) {
				if (value === ignoredValues[key]) {
					return;
				}
			}

			// TODO: Hide defaults: instrument key, hasSolo

			return value;
		})
	);
}
