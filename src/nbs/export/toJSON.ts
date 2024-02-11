import { omitEmptyLayers } from "../../util/omitEmptyLayers";
import { Song } from "../Song";

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
 * @param song Song to parse from
 * @returns Generated {@linkcode JSON} object
 * @includeExample ./examples/full/toJSON.ts
 * @category JSON
 */
export function toJSON(song: Song): object {
	const workingClass = omitEmptyLayers(song);

	return JSON.parse(
		JSON.stringify(workingClass, (key, value) => {
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
