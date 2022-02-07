# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
