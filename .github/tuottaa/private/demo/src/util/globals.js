let elements;
let song;
let instruments;
const loadedInstruments = new Map();

/**
 * @return {Object} Stored elements object.
 */
export function getElements() {
    return elements;
}

/**
 * @param toSet Stored elements object.
 */
export function setElements(toSet) {
    elements = toSet;
}

/**
 * @return {NBSjs.Song} Currently stored song.
 */
export function getSong() {
    return song;
}

/**
 * @param toSet Currently stored song.
 */
export function setSong(toSet) {
    song = toSet;
}

/**
 * @returns {Map<string, NBSjs.Instrument>} Instruments utilized in the song.
 */
export function getInstruments() {
    return instruments;
}

/**
 * @param toSet Instruments utilized in the song.
 */
export function setInstruments(toSet) {
    instruments = toSet;
}

/**
 * @returns {Map<string, ArrayBuffer>} Loaded instruments.
 */
export function getLoadedInstruments() {
    return loadedInstruments;
}

/**
 * Push to the loaded instruments map.
 *
 * @param key Key to store
 * @param value Value to store
 */
export function pushLoadedInstruments(key, value) {
    loadedInstruments.set(key, value);
}
