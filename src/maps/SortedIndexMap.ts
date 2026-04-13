export class SortedIndexMap<Key extends number, Value> extends Map<Key, Value> {
	#isDirty: boolean = false;
	#cachedKeys: Key[] = [];

	#sortKeys(): Key[] {
		if (this.#isDirty) {
			this.#cachedKeys = super
				.keys()
				.toArray()
				.sort((a, b) => a - b);

			this.#isDirty = false;
		}

		return this.#cachedKeys;
	}

	#clearCachedKeys(): void {
		this.#isDirty = true;
	}

	public clear(): void {
		this.#clearCachedKeys();

		super.clear();
	}

	public delete(key: Key): boolean {
		this.#clearCachedKeys();

		return super.delete(key);
	}

	public move(sourceKey: Key, destinationKey: Key): boolean {
		if (!super.has(sourceKey)) {
			return false;
		}

		const sourceValue = this.#getKnownValue(sourceKey);

		this.set(destinationKey, sourceValue);
		this.delete(sourceKey);

		this.#clearCachedKeys();

		return true;
	}

	public shift(sourceKey: Key, destinationKey: Key): boolean {
		if (!super.has(sourceKey)) {
			return false;
		}

		const sourceValue = this.#getKnownValue(sourceKey);

		const iteratorDirection = sourceKey < destinationKey ? 1 : -1;
		const clampedDestination = Math.min(destinationKey, super.size - 1) as Key;

		const entriesBetween = this.between(sourceKey, clampedDestination).toArray();

		const entryRange =
			iteratorDirection > 0
				? entriesBetween.slice(iteratorDirection)
				: entriesBetween.slice(0, iteratorDirection);

		let index = 0;
		for (const [_, value] of entryRange) {
			super.set((sourceKey + index++ * iteratorDirection) as Key, value);
		}

		super.set(destinationKey, sourceValue);

		if (destinationKey > clampedDestination) {
			super.delete(clampedDestination);
		}

		this.#clearCachedKeys();

		return true;
	}

	public set(key: Key, value: Value): this {
		super.set(key, value);

		this.#clearCachedKeys();

		return this;
	}

	public last(): Key {
		return this.#sortKeys().at(-1) ?? (0 as Key);
	}

	public *keys(): Generator<Key> {
		yield* this.#sortKeys();
	}

	public *values(): Generator<Value> {
		for (const key of this.#sortKeys()) {
			yield this.#getKnownValue(key);
		}
	}

	public *entries(): Generator<[Key, Value]> {
		for (const key of this.#sortKeys()) {
			yield [key, this.#getKnownValue(key)];
		}
	}

	public *between(from: Key, to: Key): ArrayIterator<[Key, Value]> {
		const start = Math.min(from, to);
		const end = Math.max(from, to) + 1;

		yield* Iterator.from(this.entries().toArray().slice(start, end));
	}

	public *[Symbol.iterator](): MapIterator<[Key, Value]> {
		yield* this.entries();
	}

	#getKnownValue(key: Key): Value {
		const value = super.get(key);

		if (value === undefined) {
			throw `Value at key "${key}" is undefined`;
		}

		return value;
	}
}
