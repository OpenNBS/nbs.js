import { MinecraftInstruments, Song } from "@nbsjs/core";

test("Create a song", () => {
	// The process to create a new song is incredibly straightforward
	// Due to the complexity of song fields, an adjacent `SongBuilder` does not exist
	const song = new Song();

	expect(song.name).toBeUndefined();
	expect(song.author).toBeUndefined();
	expect(song.originalAuthor).toBeUndefined();
	expect(song.description).toBeUndefined();
	expect(song.importName).toBeUndefined();

	expect(song.layers.total).toBe(0);
	expect(song.hasNotes).toBeFalse();

	// A new song is completely empty. Give it some data!
	song.name = "Foo";
	song.author = "Bar";

	expect(song.name).toBe("Foo");
	expect(song.author).toBe("Bar");
});

test("Determine the presence of notes within a song", () => {
	const song = new Song();

	// The song's `#size` is determined by the last tick containing a note
	expect(song.size).toBe(0);

	// While not required, the recommended way to create layers and notes is through a song
	const layer = song.layers.builder().name("Hello World").build();

	expect(song.layers.total).toBe(1);

	layer.notes.builder().instrument(MinecraftInstruments.HARP).key(42).build();

	expect(song.size)
		.not /* NOT? */
		.toBe(1);

	// What? A note has just been added, why is the size still zero?
	// The NBS specification does not differentiate between no notes and notes on the first (zeroth) tick
	// Therefore, it cannot be used as a definitive indication whether the song contains any notes

	// Instead, use `#hasNotes` to determine whether a song contains any notes
	expect(song.hasNotes).toBeTrue();

	// `#size` will function as expected beyond the first tick
	layer.notes.builder().instrument(MinecraftInstruments.HARP).key(42).at(42).build();

	expect(song.size).toBe(42);
});

test("Utilize a song's auto-save and loop", () => {
	const song = new Song();
	const layer = song.layers.builder().build();

	// Like statistics, auto-save and loop options are only present as part of the NBS specification
	expect(song.autoSave.isEnabled).toBeFalse();
	expect(song.autoSave.interval).toBe(5);

	expect(song.loop.isEnabled).toBeFalse();
	expect(song.loop.count).toBe(0);
	expect(song.loop.startTick).toBe(0);

	// `#loop` provides a helper field to determine the last measure's tick
	expect(song.loop.endMeasureTick).toBe(4);

	layer.notes.builder().instrument(MinecraftInstruments.HARP).at(30).build();

	expect(song.loop.endMeasureTick).toBe(32);

	// The field updates with `SongTempo#beats`, for example 3/4:
	song.tempo.beats = 3;

	expect(song.loop.endMeasureTick).toBe(33);
});

test("Utilize a song's statistics", () => {
	const song = new Song();
	const layer = song.layers.builder().build();

	// Most statistics are only present as part of the NBS specification
	expect(song.statistics.minutesSpent).toBe(0);
	expect(song.statistics.leftClicks).toBe(0);
	expect(song.statistics.rightClicks).toBe(0);
	expect(song.statistics.blocksAdded).toBe(0);
	expect(song.statistics.blocksRemoved).toBe(0);

	// Most of these statistics are not updated by any action other than assignment
	// However, methods involving the addition and removal of notes will increment `#blocksAdded` and `#blocksRemoved`
	for (let index = 0; index < 20; index++) {
		layer.notes
			.builder()
			.instrument(MinecraftInstruments.HARP)
			.at(index + 4)
			.build();
	}

	expect(song.statistics.blocksAdded).toBe(20);

	layer.notes.clear();

	expect(song.statistics.blocksRemoved).toBe(20);
});

test("Utilize a song's tempo", () => {
	const song = new Song();

	// Song tempo is stored in `Song#tempo`
	// Beats is the top number of the time signature
	song.tempo.beats = 4;

	// Note is the bottom number of the time signature
	song.tempo.note = 4;

	expect(song.tempo.beats).toBe(4);
	expect(song.tempo.note).toBe(4);

	// Tempo can be used in various units
	// Changing any one unit will update all other units
	song.tempo.ticksPerSecond = 10;

	expect(song.tempo.ticksPerSecond).toBe(10);
	expect(song.tempo.beatsPerMinute).toBe(150);
	expect(song.tempo.millisecondsPerTick).toBe(100);

	song.tempo.beatsPerMinute = 200;

	expect(song.tempo.ticksPerSecond).toBeCloseTo(13.33);
	expect(song.tempo.beatsPerMinute).toBe(200);
	expect(song.tempo.millisecondsPerTick).toBe(75);

	song.tempo.millisecondsPerTick = 50;

	expect(song.tempo.ticksPerSecond).toBe(20);
	expect(song.tempo.beatsPerMinute).toBe(300);
	expect(song.tempo.millisecondsPerTick).toBe(50);
});
