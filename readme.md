# NBS.js
A versatile API for reading, manipulating, and writing [OpenNBS](https://opennbs.org) files.

Heavily inspired by [NBSEditor](https://github.com/TheGreatFoxxy/NBSEditor/blob/408e3e58058bd72286fc7e9740d62a39a0c919dd/src/NBS.js) and [NoteBlockAPI](https://github.com/koca2000/NoteBlockAPI).

**Note:** This API is still in early development. Writing NBS files is not yet supported. Report any bugs found!

View a live demo [here](https://encode42.github.io/NBS.js/demo/)!

### Including
**Browser**
```html
<script src="https://cdn.jsdelivr.net/gh/Encode42/NBS.js@main/dist/index.js"></script>
```

Example:
```html
<input type="file" id="file-input">

<script src="https://cdn.jsdelivr.net/gh/Encode42/NBS.js@main/dist/index.js"></script> <!-- Import NBS.js -->
<script>
    window.addEventListener("load", () => {
        // Initialize file input
        const fileInput = document.getElementById("file-input");
        fileInput.value = null;
        fileInput.addEventListener("change", async () => {
            const songFile = fileInput.files[0]; // Read a NBS file
            const buffer = await songFile.arrayBuffer(); // Create an ArrayBuffer
            const song = NBSjs.Song.fromArrayBuffer(buffer); // Parse song from ArrayBuffer
            
            console.log(song);
        });
    });
</script>
```

**Node.js**
```bash
npm i @encode42/nbs.js
```

Example:
```js
const fs = require("fs");
const { Song } = require("@encode42/nbs.js"); // Import NBS.js

const songFile = fs.readFileSync("song.nbs"); // Read a NBS file
const buffer = new Uint8Array(song).buffer; // Create an ArrayBuffer
const song = Song.fromArrayBuffer(buffer); // Parse song from ArrayBuffer

console.log(song);
```

### Building
Ensure [Yarn](https://yarnpkg.com/) and [Node.js](https://nodejs.org/en/) are installed.

1. Enter the directory containing the NBS.js source code in a terminal window.
2. Run `yarn run build` to generate the Node.js module and webpack bundle.
