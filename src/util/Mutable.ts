/**
 * Removes `readonly` prefixes from an object.
 *
 * @remarks ~~Stolen~~ borrowed from {@link https://stackoverflow.com/a/58904378}
 * @category Internal Utilities
 */
export type Mutable<T> = {
	-readonly [K in keyof T]: T[K];
};
