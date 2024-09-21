import { readFileSync } from "node:fs";
import { fromArrayBuffer } from "@nbsjs/core";

// Read a NBS file named "song.nbs"
const originalFile = readFileSync("song.nbs");
const originalBuffer = new Uint8Array(originalFile).buffer;
const song = fromArrayBuffer(originalBuffer);

console.dir(song); // Here's ya song!
