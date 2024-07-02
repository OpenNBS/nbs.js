import { Song } from "~/nbs/Song";

/**
 * Deletes all layers without notes from a {@linkcode Song}.
 *
 * @param song Song to remove empty layers from
 * @param makeClone Whether to create a clone of the song, preventing modification of the original song
 * @returns The song without empty layers (new {@linkcode Song} if cloned, original {@linkcode Song} otherwise)
 *
 * @category Internal Utilities
 * @internal
 */
export function omitEmptyLayers(song: Song, makeClone = true) {
	let workingClass = song;

	if (makeClone) {
		workingClass = Object.assign({}, song);
		Object.setPrototypeOf(workingClass, Song.prototype);
	}

	for (let i = workingClass.layers.all.length - 1; i > 0; i--) {
		if (workingClass.layers.all[i].notes.getTotal() !== 0) {
			continue;
		}

		workingClass.layers.delete(i);
	}

	return workingClass;
}
