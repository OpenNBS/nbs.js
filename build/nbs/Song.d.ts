import Layer from "./Layer";
export default class Song {
    /**
     * Size of the song.
     */
    size: number;
    /**
     * Name of the song.
     */
    name: string;
    /**
     * Author of the song.
     */
    author: string;
    /**
     * Original author of the song.
     */
    originalAuthor: string;
    /**
     * Description of the song.
     */
    description: string;
    /**
     * Name of the imported MIDI file.
     */
    midiName: string;
    /**
     * Tempo of the song.
     */
    tempo: number;
    /**
     * Time signature of the song.
     */
    timeSignature: number;
    /**
     * Whether looping is enabled.
     */
    loopEnabled: boolean;
    /**
     * Maximum times to loop the song.
     */
    maxLoopCount: number;
    /**
     * Which tick to loop the song on.
     */
    loopStartTick: number;
    /**
     * Whether auto-save is enabled.
     */
    autoSaveEnabled: boolean;
    /**
     * Duration of minutes between auto-saves.
     */
    autoSaveDuration: number;
    /**
     * Minutes spent with the song open.
     */
    minutesSpent: number;
    /**
     * Times the song has received left-clicks.
     */
    leftClicks: number;
    /**
     * Times the song has received right-clicks.
     */
    rightClicks: number;
    /**
     * Total amount of blocks added.
     */
    blocksAdded: number;
    /**
     * Total amount of blocks removed
     */
    blocksRemoved: number;
    /**
     * Version of NBS the song has been saved to.
     */
    nbsVersion: number;
    /**
     * Layers within the song.
     */
    layers: Layer[];
    /**
     * Instruments of the song.
     */
    get instruments(): any;
    /**
     * Amount of milliseconds each tick takes.
     */
    get timePerTick(): number;
    /**
     * Length of the song in milliseconds.
     */
    get endTime(): number;
    /**
     * Create and add a new layer.
     */
    addLayer(): Layer;
    /**
     * Delete a layer from the song.
     * @param layer Layer to delete.
     */
    deleteLayer(layer: Layer): void;
    /**
     * Parse a song from an array buffer.
     * @param arrayBuffer ArrayBuffer to parse from
     */
    static fromArrayBuffer(arrayBuffer: ArrayBuffer): Song;
}
