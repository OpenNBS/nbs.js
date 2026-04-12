import type { Note } from "~/notes/Note";
import type { ParentLayer, ParentSong } from "~/types/initialized/Parent";

import { SortedIndexMap } from "~/maps/SortedIndexMap";
import { InitializedNote } from "~/notes/InitializedNote";
import { InitializedNoteBuilder } from "~/notes/InitializedNoteBuilder";
import { isInteger } from "~/validators/isInteger";
import { isPositive } from "~/validators/isPositive";

export type LayerNote = InitializedNote;
export type LayerNoteTick = number | -1;

export type UpdateStatistics = boolean;

type LayerNotesKey = LayerNoteTick;
type LayerNotesValue = LayerNote;
type LayerNotesEntry = [LayerNoteTick, LayerNote];

export class SongLayerNotes {
	public static get DEFAULT_UPDATE_STATISTICS(): UpdateStatistics {
		return true;
	}

	readonly #song: ParentSong;
	readonly #layer: ParentLayer;

	readonly #map: SortedIndexMap<LayerNotesKey, LayerNotesValue> = new SortedIndexMap();

	public constructor(song: ParentSong, layer: ParentLayer) {
		this.#song = song;
		this.#layer = layer;
	}

	public get total(): number {
		return this.#map.size;
	}

	public at(tick: LayerNoteTick): LayerNote | undefined {
		if (tick === -1) {
			const lastTick = this.#map.last();

			return this.#map.get(lastTick);
		}

		isInteger(tick).ensure();
		isPositive(tick).ensure();

		return this.#map.get(tick);
	}

	public last(): LayerNoteTick {
		return this.#map.last();
	}

	public has(tick: LayerNoteTick): boolean {
		return this.#map.has(tick);
	}

	public move(sourceTick: LayerNoteTick, destinationTick: LayerNoteTick): boolean {
		this.#layer.checkMutable().ensure();

		if (!this.#map.has(sourceTick)) {
			throw `Source note tick "${sourceTick}" does not exist`;
		}

		isInteger(destinationTick).ensure();
		isPositive(destinationTick).ensure();

		return this.#map.move(sourceTick, destinationTick);
	}

	public set(
		tick: LayerNoteTick,
		note: LayerNote,
		updateStatistics: UpdateStatistics = SongLayerNotes.DEFAULT_UPDATE_STATISTICS
	): this {
		this.#layer.checkMutable().ensure();

		if (tick === -1) {
			tick = this.#map.last();
		} else {
			isInteger(tick).ensure();
			isPositive(tick).ensure();
		}

		if (updateStatistics) {
			this.#song.statistics.blocksAdded++;
		}

		this.#map.set(tick, note);

		return this;
	}

	public add(
		note: LayerNote,
		updateStatistics: UpdateStatistics = SongLayerNotes.DEFAULT_UPDATE_STATISTICS
	): LayerNoteTick {
		const position = this.#map.size === 0 ? 0 : this.#map.last() + 1;

		this.set(position, note, updateStatistics);

		return position;
	}

	public register(note: Note): LayerNote {
		return InitializedNote.from(this.#song, this.#layer, note);
	}

	public delete(
		tick: LayerNoteTick,
		updateStatistics: UpdateStatistics = SongLayerNotes.DEFAULT_UPDATE_STATISTICS
	): boolean {
		this.#layer.checkMutable().ensure();

		if (updateStatistics) {
			this.#song.statistics.blocksRemoved++;
		}

		return this.#map.delete(tick);
	}

	public clear(
		updateStatistics: UpdateStatistics = SongLayerNotes.DEFAULT_UPDATE_STATISTICS
	): void {
		this.#layer.checkMutable().ensure();

		if (updateStatistics) {
			this.#song.statistics.blocksRemoved += this.total;
		}

		this.#map.clear();
	}

	public *keys(): Generator<LayerNoteTick> {
		yield* this.#map.keys();
	}

	public *values(): Generator<LayerNote> {
		yield* this.#map.values();
	}

	public *entries(): Generator<LayerNotesEntry> {
		yield* this.#map.entries();
	}

	public *between(from: LayerNoteTick, to: LayerNoteTick): ArrayIterator<LayerNotesEntry> {
		yield* this.#map.between(from, to);
	}

	public *[Symbol.iterator](): MapIterator<LayerNotesEntry> {
		yield* this.#map[Symbol.iterator]();
	}

	public builder(): InitializedNoteBuilder {
		return new InitializedNoteBuilder(this.#song, this.#layer, this);
	}
}
