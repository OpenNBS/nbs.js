/**
 * Meta information for a {@linkcode Song}.
 */
export default interface SongMeta {
    /**
     * The name of the song.
     */
    name: string,

    /**
     * The author of the song.
     */
    author: string,

    /**
     * The original author of the song.
     */
    originalAuthor: string,

    /**
     * The description of the song.
     */
    description: string,

    /**
     * Imported MIDI/Schematic file name.
     *
     * If the song has been imported from a .mid or .schematic file, that file name is stored here (only the name of the file, not the path).
     */
    importName: string
};

/**
 * Default {@linkcode SongMeta} values.
 */
export const defaultSongMeta: SongMeta = {
    "name": "",
    "author": "",
    "originalAuthor": "",
    "description": "",
    "importName": ""
};
