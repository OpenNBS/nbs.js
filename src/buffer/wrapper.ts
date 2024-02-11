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
	readonly buffer: ArrayBuffer;

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
	 * @param buffer Array buffer to read
	 */
	constructor(buffer: ArrayBuffer) {
		this.buffer = buffer;
		this.viewer = new DataView(buffer);
	}
}
