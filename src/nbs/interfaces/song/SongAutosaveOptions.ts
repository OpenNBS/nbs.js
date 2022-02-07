/**
 * Options available for {@linkcode Song} auto-save.
 */
export default interface SongAutosaveOptions {
    /**
     * Whether auto-saving has been enabled.
     */
    "enabled": boolean,

    /**
     * The amount of minutes between each auto-save. (1-60)
     */
    "interval": number
};

/**
 * Default {@linkcode SongAutosaveOptions} values.
 */
export const defaultAutosaveOptions: SongAutosaveOptions = {
    "enabled": false,
    "interval": 10
};
