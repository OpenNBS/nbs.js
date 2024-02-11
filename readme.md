[Docs]: https://encode42.github.io/nbs.js/docs/
[Docs Badge]: https://img.shields.io/badge/Docs-3178C6?labelColor=3178C6&logo=typescript&logoColor=white&style=flat-square
[NPM]: https://www.npmjs.com/package/@encode42/nbs.js
[NPM Badge]: https://img.shields.io/npm/v/@encode42/nbs.js?label=​&color=cb0000&labelColor=cb0000&logo=npm&logoColor=white&style=flat-square
[Changelog]: changelog.md
[Demo]: https://encode42.dev/nbs
[Demo Badge]: https://img.shields.io/badge/Demo-202b38?labelColor=202b38&logo=svelte&logoColor=white&style=flat-square
[Actions]: https://github.com/encode42/nbs.js/actions/workflows/build.yml
[Actions Badge]: https://img.shields.io/github/actions/workflow/status/encode42/nbs.js/build.yml?style=flat-square
[Support]: https://encode42.dev/support
[Support Badge]: https://img.shields.io/discord/646517284453613578?color=7289da&labelColor=7289da&label=​&logo=discord&logoColor=white&style=flat-square
[Codacy]: https://app.codacy.com/gh/encode42/nbs.js/dashboard
[Codacy Badge]: https://img.shields.io/codacy/grade/68f12c67186549b88ab7ada56ac83efc?color=172B4D&labelColor=172B4D&label=​&logo=codacy&style=flat-square

<img src=".github/assets/badge-lq.png" align="right" id="header">

# nbs.js
### Robust API for reading, manipulating, and writing [OpenNBS](https://opennbs.org) files, inspired by [NBSEditor](https://github.com/TheGreatFoxxy/NBSEditor/blob/408e3e58058bd72286fc7e9740d62a39a0c919dd/src/nbs.js) and [NBS4j](https://github.com/koca2000/NBS4j).

*It's cleanroom, too! No required dependencies!*

[![Demo Badge]][Demo] [![Docs Badge]][Docs] [![NPM Badge]][NPM]  
[![][Actions Badge]][Actions] [![][Codacy Badge]][Codacy] [![][Support Badge]][Support]

### 🔧 Including
> [!TIP]
> When using `jsdelivr` links, it's recommended to use versioned links! (e.g. `@encode42/nbs.js@3.0.0`)

> [!WARNING]  
> 3.0.0 is not the latest version of nbs.js! The above is just an example.

#### 🌐 Browser
```html
<script src="https://cdn.jsdelivr.net/npm/@encode42/nbs.js"></script>
```
<sub>Minified: https://cdn.jsdelivr.net/npm/@encode42/nbs.js/dist/umd.min.js</sub>

#### 🦕 Module & Deno
```js
import { Song } from "https://cdn.jsdelivr.net/npm/@encode42/nbs.js/dist/esm.js";
```
<sub>Minified: https://cdn.jsdelivr.net/npm/@encode42/nbs.js/dist/esm.min.js</sub>

#### 🟢 Node.js
Add the [`@encode42/nbs.js` package from NPM][NPM] using the package manager of your choice.

```js
import { Song } from "@encode42/nbs.js"; // ESM (TypeScript, Vite, etc.)

const { Song } = require("@encode42/nbs.js"); // CJS (vanilla Node.js)
```

### ❔ FAQ
<details>
<summary>
<b>How do I use this?</b>
</summary>

[Install nbs.js for your platform](#-including), then refer to the [documentation][Docs] and examples below.

There are more examples designed for use with Node.js in the [examples directory](/examples)!

<details>
<summary>
🌐 Browser
</summary>

> [!WARNING]  
> This likely does not currently work!

```html
<input type="file" id="file-input">

<script src="https://cdn.jsdelivr.net/npm/@encode42/nbs.js"></script> <!-- Import nbs.js -->
<script>
window.addEventListener("load", () => {
	const input = document.getElementById("file-input");

	// Initialize file input
	input.addEventListener("change", () => {
		const songFile = input.files[0]; // Read the selected NBS file
		songFile.arrayBuffer().then(buffer => { // Convert it into an ArrayBuffer
			const song = NBSjs.fromArrayBuffer(buffer); // Parse the buffer

			console.dir(song);
		});
	});
});
</script>
```
</details>

<details>
<summary>
🌐 Module
</summary>

```html
<input type="file" id="file-input">

<script src="index.js" type="module">
```

```js
import { fromArrayBuffer } from "https://cdn.jsdelivr.net/npm/@encode42/nbs.js/dist/esm.js"

window.addEventListener("load", () => {
	const input = document.getElementById("file-input");

	// Initialize file input
	input.addEventListener("change", () => {
		const songFile = input.files[0]; // Read the selected NBS file
		songFile.arrayBuffer().then(buffer => { // Convert it into an ArrayBuffer
			const song = fromArrayBuffer(buffer); // Parse the buffer

			console.dir(song);
		});
	});
});
```
</details>

<details>
<summary>
🟢 Node.js
</summary>

```js
// ESM (TypeScript, Vite, etc.)
import { readFileSync } from "node:fs";
import { fromArrayBuffer } from "@encode42/nbs.js";

// CJS (vanilla Node.js)
const { readFileSync } = require("fs");
const { fromArrayBuffer } = require("@encode42/nbs.js");

const songFile = readFileSync("song.nbs"); // Read the selected NBS file
const buffer = new Uint8Array(songFile).buffer; // Convert it into an ArrayBuffer
const song = fromArrayBuffer(buffer); // Parse the buffer

console.dir(song);
```
</details>

<details>
<summary>
🦕 Deno
</summary>

```js
import { fromArrayBuffer } from "https://cdn.jsdelivr.net/npm/@encode42/nbs.js/dist/esm.js";

const songFile = await Deno.readFile("song.nbs"); // Read the selected NBS file
const buffer = new Uint8Array(songFile).buffer; // Convert it into an ArrayBuffer
const song = fromArrayBuffer(buffer); // Parse the buffer

console.dir(song);
```
</details>
</details>

<details>
<summary>
<b>Is there a demo?</b>
</summary>

Yes! A demo site is located [here](https://encode42.dev/nbs). It serves as an example of how to read NBS files, allows you to edit the song structure, and plays the result through the browser.

This repository also contains [tests](/tests) that could be used as examples, and [examples designed for Node.js](/examples).
</details>

<details>
<summary>
<b>Where's the changelog?</b>
</summary>

I don't create GitHub releases, but I do keep a changelog [here][Changelog]!
</details>

### 🔨 Building
Ensure [PNPM](https://pnpm.io/) and [Node.js](https://nodejs.org/) are installed.

1. Enter the directory containing the nbs.js source code in your terminal.
2. Install the build dependencies via `pnpm install`.
3. Run `pnpm run build` to generate the Node.js and browser modules.

Generated files:
- `dist/cjs.js`: CommonJS bundle, used by Node.js.
- `dist/esm.js`: ES module for browser script modules.
- `dist/umd.js`: UMD bundle for browser scripts.
- `dist/*.min.js`: Minified bundle.
- `build/`: Built ES2021 files.
