self.importScripts("../NBS.js");

self.addEventListener("message", async event => {
    // Load the song
    const song = NBSjs.Song.fromArrayBuffer(await event.data.file.arrayBuffer());

    // Remove undefined notes and empty layers
    const newLayers = [];
    for (let i = 0; i < song.layers.length; i++) {
        const layer = song.layers[i];

        // Check for empty notes
        const newNotes = [];
        for (const note of layer.notes) {
            if (note !== undefined) {
                newNotes.push(note);
            }
        }

        layer.notes = newNotes;

        // Check for empty layers
        if (layer.notes.length > 0) {
            newLayers.push(layer);
        }
    }

    song.layers = newLayers;

    // Display the instruments first
    const data = {
        "structureText": `Instruments: ${JSON.stringify(song.instruments, null, 4)}\n\n`,
        "overviews": [[
            "NBS version",
            song.nbsVersion
        ], [
            "Song name",
            song.name
        ], [
            "Song author",
            song.author
        ], [
            "Song description",
            song.description
        ], [
            "Song tick length",
            song.size
        ], [
            "Total layers",
            song.layers.length
        ], [
            "Custom instruments",
            song.instruments.map(i => {
                if (!i.builtIn) {
                    return i.name;
                }

                return null;
            }).filter(Boolean)
                .join(", ")
        ]]
    };

    // Stringify the song structure
    const cache = [];
    data.structureText += "Song: " + JSON.stringify(song, (key, value) => {
        // Decycle the object
        if (typeof value === "object" && value !== null) {
            if (key === "instrument") {
                return `[${key} ${value.name}]`;
            }

            if (key === "song") {
                return `[this]`;
            }

            if (cache.includes(value)) {
                return `[${key}]`;
            }

            cache.push(value);
        }

        return value;
    }, 4);

    postMessage(data);
});
