"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util/util");
class Song {
    constructor() {
        /**
         * Size of the song.
         */
        this.size = 0;
        /**
         * Name of the song.
         */
        this.name = "";
        /**
         * Author of the song.
         */
        this.author = "";
        /**
         * Original author of the song.
         */
        this.originalAuthor = "";
        /**
         * Description of the song.
         */
        this.description = "";
        /**
         * Name of the imported MIDI file.
         */
        this.midiName = "";
        /**
         * Tempo of the song.
         */
        this.tempo = 5;
        /**
         * Time signature of the song.
         */
        this.timeSignature = 4;
        /**
         * Whether looping is enabled.
         */
        this.loopEnabled = false;
        /**
         * Maximum times to loop the song.
         */
        this.maxLoopCount = 0;
        /**
         * Which tick to loop the song on.
         */
        this.loopStartTick = 0;
        /**
         * Whether auto-save is enabled.
         */
        this.autoSaveEnabled = false;
        /**
         * Duration of minutes between auto-saves.
         */
        this.autoSaveDuration = 5;
        /**
         * Minutes spent with the song open.
         */
        this.minutesSpent = 0;
        /**
         * Times the song has received left-clicks.
         */
        this.leftClicks = 0;
        /**
         * Times the song has received right-clicks.
         */
        this.rightClicks = 0;
        /**
         * Total amount of blocks added.
         */
        this.blocksAdded = 0;
        /**
         * Total amount of blocks removed
         */
        this.blocksRemoved = 0;
        /**
         * Version of NBS the song has been saved to.
         */
        this.nbsVersion = 0;
        /**
         * Layers within the song.
         */
        this.layers = [];
    }
    /**
     * Instruments of the song.
     */
    get instruments() {
        return (0, util_1.getInstrumentClass)().builtIn;
    }
    /**
     * Amount of milliseconds each tick takes.
     */
    get timePerTick() {
        return 20 / this.tempo * 50;
    }
    /**
     * Length of the song in milliseconds.
     */
    get endTime() {
        return this.size * this.timePerTick;
    }
    /**
     * Create and add a new layer.
     */
    addLayer() {
        const layer = new ((0, util_1.getLayerClass)())(this, this.layers.length + 1);
        this.layers.push(layer);
        return layer;
    }
    /**
     * Delete a layer from the song.
     * @param layer Layer to delete.
     */
    deleteLayer(layer) {
        this.layers.splice(this.layers.indexOf(layer), 1);
    }
    /**
     * Parse a song from an array buffer.
     * @param arrayBuffer ArrayBuffer to parse from
     */
    static fromArrayBuffer(arrayBuffer) {
        const song = new this();
        const reader = new util_1.BufferReader(arrayBuffer);
        let size = reader.readShort(); // Read song size
        // Check if NBS file is ONBS versioned
        if (size === 0) {
            song.nbsVersion = reader.readByte(); // Read NBS version
            reader.readByte(); // Read first custom instrument
            if (song.nbsVersion >= 3) {
                size = reader.readShort(); // Read real song size
            }
        }
        const totalLayers = reader.readShort(); // Read total amount of layers
        song.name = reader.readString(); // Read song name
        song.author = reader.readString(); // Read song author
        song.originalAuthor = reader.readString(); // Read song original author
        song.description = reader.readString(); // Read song description
        song.tempo = reader.readShort() / 100; // Read song tempo
        song.autoSaveEnabled = Boolean(reader.readByte()); // Read song auto-save status
        song.autoSaveDuration = reader.readByte(); // Read song auto-save interval
        song.timeSignature = reader.readByte(); // Read song time signature
        song.minutesSpent = reader.readInt(); // Read minutes spent in song
        song.leftClicks = reader.readInt(); // Read left-clicks on song
        song.rightClicks = reader.readInt(); // Read right-clicks on song
        song.blocksAdded = reader.readInt(); // Read total blocks added to song
        song.blocksRemoved = reader.readInt(); // Read total blocks removed from song
        song.midiName = reader.readString(); // Read imported MIDI file name
        if (song.nbsVersion >= 4) {
            song.loopEnabled = Boolean(reader.readByte()); // Read loop status
            song.maxLoopCount = reader.readByte(); // Read maximum loop count
            song.loopStartTick = reader.readShort(); // Read loop start tick
        }
        // Read layer and note data
        const rawNotes = [];
        let tick = -1;
        while (true) {
            // Jump to the next tick
            const jumpTicks = reader.readShort(); // Read amount of ticks to jump
            if (jumpTicks === 0) {
                break;
            }
            tick += jumpTicks;
            let layer = -1;
            while (true) {
                // Jump to the next layer
                const jumpLayers = reader.readShort(); // Read amount of layers to jump
                if (jumpLayers === 0) {
                    break;
                }
                layer += jumpLayers;
                // Get note at tick
                const instrument = reader.readByte(); // Read instrument of note
                const key = reader.readByte(); // Read key of note
                let velocity = 100;
                let panning = 100;
                let pitch = 0;
                if (song.nbsVersion >= 4) {
                    velocity = reader.readByte(); // Read velocity of note
                    panning = reader.readUnsingedByte() - 200; // Read panning of note
                    pitch = reader.readShort(); // Read pitch of note
                }
                // Push the note data to raw notes array
                rawNotes.push({
                    "instrument": instrument,
                    "key": key,
                    "velocity": velocity,
                    "panning": panning,
                    "pitch": pitch,
                    "layer": layer,
                    "tick": tick
                });
            }
        }
        // Guess song size for ONBS versions without size byte
        if (song.nbsVersion > 0 && song.nbsVersion < 3) {
            size = tick;
        }
        song.size = size;
        // Add layers to song
        if (arrayBuffer.byteLength > reader.currentByte) {
            for (let i = 0; i < totalLayers; i++) {
                const layer = song.addLayer();
                layer.name = reader.readString(); // Read layer name
                if (song.nbsVersion >= 4) {
                    layer.locked = Boolean(reader.readByte()); // Read layer lock status
                }
                layer.velocity = reader.readByte(); // Read layer velocity
                let panning = 100;
                if (song.nbsVersion >= 2) {
                    panning = reader.readUnsingedByte() - 200; // Read layer panning
                }
                layer.panning = panning;
            }
        }
        // Parse custom instruments
        const customInstruments = reader.readByte(); // Read number of custom instruments
        for (let i = 0; i < customInstruments; i++) {
            song.instruments.push(new ((0, util_1.getInstrumentClass)())(reader.readString(), // Read instrument name
            song.instruments.length, {
                "audioSrc": reader.readString(),
                "pitch": reader.readByte(),
                "key": reader.readByte() // Read instrument key
            }));
        }
        // Parse notes
        for (const rawNote of rawNotes) {
            // Create layer if non-existent
            if (rawNote.layer >= song.layers.length) {
                song.addLayer();
            }
            // Add note to layer
            const layer = song.layers[rawNote.layer];
            layer.setNote(rawNote.tick, rawNote.key, rawNote.panning, rawNote.velocity, rawNote.pitch, song.instruments[rawNote.instrument]);
        }
        return song;
    }
}
exports.default = Song;
