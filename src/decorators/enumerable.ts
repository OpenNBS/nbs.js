/**
 * Context for {@linkcode enumerable}.
 *
 * @category Internal Utilities
 * @internal
 */
export interface GetterDecoratorContext {
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
 * Sets a property's getter to be enumerable.
 *
 * @category Internal Utilities
 * @internal
 */
export function enumerable<T>(getFunction: () => T, { name, addInitializer }: GetterDecoratorContext): () => T {
	addInitializer(function (this: unknown) {
		const descriptor = Object.getOwnPropertyDescriptor(this, name) ?? Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), name);

		Object.defineProperty(this, name, {
			...descriptor,
			"enumerable": true
		});
	});

	return getFunction;
}
