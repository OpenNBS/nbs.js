# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

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
