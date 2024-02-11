import type { InstrumentOptions } from "../instrument/Instrument";
import type { NoteOptions } from "../note/Note";
import { Song } from "../Song";
import { Instrument } from "../instrument/Instrument";
import { Layer } from "../layer/Layer";
import { LayerNotes } from "../note/LayerNotes";
import { Note } from "../note/Note";

/**
 * Iterate and copy values from the {@linkcode JSON} object to the {@linkcode Song}.
 *
 * @param ignored Array of keys to ignore
 * @param songObject Song to copy to
 * @param object {@linkcode JSON} object to copy from
 * @category JSON
 * @internal
 */
function iterateKeys(ignored: string[], songObject: Song | object, object: object): void {
	for (const key of Object.keys(object)) {
		if (ignored.includes(key)) {
			continue;
		}

		const songType = typeof songObject[key];
		const objectType = typeof object[key];

		// Handle nested objects
		if (songType === "object" && objectType === "object") {
			iterateKeys(ignored, songObject[key], object[key]);

			continue;
		}

		// Some default song values will be undefined
		if (songType !== "undefined" && songType !== objectType) {
			continue;
		}

		songObject[key] = object[key];
	}
}

/**
 * Determine whether a key exists within the JSON object and handle it if is the correct type. Used to handle {@linkcode Song} getters.
 *
 * @param condition Condition required to continue
 * @param then Action to execute if condition is met
 * @param object {@linkcode JSON} object to compare with
 * @param key Key of the {@linkcode JSON} object to compare
 * @category JSON
 * @internal
 */
function getterIs<T>(condition: (value: unknown) => boolean, then: (value: T) => void, object: object, key: string): void {
	if (key in object && typeof object[key] === "object" && "get" in object[key]) {
		if (condition(object[key].get)) {
			then(object[key].get);
		}
	}
}

/**
 * Parse and return a {@linkcode Song} from a JSON object.
 *
 * @param json {@linkcode JSON} object to parse from
 * @returns Parsed song
 * @category Song
 * @category JSON
 */
export function fromJSON(json: object): Song {
	if (typeof json !== "object") {
		throw new Error("Provided argument is not a valid JSON object!");
	}

	const song = new Song();

	// Get all properties that are getters/setters, as we cannot know for certain how to deal with them
	const ignoredProperties: string[] = [];
	const prototype = Object.getPrototypeOf(song);
	for (const key of Object.getOwnPropertyNames(prototype)) {
		if (key === "loop" || key === "autoSave") {
			continue;
		}

		const descriptor = Object.getOwnPropertyDescriptor(song, key);
		if (descriptor && typeof descriptor.set === "function") {
			ignoredProperties.push(key);
		}
	}

	// Copy over all standard type properties
	iterateKeys(ignoredProperties, song, json);

	// Special cases where getters can be set
	if ("tempo" in json && typeof json.tempo === "number") {
		song.tempo = json.tempo;
	} else if ("timePerTick" in json && typeof json.timePerTick === "number") {
		song.timePerTick = json.timePerTick;
	}

	// Iterate every layer (if valid)
	getterIs<Layer[]>(
		Array.isArray,
		(value) => {
			for (const layer of value) {
				const songLayer = new Layer(layer);

				// Iterate every note (if valid)
				getterIs<LayerNotes>(
					(value) => {
						return typeof value === "object";
					},
					(value) => {
						for (const [id, note] of Object.entries(value)) {
							if (typeof note !== "object") {
								continue;
							}

							if (!("instrument" in note) || typeof note.instrument !== "number") {
								continue;
							}

							songLayer.notes.set(+id, new Note(note.instrument, note as NoteOptions));
						}
					},
					layer,
					"notes"
				);

				song.layers.add(songLayer);
			}
		},
		json,
		"layers"
	);

	// Iterate every instrument (if valid)
	getterIs(
		(value) => {
			return typeof value === "object";
		},
		(value) => {
			const instruments = Object.entries(value);
			if (instruments.length > Object.keys(Instrument.builtIn).length) {
				for (const [id, instrument] of instruments) {
					if (!("isBuiltIn" in instrument) || instrument.isBuiltIn === "true") {
						continue;
					}

					song.instruments.set(+id, new Instrument(instrument as InstrumentOptions));
				}
			}
		},
		json,
		"instruments"
	);

	return song;
}
