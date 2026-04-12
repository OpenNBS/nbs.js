/**
 * A buffer object wrapper.
 *
 * @category Internal Utilities
 * @internal
 */
export class BufferWrapper {
	public static get MIN_BYTE(): number {
		return -127;
	}

	public static get MAX_BYTE(): number {
		return 127;
	}

	public static get MIN_UNSIGNED_BYTE(): number {
		return 0;
	}

	public static get MAX_UNSIGNED_BYTE(): number {
		return 255;
	}

	public static get MIN_SHORT(): number {
		return -32767;
	}

	public static get MAX_SHORT(): number {
		return 32767;
	}

	/**
	 * Buffer that is being read.
	 */
	public readonly buffer: ArrayBufferLike;

	/**
	 * Data view for the buffer.
	 */
	protected readonly viewer: DataView;

	/**
	 * Next byte to read.
	 */
	public nextByte = 0;

	/**
	 * Create a buffer wrapper.
	 *
	 * @param buffer An existing array buffer to manipulate
	 */
	public constructor(buffer: ArrayBufferLike) {
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

		// @ts-expect-error
		this.buffer.resize(this.nextByte);

		return originalNextByte;
	}
}
