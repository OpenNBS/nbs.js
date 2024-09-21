# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# 6.0.0
This update will break almost all existing applications!

The package has moved to `@nbsjs/core` to allow for future addons to the library.

Please carefully read through these changes and refer to the [examples](/examples).

### Changed
- The project has been rebranded from `NBS.js` to `nbs.js`.
- The project has moved from `@encode42/nbs.js` to `@nbsjs/core`.
- The project's repository has moved to the [OpenNBS](https://github.com/OpenNBS) organization.
- The project is designated as a module by default.
- This update redesigns how classes and their properties are structured.
- Continuing what v5 started, multiple arrays tied to IDs/ticks have been transformed into an object.
  * `SongInstruments#all` is now indexed by `ID: Instrument`.
- Renamed `Song#nbsVersion` to `Song#version`.
- Moved all properties from `Song#meta` and `Song#stats` into `Song`.
- Moved all properties from `Layer#meta` into `Layer`.
- Moved all properties from `Instrument#meta` into `Instrument`.
- Renamed `Song#autosave` to `Song#autoSave`.
- Some `Song` properties are now getters to reflect their dynamic nature.
  * `Song#length` -> `Song#getLength()`
  * `Song#duration` -> `Song#getDuration()`
  * `Song#lastMeasure` -> `Song#getLastMeasure()`
  * `Song#tempo` -> `Song#getTempo()`
  * `Song#timePerTick` -> `Song#getTimePerTick()`
- The `Song#hasSolo` property is now a method.
- The following `Song` methods have been replaced:
  * `Song#createLayer` -> `SongLayers#create`
  * `Song#addLayer` -> `SongLayers#add`
  * `Song#deleteLayer` -> `SongLayers#delete`
  * `Song#setNote` -> `LayerNotes#set`
  * `Song#addNote` -> `LayerNotes#add`
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

# 5.0.0
### Fixed
- Consistency between existing files and exported songs has been improved.
  * This means that importing and immediately exporting a song will yield identical buffers.
- The song no longer expands one tick too far.

### Changed
- `Layer#notes` has been changed from an array to an object.
  * The object has been designed similarly to an array to ensure parity with existing code.
  * Applications that access notes using a [property accessor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) should continue to function normally.
  * Applications that iterate `Layer#notes` using a for loop require changes. For example:
  ```ts
  for (const note of layer.notes) {}
  ```

  Is translated to

  ```ts
  for (const note of Object.values(layer.notes)) {}
  ```

### Added
- `toArrayBuffer` now has an `options` parameter accepting `ignoreEmptyLayers` as a boolean.
- The `Song#addLayer` function to add existing `Layer` objects to the song.
- The `Layer#inSong` boolean used to show a warning when `Layer#setNote` or `Layer#addNote` are called within a song.
- The `defaultToArrayBufferOptions` object.
- The `ToArrayBufferOptions` interface.
- The `LayerNotes` interface.
- More tests to ensure consistency and accuracy.

# 4.0.3
### Fixed
- No longer marks itself as a module.

### Changed
- Updated examples in readme and docs.

# 4.0.2
### Fixed
- [`#9`](https://github.com/encode42/nbs.js/pull/9): Fix custom instruments getting empty name and ID.

### Changed
- Meta repository restructuring, developer dependency updates, etc.

# 4.0.1
### Fixed
- Incorrect default panning for older NBS file formats.

# 4.0.0
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

# 3.0.0
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

# 2.1.2
### Changed
- Updated all `devDependencies`.
- Revamped build scripts.
- Changed target from `ESNext` to `ES2015` for compatibility.

### Fixed
- Properly included typings.
- Moved `devDependencies` out of `dependencies`.

# 2.1.1
### Fixed
- Fixed potential `defaultSongMeta` pollution.
- Fixed potential `defaultSongLoopOptions` pollution.
- Fixed potential `defaultSongAutosaveOptions` pollution.
- Fixed `defaultSongStats` pollution.
- Fixed potential `defaultLayerMeta` pollution.
- Fixed potential `defaultInstrumentMeta` pollution.

# 2.1.0
### Added
- The `Song#arrayBuffer` field.
- The `SongStats#lastMeasure` getter.

### Changed
- The `defaultSongStats#duration` getter is now defined after song instantiation.
- The `defaultSongStats#hasSolo` getter is now defined after song instantiation.

### Removed
- The `defaultSongStats#duration` default value.
- The `defaultSongStats#hasSolo` default value.

# 2.0.2
### Added
- Minified bundles (`cjs.min.js`, `esm.min.js`, and `umd.min.js`).

### Changed
- Updated `README.md`.

# 2.0.0
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

# 1.2.3
### Changed
- Bumped webpack version from `5.65.0` to `5.67.0`.

### Fixed
- Custom instruments polluting `Instrument#builtIn`.

# 1.2.2
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
