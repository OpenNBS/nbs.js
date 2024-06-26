import { BufferWrapper } from "~/buffer/wrapper";

/**
 * Represents an {@linkcode ArrayBuffer} writer.
 *
 * @category Internal Utilities
 * @internal
 */
export class BufferWriter extends BufferWrapper {
	/**
	 * Whether to execute a dry run.
	 */
	readonly #dry: boolean;

	/**
	 * Create a buffer writer.
	 *
	 * @param buffer Array buffer to read
	 * @param dry Whether to execute a dry run, used to find the target size of the buffer
	 */
	constructor(buffer: ArrayBuffer, dry = false) {
		super(buffer);

		this.#dry = dry;
	}

	/**
	 * Write a byte.
	 */
	public writeByte(value: number | undefined = 0): void {
		if (!this.#dry) {
			this.viewer.setInt8(this.nextByte, Math.floor(value));
		}

		this.nextByte += 1;
	}

	/**
	 * Write an unsigned byte.
	 */
	public writeUnsignedByte(value: number | undefined = 0): void {
		if (!this.#dry) {
			this.viewer.setUint8(this.nextByte, value);
		}

		this.nextByte += 1;
	}

	/**
	 * Write a short.
	 */
	public writeShort(value: number | undefined = 0): void {
		if (!this.#dry) {
			this.viewer.setInt16(this.nextByte, value, true);
		}

		this.nextByte += 2;
	}

	/**
	 * Write an integer.
	 */
	public writeInt(value: number | undefined = 0): void {
		if (!this.#dry) {
			this.viewer.setInt32(this.nextByte, value, true);
		}

		this.nextByte += 4;
	}

	/**
	 * Write a string.
	 */
	public writeString(value: string | undefined = ""): void {
		this.writeInt(value.length);
		for (const i of value) {
			this.writeUnsignedByte(i.charCodeAt(0));
		}
	}
}
