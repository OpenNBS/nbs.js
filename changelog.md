# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 7.0.0

> [!IMPORTANT]  
> This update will break all existing applications!

The library has been rewritten from the ground-up to achieve its claim of robustness.

All applications utilizing version 6 and older will require major changes. Many methods have been altered or removed, custom instruments are handled using a namespace system, and validation is present on nearly every field.

Please carefully read through these changes and refer to the [tests as examples](/tests).

### Added

#### Song features

Various song fields and objects have been moved into relevant classes. Each `Song` instance also creates a new instance of these classes.

These classes are designed to be modular and extendable, with new features and maintinence ideally being easier compared to their previous object-based counterparts. Fields are validated when set.

> [!TIP]
> A demonstration of creating and modifying songs can be found in the [`createSongs` test file](tests/songs/createSongs.test.ts).

- The `SongAutoSave` class accessed via `Song#autoSave`.
  - Alias of the new `AutoSavePiece` class also used by `Header`.
  - Provides no additional features over the previous `autoSave` object.
  - Provides the following static fields:
    - `DEFAULT_ENABLED`
    - `DEFAULT_INTERVAL`
- The `SongLoop` class accessed via `Song#loop`.
  - Alias of the new `HeaderLoopPiece` class used by `Header`, which extends `LoopPiece`.
  - Adds the `#endTick` field which is an alias for `Song#size`.
  - Adds the `#endMeasureTick` field which is the tick of the final measure.
  - Provides the following static fields:
    - `DEFAULT_ENABLED`
    - `DEFAULT_START_TICK`
    - `DEFAULT_COUNT`
- The `SongStatistics` class accessed via `Song#statistics`.
  - Alias of the new `StatisticsPiece` class also used by `Header`.
  - Provides the following static fields:
    - `DEFAULT_MINUTES_SPENT`
    - `DEFAULT_LEFT_CLICKS`
    - `DEFAULT_RIGHT_CLICKS`
    - `DEFAULT_BLOCKS_ADDED`
    - `DEFAULT_BLOCKS_REMOVED`
- The `SongTempo` class accessed via `Song#tempo`.
  - Alias of the new `TempoPiece` class also used by `Header`.
  - Replaces the previous `Song#tempo`, which is now `SongTempo#ticksPerSecond`.
  - Replaces the previous `Song#timePerTick`, which is now `SongTempo#millisecondsPerTick`.
  - Adds the `#beatsPerMinute` field which represents the number of beats per minute.
  - Adds the `#note` field which represents the bottom number of a time signature.
  - Provides the following static fields:
    - `DEFAULT_BEATS`
    - `DEFAULT_NOTE`
    - `DEFAULT_TICKS_PER_SECOND`
    - `DEFAULT_BEATS_PER_MINUTE`
    - `DEFAULT_MILLISECONDS_PER_TICK`
- The `MetadataPiece` class now serves as the base structure for `Song` and `Header`.
  - This provides basic metadata fields such as name and version.
  - Provides the following static fields:
    - `DEFAULT_VERSION`
    - `DEFAULT_AUTHOR`
    - `DEFAULT_ORIGINAL_AUTHOR`
    - `DEFAULT_DESCRIPTION`
    - `DEFAULT_IMPORT_NAME`

Both management classes for layers and instruments have faced major changes. Notably, each class has been renamed to follow the `Piece` convention as seen above.

Accessing and iterating these classes is now similar to the same processes with map objects. The internal map is private and protected, and can only be accessed using the exposed methods.

- The `SongLayersPiece` class is now based on a key-sorted map and provides more methods.
  - `#at()` for accessing a specified layer position.
  - `#has()` for checking the existence of a specified layer position.
  - `#move()` for replacing a layer position with another layer.
  - `#shift()` for moving a layer position with another layer without replacing.
  - `#set()` for setting a layer at a specified position.
  - `#clear()` for deleting all layers.
  - `#register()` for adding layers created outside of the parent song.
  - `#between()` for iterating a slice of layer positions.
