/**
 * A buffer object wrapper.
 *
 * @category Internal Utilities
 * @internal
 */
export class BufferWrapper {
	/**
	 * Buffer that is being read.
	 */
	readonly buffer: ArrayBufferLike;

	/**
	 * Data view for the buffer.
	 */
	protected viewer: DataView;

	/**
	 * Next byte to read.
	 */
	public nextByte = 0;

	/**
	 * Create a buffer wrapper.
	 *
	 * @param buffer An existing array buffer to manipulate
	 */
	constructor(buffer: ArrayBufferLike) {
		this.buffer = buffer;
		this.viewer = new DataView(buffer);
	}

	/**
	 * Resize the ArrayBuffer and increment the next byte.
	 *
	 * @param by The amount of bytes to increment by
	 * @returns The byte that now has `by` bytes to write to.
	 */
	protected resize(by: number): number {
		const originalNextByte = this.nextByte;

		this.nextByte += by;

		// @ts-ignore - https://github.com/microsoft/TypeScript/issues/54636
		this.buffer.resize(this.nextByte);

		return originalNextByte;
	}
}
