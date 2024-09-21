import { writeFileSync } from "node:fs";
import { Song, toArrayBuffer } from "@nbsjs/core";

const song = new Song();

// ...do what you need with the song

const exportedBuffer = toArrayBuffer(song, {
	"ignoreEmptyLayers": true
});

writeFileSync("output.nbs", new Uint8Array(exportedBuffer));