- The `SongInstrumentsPiece` class is now based on an identifier map and provides more methods.
  - `#at()` for accessing an instrument by identifier.
  - `#has()` for checking the existence of a specified instrument by identifier.
  - `#register()` for adding instruments created outside of the parent song.
  - `#clear()` for deleting all instruments.

- The `Header` class that provides partial fields similar to `Song`.
  - This is used when only reading a binary file's header.
  - The `HeaderLike` interface represents classes that implement basic NBS header data.

- The `Song#totalNotes` field which counts the total number of notes within a song.
- The `Song#hasNotes` field to determine whether the song contains at least one note.
- The `SongStatistics#blocksAdded` and `SongStatistics#blocksRemoved` fields are now updated when notes are added or removed.

#### Note features

Now that instruments are referenced by namespace, `Note#instrument` is no longer a number ID. Rather, with `Song#instrument`'s new registration system, `Note#instrument` is now an object reference to a registered instrument. This makes accessing a note's instrument more robust, as the process no longer depends on an arbitrary array index. Since `#instrument` is an object reference, modifications to a note's instruments propagates to every note utilizing the instrument.

Each `Note` field is validated upon change, and `#velocity` has been renamed to `#volume` to match with the use of `VolumeParameter`. To account for field validation, the `NoteOptions` interface has been removed meaning that a note cannot be initialized with values. Instead, use the new `NoteBuilder` class.

- The `Note` class provides more helper methods.
  - `#effectivePitch` accounts for the note's key, instrument key, and pitch.
  - `#isVanillaCompatible()` for checking whether a note is compatible with vanilla Minecraft.
- The `Note` class provides following static fields:
  - `DEFAULT_KEY`
  - `DEFAULT_PITCH`
  - `DEFAULT_VOLUME`
  - `DEFAULT_PANNING`
- The `NoteBuilder` class which provides a pipeline to create a new `Note` instance with values.
  - The builder chain always starts with `#instrument()` as it's a required value.

For future expandability with notes created for songs, the `InitializedNote` class extends `Note` to provide additional song-related functionality. It is not designed to be instantiated on its own, rather it's created by `InitializedNoteBuilder#build()` (created by `SongLayers#builder()`).

- The `InitializedNote` class provides helper methods for `Note`s created in songs.
  - Provides the `#tick` field which finds the note within the song.
  - If the note's parent layer is locked, the note is immutable as well.
  - `#effectivePanning` accounts for the note's panning and layer panning.
- The `InitializedNoteBuilder` class instantiates an `InitializedNote`.
  - `#build()` accepts the `updateStatistics` argument which dictates whether `Song#statistics` will be updated when the note is built.

#### Layer features

#### Instrument features

#### Binary reading and writing

Following a similar pattern to the rest of the library, the `fromArrayBuffer` and `toArrayBuffer` have been replaced by class-based counterparts.

These classes take the fundamental ideas of the functions and transformed their processes into steps in order to achieve incremental processing. This may open up the possibility of reading and writing NBS binary files asynchronously in the future. The change also allows for options that alter how the binaries are processed, notably the ability to specify the NBS version to utilize while writing. Transformation options alter how elements such as empty layers and unsupported instruments are handled, with a future-proof model that opens up many possibilities for future parse-time alterations.

> [!TIP]
> A demonstration of reading binary files can be found in the [`binaryReader` test file](tests/formats/binaryReader.test.ts), and writing in the [`binaryWriter` test file](tests/formats/binaryWriter.test.ts).

- The `BinaryReader` class, which replaces the `fromArrayBuffer()` function.
  - `BinaryReaderOptions#transformers.layers` replaces the `omitEmptyLayers()` function.
  - `#toHeader()` returns a `Header` instance.
  - `#toSong()` returns a `Song` instance.
  - For more performance, methods are provided to return raw data in steps:
    - `#atHeaderStep()` returns an `IntermediaryHeader` object
    - `#atNotesStep()` returns an `IntermediaryNote[]` array
    - `#atLayersStep()` returns an `IntermediaryLayer[]` array
    - `#atInstrumentsStep()` returns an `IntermediaryInstrument[]` array
