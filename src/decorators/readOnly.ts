import { IllegalSetError } from "../errors/IllegalSetError";

/**
 * Context for {@linkcode readOnly}.
 *
 * @category Internal Utilities
 * @internal
 */
export interface SetterDecoratorContext {
	/**
	 * Name of the property.
	 */
	"name": string | symbol;

	/**
	 * Type of the property.
	 */
	"kind": "getter";

	/**
	 * Function applied upon the property.
	 */
	addInitializer(initializer: () => void): void;
}

/**
 * Sets a getter's setter function to throw an error, preventing modification.
 *
 * @category Internal Utilities
 * @internal
 */
export function readOnly<T>(getFunction: () => T, { name, addInitializer }: SetterDecoratorContext): () => T {
	addInitializer(function (this: unknown) {
		const descriptor = Object.getOwnPropertyDescriptor(this, name) ?? Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), name);

		Object.defineProperty(this, name, {
			...descriptor,
			"set": () => {
				throw new IllegalSetError(name.toString());
			}
		});
	});

	return getFunction;
}
