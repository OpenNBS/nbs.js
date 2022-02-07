/**
 * Statistics available for a {@linkcode Song}.
 *
 * Note: None of these values automatically increment. Functionality is implementation-dependant.
 */
export default interface SongStats {
    /**
     * Amount of minutes spent on the song.
     */
    "minutesSpent": number,

    /**
     * Amount of times the user has left-clicked on the song.
     */
    "leftClicks": number,

    /**
     * Amount of times the user has right-clicked on the song.
     */
    "rightClicks": number,

    /**
     * Amount of times the user has added a note block.
     */
    "blocksAdded": number,

    /**
     * The amount of times the user have removed a note block.
     */
    "blocksRemoved": number,

    /**
     * Playtime of the song in milliseconds.
     */
    "duration": number,

    /**
     * Whether the song has at least one solo layer.
     *
     * @see {@linkcode Layer.isSolo}
     */
    "hasSolo": boolean
};

/**
 * Default {@linkcode SongStats} values.
 */
export const defaultSongStats: SongStats = {
    "minutesSpent": 0,
    "leftClicks": 0,
    "rightClicks": 0,
    "blocksAdded": 0,
    "blocksRemoved": 0,
    "duration": 0,
    "hasSolo": false
};