- The `BinaryWriter` class, which replaces the `toArrayBuffer()` function.
  - `BinaryWriterOptions#transformers.layers` replaces the `omitEmptyLayers()` function.
  - `#toArrayBuffer()` returns an `ArrayBuffer` instance.
  - Provides the ability to write using specified NBS version.
    - `BinaryWriterOptions#transformers.instruments` alters how unsupported instruments are written.

#### Validators

The library now has a maximum priority on data type validation. Every field is now constrained to their relevant specification definitions, and methods to check whether an arbitrary argument falls within these constraints have been provided in various ways depending on how they're most often used. A Rust-inspired validation result response type has been implemented to ensure easy adoption of this new standard.

Parameters always satisfy the `ParameterLike` interface, which always includes `MIN_VALUE` and `MAX_VALUE`, as well a `validate()` method which accepts a single argument.

- The `BeatsParameter` class to validate the tempo beats per measure value.
- The `NoteParameter` class to validate the tempo note value.
- The `KeyParameter` class to validate note and instrument keys.
- The `PanningParameter` class to validate note and layer pannings.
- The `PitchParameter` class to validate note pitchs.
- The `VersionParameter` class to validate supported NBS versions.
- The `VolumeParameter` class to validate note and layer volumes.

The validators will return a `Result` object, which contains an `#ok` boolean that specifies whether a parameter is valid. These objects also contains an `#ensure()` function which will throw an error only if the validation has failed. Otherwise, this function will do nothing. Failed validations will include the `#errors` array containing the reason(s) why the validation failed.

- The `Result` type and relevant functions.
  - `Result#ok` will be `true` if a validator succeeds.
  - `Result#ok` will be `false` if a validator fails, with `Result#errors` containing the reason(s).
  - `Result#ensure()` will always be present, and when called, will throw an error only if validation has failed.
  - `isInteger` checks whether the specified value is a whole-number safe integer.
  - `isPositive` checks whether the specified value is greater than or equal to 0.
  - `isWithinRange` checks whether the specified value is greater than, less than, or equal to the provided range.

#### Other additions

- The `SortedIndexMap` class that extends `Map` to sort numeric keys on iteration.
- The maximum and minimum data type constants in `BufferWrapper`.
  - `MIN_BYTE` and `MAX_BYTE`
  - `MIN_UNSINGED_BYTE` and `MAX_UNSINGED_BYTE`
  - `MIN_SHORT` and `MAX_SHORT`
- The `BufferReader#readBoolean` and `BufferWriter#readBoolean` internal methods.
- [Unit and example tests](/tests) for extensive code coverage and reliability.
- rumdl Markdown formatter and configuration.

### Changed

- The `Song#getLength()` method has been replaced by `#size`.
- Various `Song` class objects have been replaced by dedicated classes.
  - `SongAutoSave`:
    - Replaces and accessed via `Song#autoSave`.
  - `SongLoop`:
    - Replaces and accessed via `Song#loop`.
    - `Song#getLastMeasure()` -> `SongLoop#endMeasureTick`
  - `SongTempo`:
    - Accessed via `Song#tempo`.
    - `Song#getTempo()` and `Song#setTempo()` -> `SongTempo#ticksPerSecond`
    - `Song#getTimePerTick()` and `Song#setTimePerTick()` -> `SongTempo#millisecondsPerTick`
    - `Song#timeSignature` -> `SongTempo#beats`
  - `SongStatistics`:
    - Replaces `Song#minutesSpent`.
    - Replaces `Song#blocksAdded`.
    - Replaces `Song#blocksRemoved`.
    - Replaces `Song#leftClicks`.
    - Replaces `Song#rightClicks`.
- `SongInstrumentsPiece` (formerly `SongInstruments`) is now internally based on a map.
  - All references to IDs have been replaced by `ResourceLocation`s.
  - Vanilla instruments will no longer be included in the song's instruments.
  - Deleting a custom instrument will delete all notes using the instrument.
  - `#all` has been replaced by `#values()`.
  - `#getTotal()` has been replaced by `#total`.
  - `#create()` has been replaced by `#builder()`.
- `SongLayersPiece` (formerly `SongLayers`) is now internally based on a key-sorted map.
  - `#all` has been replaced by `#values()`.
  - `#getTotal()` has been replaced by `#total`.
  - `#create()` has been replaced by `#builder()`.
