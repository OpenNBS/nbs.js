import fs from "fs";
import { fromArrayBuffer } from "../../src";

/**
 * Options for the test results.
 */
interface TestOptions {
    /**
     * The version of the song.
     */
    "version": number,

    /**
     * The length of the song.
     */
    "length": number,

    /**
     * The amount of instruments in the song.
     */
    "instruments": number,

    /**
     * The amount of layers in the song.
     */
    "layers": number,

    /**
     * The tempo of the song.
     */
    "tempo": number,

    /**
     * The last measure of the song.
     */
    "lastMeasure": number | undefined
}

test("Read song from file", () => {
    const songFile = fs.readFileSync("tests/sample/test.nbs");
    const buffer = new Uint8Array(songFile).buffer;
    const song = fromArrayBuffer(buffer, {
        "ignoreEmptyLayers": true
    });

    const input: TestOptions = {
        "version": song.nbsVersion,
        "length": song.length,
        "instruments": song.instruments.loaded.length,
        "layers": song.layers.length,
        "tempo": song.tempo,
        "lastMeasure": song.stats.lastMeasure
    };

    const target: TestOptions = {
        "version": 5,
        "length": 12,
        "instruments": 16,
        "layers": 5,
        "tempo": 7.5,
        "lastMeasure": 12
    };

    expect(input).toStrictEqual(target);
});
