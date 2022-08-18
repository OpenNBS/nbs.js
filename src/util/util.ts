import { Layer } from "../nbs/Layer";
import { Instrument } from "../nbs/instrument/Instrument";
import { Note } from "../nbs/Note";

/**
 * A buffer object wrapper.
 */
class Buffer {
    /**
     * The buffer that is being read.
     */
    readonly buffer: ArrayBuffer;

    /**
     * DataView for the buffer.
     */
    protected viewer: DataView;

    /**
     * Next byte to read.
     */
    public nextByte = 0;

    /**
     * Create a buffer wrapper.
     *
     * @param buffer ArrayBuffer to read
     */
    constructor(buffer: ArrayBuffer) {
        this.buffer = buffer;
        this.viewer = new DataView(buffer);
    }
}

/**
 * Represents an ArrayBuffer reader.
 */
export class BufferReader extends Buffer {
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

/**
 * Represents an ArrayBuffer writer.
 */
export class BufferWriter extends Buffer {
    /**
     * Whether to execute a dry run.
     *
     * @remarks
     * Used to find the target size of the buffer.
     */
    private readonly dry: boolean;

    /**
     * Create a buffer writer.
     *
     * @param buffer ArrayBuffer to read
     * @param dry Whether to execute a dry run
     */
    constructor(buffer: ArrayBuffer, dry = false) {
        super(buffer);

        this.dry = dry;
    }

    /**
     * Write a byte.
     *
     * @param val Value to write
     */
    public writeByte(val: number | undefined): void {
        val ??= 0;

        if (!this.dry) {
            this.viewer.setInt8(this.nextByte, Math.floor(val));
        }

        this.nextByte += 1;
    }

    /**
     * Write an unsigned byte.
     *
     * @param val Value to write
     */
    public writeUnsignedByte(val: number | undefined): void {
        val ??= 0;

        if (!this.dry) {
            this.viewer.setUint8(this.nextByte, val);
        }

        this.nextByte += 1;
    }

    /**
     * Write a short.
     *
     * @param val Value to write
     */
    public writeShort(val: number | undefined): void {
        val ??= 0;

        if (!this.dry) {
            this.viewer.setInt16(this.nextByte, val, true);
        }

        this.nextByte += 2;
    }

    /**
     * Write an integer.
     *
     * @param val Value to write
     */
    public writeInt(val: number | undefined): void {
        val ??= 0;

        if (!this.dry) {
            this.viewer.setInt32(this.nextByte, val, true);
        }

        this.nextByte += 4;
    }

    /**
     * Write a string.
     *
     * @param val Value to write
     */
    public writeString(val: string | undefined): void {
        val ??= "";

        this.writeInt(val.length);
        for (const i of val) {
            // eslint-disable-next-line unicorn/prefer-code-point
            this.writeUnsignedByte(i.charCodeAt(0));
        }
    }
}