- Many fields are now validated when set.
- Split the build scripts into separate `build`, `lint`, `docs`, and `publish` scripts.
- Introduced stricter TypeScript, JSON, and Markdown linting.

### Removed

- The `Song#getDuration()` method. This will be re-implemented with unofficial tempo changer support.
- The `Song#hasSolo()` method. TODO
- The `SongInstrumentsPiece#firstCustomIndex` field.
- The `/examples` directory has been replaced by [examples through testing](/tests).

## 6.1.0

> [!CAUTION]  
> All files created with this version will be parsed as and saved using NBSv6

Bumps the supported NBS version to v6, adding the four new trumpet instruments added in Minecraft 26.1.

Support for exporting songs for older NBS versions will be added in the near future!

### Changed

- Songs are now parsed using NBSv6.
- Tests and sample files now utilize NBSv6.
- Updated Bun and Typescript for built module.
- Migrated Biome formatter from v1 to v2.

### Added

- The four new trumpet instruments.
- Nix flake for reproducable development environments.
- Zed configuration file to ensure the usage of Biome.

## 6.0.0

> [!IMPORTANT]  
> This update will break all existing applications!

The package has moved to `@nbsjs/core` to allow for future addons to the library.

Please carefully read through these changes and refer to the [examples](/examples).

### Changed

- The project has been rebranded from `NBS.js` to `nbs.js`.
- The project has moved from `@encode42/nbs.js` to `@nbsjs/core`.
- The project's repository has moved to the [OpenNBS](https://github.com/OpenNBS) organization.
- The project is designated as a module by default.
- This update redesigns how classes and their properties are structured.
- Continuing what v5 started, multiple arrays tied to IDs/ticks have been transformed into an object.
  - `SongInstruments#all` is now indexed by `ID: Instrument`.
- Renamed `Song#nbsVersion` to `Song#version`.
- Moved all properties from `Song#meta` and `Song#stats` into `Song`.
- Moved all properties from `Layer#meta` into `Layer`.
- Moved all properties from `Instrument#meta` into `Instrument`.
- Renamed `Song#autosave` to `Song#autoSave`.
- Some `Song` properties are now getters to reflect their dynamic nature.
  - `Song#length` -> `Song#getLength()`
  - `Song#duration` -> `Song#getDuration()`
  - `Song#lastMeasure` -> `Song#getLastMeasure()`
  - `Song#tempo` -> `Song#getTempo()`
  - `Song#timePerTick` -> `Song#getTimePerTick()`
- The `Song#hasSolo` property is now a method.
- The following `Song` methods have been replaced:
  - `Song#createLayer` -> `SongLayers#create`
  - `Song#addLayer` -> `SongLayers#add`
  - `Song#deleteLayer` -> `SongLayers#delete`
  - `Song#setNote` -> `LayerNotes#set`
  - `Song#addNote` -> `LayerNotes#add`
- The `SongInstruments#loaded` property has been renamed to `SongInstruments#all`.
- The `Instrument#builtIn` property has been renamed to `Instrument#isBuiltIn`.
- The ArrayBuffer writer no longer requires two passes. This doubles the speed of buffer exports!
- Properties that are not designed to be modified are now `readonly`.
- The build system has been remade using Bun.
- The docs have been reorganized to reflect the project's larger scope.
- Moved all classes out of `util.ts` and into their own files.

### Added

- The `Song#setTempo` and `Song#setTimePerTick` methods update each other when changed.
- The `SongLayers` class that provides helper methods and stores layers.
- The `LayerNotes` class that provides helper methods and stores notes.
- The following helper methods and properties for `SongInstruments`: `getTotal`, `set`, `add`, `create`, and `delete`.
- `SongLayers`, `LayerNotes`, and `SongInstruments` are now iterable in a loop.
- The `omitEmptyLayers` function.
- The `Mutable` type class.
- Examples featuring multiple real-world use cases.
- Documentation categories.

### Removed

