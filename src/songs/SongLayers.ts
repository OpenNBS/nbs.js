import type { InitializedLayer } from "~/layers/InitializedLayer";
import type { ParentSong } from "~/types/initialized/Parent";

import { InitializedLayerBuilder } from "~/layers/InitializedLayerBuilder";
import { SortedIndexMap } from "~/maps/SortedIndexMap";
import { isInteger } from "~/validators/isInteger";
import { isPositive } from "~/validators/isPositive";

export type SongLayer = InitializedLayer;
export type SongLayerPosition = number | -1;

type SongLayerKey = SongLayerPosition;
type SongLayerValue = SongLayer;
type SongLayerEntry = [SongLayerKey, SongLayerValue];

export class SongLayers {
	readonly #song: ParentSong;

	readonly #map: SortedIndexMap<SongLayerKey, SongLayerValue> = new SortedIndexMap();

	public constructor(song: ParentSong) {
		this.#song = song;
	}

	public get total(): number {
		return this.#map.size;
	}

	public at(position: SongLayerPosition): SongLayer | undefined {
		if (position === -1) {
			position = this.#map.last();
		}

		isInteger(position).ensure();
		isPositive(position).ensure();

		return this.#map.get(position);
	}

	public has(position: SongLayerPosition): boolean {
		if (position === -1) {
			return this.#map.size !== 0;
		}

		return this.#map.has(position);
	}

	public move(sourcePosition: SongLayerPosition, destinationPosition: SongLayerPosition): boolean {
		if (sourcePosition === destinationPosition) {
			throw "Source and destination layer positions cannot match";
		}

		const sourceLayer = this.at(sourcePosition);

		if (sourceLayer === undefined) {
			throw `Source layer position "${sourcePosition}" does not exist`;
		}

		if (!sourceLayer.checkMutable().ok) {
			throw `Source layer "${sourcePosition}" is immutable`;
		}

		const destinationLayer = this.at(destinationPosition);

		if (destinationLayer !== undefined && !destinationLayer.checkMutable().ok) {
			throw `Destination layer "${destinationPosition}" is immutable`;
		}

		return this.#map.move(sourcePosition, destinationPosition);
	}

	public shift(sourcePosition: SongLayerPosition, destinationPosition: SongLayerPosition): boolean {
		const layerRange = this.#map.between(sourcePosition, destinationPosition);

		for (const [position, layer] of layerRange) {
			if (layer.checkMutable().ok) {
				continue;
			}

			throw `Layer "${position}" between shift source ${sourcePosition} and ${destinationPosition} is immutable`;
		}

		return this.#map.shift(sourcePosition, destinationPosition);
	}

	public set(position: SongLayerPosition, layer: SongLayer): void {
		if (position === -1) {
			position = this.#map.last();
		}

		isInteger(position).ensure();
		isPositive(position).ensure();

		this.#map.set(position, layer);
	}

	public add(layer: SongLayer): SongLayerPosition {
		const position = this.#map.size === 0 ? 0 : this.#map.last() + 1;

		this.set(position, layer);

		return position;
	}

	public delete(position: SongLayerPosition): boolean {
		if (position === -1) {
			position = this.#map.last();
		}

		return this.#map.delete(position);
	}

	public clear(): void {
		this.#map.clear();
	}

	public *keys(): Generator<SongLayerKey> {
		yield* this.#map.keys();
	}

	public *values(): Generator<SongLayerValue> {
		yield* this.#map.values();
	}

	public *entries(): Generator<SongLayerEntry> {
		yield* this.#map.entries();
	}

	public *between(from: SongLayerPosition, to: SongLayerPosition): ArrayIterator<SongLayerEntry> {
		yield* this.#map.between(from, to);
	}

	public *[Symbol.iterator](): MapIterator<SongLayerEntry> {
		yield* this.#map[Symbol.iterator]();
	}

	public builder(): InitializedLayerBuilder {
		return new InitializedLayerBuilder(this.#song);
	}
}
