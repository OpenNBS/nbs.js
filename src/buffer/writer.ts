import { BufferWrapper } from "~/buffer/wrapper";

/**
 * Represents an {@linkcode ArrayBuffer} writer.
 *
 * @category Internal Utilities
 * @internal
 */
export class BufferWriter extends BufferWrapper {
	constructor() {
		super(
			// @ts-ignore
			new ArrayBuffer(0, {
				"maxByteLength": 2 ** 32 - 1
			})
		);
	}

	/**
	 * Write a byte.
	 */
	public writeByte(value: number | undefined = 0): void {
		this.viewer.setInt8(this.resize(1), Math.floor(value));
	}

	/**
	 * Write an unsigned byte.
	 */
	public writeUnsignedByte(value: number | undefined = 0): void {
		this.viewer.setUint8(this.resize(1), value);
	}

	/**
	 * Write a short.
	 */
	public writeShort(value: number | undefined = 0): void {
		this.viewer.setInt16(this.resize(2), value, true);
	}

	/**
	 * Write an integer.
	 */
	public writeInt(value: number | undefined = 0): void {
		this.viewer.setInt32(this.resize(4), value, true);
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
