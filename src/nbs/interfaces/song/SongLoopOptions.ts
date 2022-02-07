/**
 * Options available for {@linkcode Song} looping.
 */
export default interface SongLoopOptions {
    /**
     * Whether looping is enabled.
     */
    "enabled": boolean,

    /**
     * Determines which part of the song (in ticks) it loops back to.
     */
    "startTick": number,

    /**
     * The amount of times the song loops. (0 = infinite)
     */
    "totalLoops": number
};

/**
 * Default {@linkcode SongLoopOptions} values.
 */
export const defaultLoopOptions: SongLoopOptions = {
    "enabled": false,
    "startTick": 0,
    "totalLoops": 0
};
