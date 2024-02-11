/**
 * An error called when a read-only property is modified.
 *
 * @category Internal Utilities
 * @internal
 */
export class IllegalSetError extends Error {
	constructor(property: string) {
		super(`Property "${property}" is read-only and cannot be modified!`);
		this.name = "IllegalSetError";
	}
}