- The `Song#toArrayBuffer` method. (use `toArrayBuffer`)
- The private `Song#expand` method.
- The `Song#errors` property. (errors are thrown instead)
- The `Song#arrayBuffer` property.
- The ability to pass an `Instrument` instance into `Note`'s constructor.
- The `Instrument#id` property and constructor parameter.
- `util.ts`

## 5.0.0

### Fixed

- Consistency between existing files and exported songs has been improved.
  - This means that importing and immediately exporting a song will yield identical buffers.
- The song no longer expands one tick too far.

### Changed

- `Layer#notes` has been changed from an array to an object.
  - The object has been designed similarly to an array to ensure parity with existing code.
  - Applications that access notes using a [property accessor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) should continue to function normally.
  - Applications that iterate `Layer#notes` using a for loop require changes. For example:

  ```ts
  for (const note of layer.notes) {
  }
  ```

  Is translated to

  ```ts
  for (const note of Object.values(layer.notes)) {
  }
  ```

### Added

- `toArrayBuffer` now has an `options` parameter accepting `ignoreEmptyLayers` as a boolean.
- The `Song#addLayer` function to add existing `Layer` objects to the song.
- The `Layer#inSong` boolean used to show a warning when `Layer#setNote` or `Layer#addNote` are called within a song.
- The `defaultToArrayBufferOptions` object.
- The `ToArrayBufferOptions` interface.
- The `LayerNotes` interface.
- More tests to ensure consistency and accuracy.

## 4.0.3

### Fixed

- No longer marks itself as a module.

### Changed

- Updated examples in readme and docs.

## 4.0.2

### Fixed

