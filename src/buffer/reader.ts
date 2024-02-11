import { BufferWrapper } from "./wrapper";

/**
 * Represents an {@linkcode ArrayBuffer} reader.
 *
 * @category Internal Utilities
 * @internal
 */
export class BufferReader extends BufferWrapper {
	/**
	 * Read the next byte.
	 */
	public readByte(): number {
		const result = this.viewer.getInt8(this.nextByte);
		this.nextByte += 1;
		return result;
	}

	/**
	 * Read the next unsigned byte.
	 */
	public readUnsingedByte(): number {
		const result = this.viewer.getUint8(this.nextByte);
		this.nextByte += 1;
		return result;
	}

	/**
	 * Read the next short.
	 */
	public readShort(): number {
		const result = this.viewer.getInt16(this.nextByte, true);
		this.nextByte += 2;
		return result;
	}

	/**
	 * Read the next integer.
	 */
	public readInt(): number {
		const result = this.viewer.getInt32(this.nextByte, true);
		this.nextByte += 4;
		return result;
	}

	/**
	 * Read the next string.
	 */
	public readString(): string {
		const length = this.readInt();
		let result = "";
		for (let i = 0; i < length; i++) {
			const byte = this.readUnsingedByte();
			result += String.fromCodePoint(byte);
		}
		return result;
	}
}
