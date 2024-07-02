[Docs]: https://encode42.github.io/nbs.js/docs/

[Docs Badge]: https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/cozy/documentation/ghpages_vector.svg

[NPM]: https://www.npmjs.com/package/@encode42/nbs.js

[NPM Badge]: https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/cozy/available/npm_vector.svg

[Support]: https://encode42.dev/support

[Support Badge]: https://cdn.jsdelivr.net/npm/@intergrav/devins-badges@3/assets/cozy/social/discord-plural_vector.svg

[Changelog]: changelog.md

<img src=".github/assets/badge-lq.png" align="right" id="header">

# nbs.js
### Robust API for reading, manipulating, and writing [OpenNBS](https://opennbs.org) files, inspired by [NBSEditor](https://github.com/TheGreatFoxxy/NBSEditor/blob/408e3e58058bd72286fc7e9740d62a39a0c919dd/src/nbs.js) and [NBS4j](https://github.com/koca2000/NBS4j).

*It's cleanroom, too! No required dependencies!*

[![NPM Badge]][NPM] [![Docs Badge]][Docs] [![][Support Badge]][Support]

### 🔧 Including
> [!IMPORTANT]  
> This library does not bundle CommonJS modules. Legacy Node.js applications may not be compatible.

> [!TIP]
> When linking to `esm.run`, it's recommended to use a version! (e.g. `@encode42/nbs.js@6.0.0`)

#### 🟢 Node.js
Add the [`@encode42/nbs.js` package][NPM] using the package manager of your choice.

```js
import { Song } from "@encode42/nbs.js";
```

#### 🌐 Browser
```html

<script type="module">
	import { Song } from "https://esm.run/@encode42/nbs.js";
</script>
```

#### 🦕 Deno
```js
import { Song } from "https://esm.run/@encode42/nbs.js";
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
🟢 Node.js
</summary>

```js
import { readFileSync } from "node:fs";
import { fromArrayBuffer } from "@encode42/nbs.js";

const songFile = readFileSync("song.nbs"); // Read the selected NBS file
const buffer = new Uint8Array(songFile).buffer; // Convert it into an ArrayBuffer
const song = fromArrayBuffer(buffer); // Parse the buffer

console.dir(song);
```
</details>

<details>
<summary>
🌐 Browser
</summary>

```html
<input type="file" id="file-input">

<script type="module">
	import { fromArrayBuffer } from "https://esm.run/@encode42/nbs.js"

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
</script>
```
</details>

<details>
<summary>
🦕 Deno
</summary>

```js
import { fromArrayBuffer } from "https://esm.run/@encode42/nbs.js";

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

Currently, a website to demonstrate usage of the library does not exist. However, this repository contains [tests](/tests) that could be used as examples, and [actual examples designed for Node.js and similar](/examples).
</details>

<details>
<summary>
<b>Where's the changelog?</b>
</summary>

I don't create GitHub releases, but I do keep a changelog [here][Changelog]!
</details>

### 🔨 Building
Ensure that [Bun](https://bun.sh) is installed.

1. Enter the directory containing the nbs.js source code in your terminal.
2. Install the build dependencies via `bun install`.
3. Run `bun run build` to bundle the ESM module.

Generated files:
- `dist/*.js`: Bundled ESM files for Node.js and related
- `dist/*.d.ts`: Generated TypeScript type bundle
- `public/docs/*`: Generated web-based documentation
