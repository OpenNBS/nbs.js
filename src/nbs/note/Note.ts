/**
 * Options available for a {@linkcode Note}.
 *
 * @category Note
 */
export interface NoteOptions {
	/**
	 * {@inheritDoc Note#key}
	 */
	"key"?: number;

	/**
	 * {@inheritDoc Note#velocity}
	 */
	"velocity"?: number;

	/**
	 * {@inheritDoc Note#panning}
	 */
	"panning"?: number;

	/**
	 * {@inheritDoc Note#pitch}
	 */
	"pitch"?: number;
}

/**
 * Default {@linkcode NoteOptions} values.
 *
 * @category Note
 * @internal
 */
export const defaultNoteOptions: Required<NoteOptions> = {
	"key": 45,
	"velocity": 100,
	"panning": 0,
	"pitch": 0
};

/**
 * Represents a note.
 *
 * @includeExample ./examples/design/note.ts
 * @category Note
 */
export class Note {
	/**
	 * Instrument ID of the note.
	 */
	public instrument = 0;

	/**
	 * Key of the note block.
	 *
	 * @remarks From 0-87. 33-57 is within the 2-octave limit.
	 * @example 0 is A0 and 87 is C8.
	 */
	public key = defaultNoteOptions.key;

	/**
	 * Velocity (volume) of the note block.
	 *
	 * @remarks From 0% to 100%.
	 */
	public velocity = defaultNoteOptions.velocity;

	/**
	 * Stereo position of the note block.
	 *
	 * @remarks From -100 to 100.
	 * @example 0 means center panning.
	 */
	public panning = defaultNoteOptions.panning;

	/**
	 * Fine pitch of the note block.
	 *
	 * @remarks The max in Note Block Studio is limited to -1200 and +1200.
	 * @example 0 designates no fine-tuning. ±100 cents is a single semitone difference.
	 */
	public pitch = defaultNoteOptions.pitch;

	/**
	 * Construct a note.
	 *
	 * @param instrument Instrument ID for the note
	 * @param options Options for the note
	 */
	public constructor(instrument: number, options: NoteOptions = defaultNoteOptions) {
		const mergedOptions = {
			...defaultNoteOptions,
			...options
		};

		this.instrument = instrument;
		this.key = mergedOptions.key;
		this.velocity = mergedOptions.velocity;
		this.panning = mergedOptions.panning;
		this.pitch = mergedOptions.pitch;
	}
}