- [`#9`](https://github.com/encode42/nbs.js/pull/9): Fix custom instruments getting empty name and ID.

### Changed

- Meta repository restructuring, developer dependency updates, etc.

## 4.0.1

### Fixed

- Incorrect default panning for older NBS file formats.

## 4.0.0

### Fixed

- Incorrect `nbsVersion` for songs using v0, causing read errors.
- Incorrect `Instrument`s incorrectly being read.

### Changed

- Renamed `pitch` to `key` in `InstrumentOptions`.
- Renamed `pitch` to `key` in `defaultInstrumentOptions`.
- Renamed `pitch` to `key` in `Instrument`.
- Improved and updated docs.
- Updated all devDependencies.
- Removed NPM dependency.
- Cleaned up eslint config.
- Cleaned up tsconfig.

### Removed

- The various class getters/setters from `util`.
  - This never worked properly. A better solution for modifying these classes would be to write a wrapper.
    - `getLayerClass`
    - `getNoteClass`
    - `getInstrumentClass`
    - `setLayerClass`
    - `setNoteClass`
    - `setInstrumentClass`
- Tuottaa dependency and index page.
  - Replacement is being worked on.

## 3.0.0

### Added

- `fromArrayBuffer` now supports trimming empty leading layers.
  - ONBS automatically generates extra layers past the last populated layer.
- Created basic testing via `jest`.
- Added ESLint and plugins to `devDependencies`.
- Added `test` script which lints and runs tests.
- The `options` argument in `fromArrayBuffer`.
- The `FromArrayBufferOptions` interface.

### Changed

- The `build` now runs the `test` script.
- All interfaces, classes, and objects no longer have a default export.
  - This should not affect `@encode42/nbs.js` imports.
- All interfaces have been moved to their respective class.
  - For example, `InstrumentMeta.ts` -> `Instrument.ts`.

### Removed

- The `nbs/interfaces` directory.
- The `SongMeta.ts` interface file.
  - Moved to `Song.ts`.
- The `SongStats.ts` interface file.
  - Moved to `Song.ts`.
- The `SongAutosaveOptions.ts` interface file.
  - Moved to `Song.ts`.
- The `SongLoopOptions.ts` interface file.
  - Moved to `Song.ts`.
- The `LayerMeta.ts` interface file.
  - Moved to `Layer.ts`.
- The `NoteOptions.ts` interface file.
  - Moved to `Note.ts`.
- The `InstrumentMeta.ts` interface file.
  - Moved to `Instrument.ts`.
- The `InstrumentOptions.ts` interface file.
  - Moved to `Instrument.ts`.

## 2.1.2

### Changed

- Updated all `devDependencies`.
- Revamped build scripts.
- Changed target from `ESNext` to `ES2015` for compatibility.

### Fixed

- Properly included typings.
- Moved `devDependencies` out of `dependencies`.

## 2.1.1

### Fixed

- Fixed potential `defaultSongMeta` pollution.
- Fixed potential `defaultSongLoopOptions` pollution.
- Fixed potential `defaultSongAutosaveOptions` pollution.
- Fixed `defaultSongStats` pollution.
- Fixed potential `defaultLayerMeta` pollution.
- Fixed potential `defaultInstrumentMeta` pollution.

## 2.1.0

### Added

- The `Song#arrayBuffer` field.
- The `SongStats#lastMeasure` getter.

### Changed

- The `defaultSongStats#duration` getter is now defined after song instantiation.
- The `defaultSongStats#hasSolo` getter is now defined after song instantiation.

### Removed

- The `defaultSongStats#duration` default value.
- The `defaultSongStats#hasSolo` default value.

## 2.0.2

### Added

- Minified bundles (`cjs.min.js`, `esm.min.js`, and `umd.min.js`).

### Changed

- Updated `README.md`.

## 2.0.0

### Added

- The `Song#meta` field.
- The `Song#loop` field.
- The `Song#autosave` field.
- The `Song#stats` field.
- The `options` argument in `Song#addNote`.
- The `Layer#meta` field.
- The `options` argument in `Layer#addNote`.
- The `Note#meta` field.
- The `options` argument in `Note`.
- The `Instrument#meta` field.
- The `SongInstrument` class.
- The `SongMeta` interface.
- The `SongStats` interface.
- The `SongAutosaveOptions` interface.
- The `SongLoopOptions` interface.
- The `LayerMeta` interface.
- The `NoteOptions` interface.
- The `InstrumentMeta` interface.
- The `InstrumentOptions` interface.
- The `defaultSongMeta` object.
- The `defaultSongStats` object.
- The `defaultSongAutosaveOptions` object.
- The `defaultSongLoopOptions` object.
- The `defaultLayerMeta` object.
- The `defaultNoteOptions` object.
- The `defaultInstrumentMeta` object.
- The `defaultInstrumentOptions` object.

### Changed

- Renamed `Song#size` to `Song#length`.
- Renamed `Song#addLayer` to `Song#createLayer`.
- Swapped `layer` and `tick` arguments in `Song#setNote`.
- Moved various fields from `Song` to `Song#meta`
  - The `Song#name` field.
  - The `Song#author` field.
  - The `Song#originalAuthor` field.
  - The `Song#description` field.
  - The `Song#midiName` field.
    - Renamed to `SongMeta#importName`.
- Moved various fields from `Song` to `Song#loop`
  - The `Song#loopEnabled` field.
    - Renamed to `SongLoopOptions#enabled`.
  - The `Song#loopStartTick` field.
    - Renamed to `SongLoopOptions#startTick`.
  - The `Song#maxLoopCount` field.
    - Renamed to `SongLoopOptions#totalLoops`.
- Moved various fields from `Song` to `Song#autosave`
  - The `Song#autoSaveEnabled` field.
    - Renamed to `SongAutosaveOptions#enabled`.
  - The `Song#autoSaveDuration` field.
    - Renamed to `SongAutosaveOptions#interval`.
- Moved various fields from `Song` to `Song#stats`
  - The `Song#minutesSpent` field.
  - The `Song#leftClicks` field.
  - The `Song#rightClicks` field.
  - The `Song#blocksAdded` field.
  - The `Song#blocksRemoved` field.
  - The `Song#hasSolo` field.
    - Checks for `Layer#isSolo` on get.
  - The `Song#endTime` field.
    - Renamed to `SongStates#duration`.
- Moved various fields from `Song` to `Song#instruments`
  - The `Song#firstCustomIndex` field.
  - The `Song#instruments` field.
    - Renamed to `SongInstrument#loaded`.
- Moved various fields from `Layer` to `Layer#meta`
  - The `Layer#name` field.
- Renamed `Layer#locked` to `Layer#isLocked`.
- Renamed `Layer#solo` to `Layer#isSolo`.
- Renamed `Layer#velocity` to `Layer#volume`.
- Renamed `Layer#panning` to `Layer#stereo`.
- `Note#instrument` now stores an instrument ID.
- Moved various fields from `Instrument` to `Instrument#meta`
  - The `Instrument#name` field.
  - The `Instrument#audioSrc` field.
    - Renamed to `InstrumentOptions#soundFile`.
- Replaced `static Song#fromArrayBuffer` with `Util#fromArrayBuffer`.
- Replaced `static Song#toArrayBuffer` with `Util#toArrayBuffer`.
- Typescript now compiles to ESNext rather than CommonJS.
- Switched from Webpack to Rollup for CommonJS and ESM modules.
- CommonJS and ESM modules are now stored in `dist`. `package.json` should handle this.
- Improved documentation in `util.ts`.
- Adjusted documentation everywhere to match [the official documentation](https://opennbs.org/nbs).
- Made `Buffer#buffer` readonly.

### Removed

- The `key` argument in `Song#addNote`.
- The `panning` argument in `Song#addNote`.
- The `velocity` argument in `Song#addNote`.
- The `pitch` argument in `Song#addNote`.
- The `key` argument in `Layer#addNote`.
- The `panning` argument in `Layer#addNote`.
- The `velocity` argument in `Layer#addNote`.
- The `pitch` argument in `Layer#addNote`.
- The `key` argument in `Note`.
- The `panning` argument in `Note`.
- The `velocity` argument in `Note`.
- The `pitch` argument in `Note`.
- The `name` argument in `Instrument`.

## 1.2.3

### Changed

- Bumped webpack version from `5.65.0` to `5.67.0`.

### Fixed

- Custom instruments polluting `Instrument#builtIn`.

## 1.2.2

### Changed

- Correctly generated webpack bundle.
- Updated various values in `package.yml`.
- Updated NPM scripts.

### Added

- `dist/index.js` is now published to NPM.

## 1.2.1

### Changed

- Made `Layer#setNote` return the `note` argument.
- Made `Song#nbsVersion` default to `5`.
- Made `Song#firstCustomIndex` default to `Instrument#builtIn.length`
- Improved method documentation.

### Added

- The `Song#setNote` method.

## 1.2.0

### Changed

- `BufferReader#viewer` and `BufferWriter#viewer` have been made `protected`.

### Added

- `pressKey` to `InstrumentOptions`. Defaults to `false`.
- The `Instrument#pressKey` field.
- The `Layer#solo` field.
- The `Song#firstCustomIndex` field.
- The `Song#hasSolo` field.
- The `Song#addNote` method.
- The `Song#toArrayBuffer` member and static method.

### Removed

- `pitch` from `InstrumentOptions`.
- `song` from `Layer`'s constructor.
- The `Instrument#pitch` field.
- The `Layer#song` field.
- The `Layer#delete()` method.

## 1.1.2

### Fixed

- The `Instrument#builtIn` field incorrectly being overwritten by falsy values.
- The `Note#instrument` field incorrectly being overwritten by falsy values.
- The `Note#key` field incorrectly being overwritten by falsy values.
- The `Note#panning` field incorrectly being overwritten by falsy values.
- The `Note#velocity` field incorrectly being overwritten by falsy values.
- The `Note#pitch` field incorrectly being overwritten by falsy values.

## 1.1.1

### Changes

- Made `InstrumentOptions` a public interface.
- Made `Instrument#name` default to `""`.
- Made `Instrument#audioSrc` default to `""`.
- Made `Instrument#pitch` default to `0`.
- Made `Instrument#key` default to `45`.
- Made `Instrument#builtIn` default to `false`.
- Made `Layer#panning` default to `0`.
- Made `Song#tempo` default to `10`.
- Moved `Layer#setNote` to `Layer#addNote`.
- Moved `Layer#addNote`'s `instrument` argument.
- Improved method documentation.

### Added

- Defaults for `Note`'s constructor.
- The `instrument` argument to `Note`'s constructor.
- The `Song#errors` field.
- The `Layer#setNote` method.
