import { Instrument } from "./instrument/Instrument";

/**
 * Options available for a {@linkcode Note}.
 */
export interface NoteOptions {
    /**
     * The key of the note block, from 0-87, where 0 is A0 and 87 is C8. 33-57 is within the 2-octave limit.
     */
    key?: number;

    /**
     * The velocity/volume of the note block, from 0% to 100%.
     */
    velocity?: number;

    /**
     * The stereo position of the note block, from 0-200. 100 is center panning.
     */
    panning?: number;

    /**
     * The fine pitch of the note block, from -32,768 to 32,767 cents (but the max in Note Block Studio is limited to -1200 and +1200). 0 is no fine-tuning. ±100 cents is a single semitone difference.
     */
    pitch?: number;
};

/**
 * Default {@linkcode NoteOptions} values.
 */
export const defaultNoteOptions: NoteOptions = {
    "key": 45,
    "velocity": 100,
    "panning": 0,
    "pitch": 0
};

export class Note {
    /**
     * Instrument ID of the note.
     */
    public instrument = 0;

    /**
     * The key of the note block, from 0-87, where 0 is A0 and 87 is C8. 33-57 is within the 2-octave limit.
     */
    public key = defaultNoteOptions.key;

    /**
     * The velocity/volume of the note block, from 0% to 100%.
     */
    public velocity = defaultNoteOptions.velocity;

    /**
     * The stereo position of the note block, from 0-200. 100 is center panning.
     */
    public panning = defaultNoteOptions.panning;

    /**
     * The fine pitch of the note block, from -32,768 to 32,767 cents (but the max in Note Block Studio is limited to -1200 and +1200). 0 is no fine-tuning. ±100 cents is a single semitone difference.
     */
    public pitch = defaultNoteOptions.pitch;

    /**
     * Construct a note.
     *
     * @param instrument Instrument of the note
     * @param options Options for the note
     */
    public constructor(instrument: Instrument | number = 0, options: NoteOptions = defaultNoteOptions) {
        // Get the passed instrument's ID
        this.instrument = typeof instrument === "number" ? instrument : instrument.id;

        // Parse options
        if (options) {
            this.key = options.key ?? defaultNoteOptions.key;
            this.velocity = options.velocity ?? defaultNoteOptions.key;
            this.panning = options.panning ?? defaultNoteOptions.panning;
            this.pitch = options.pitch ?? defaultNoteOptions.pitch;
        }
    }
}
