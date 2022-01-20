let elements;
let song;

/**
 * Get the stored elements object.
 * @return {Object}
 */
export function getElements() {
    return elements;
}

/**
 * Set the stored elements.
 * @param toSet Elements to store
 */
export function setElements(toSet) {
    elements = toSet;
}

/**
 * Get the currently stored song.
 * @return {NBSjs.Song}
 */
export function getSong() {
    return song;
}

/**
 * Set the stored song.
 * @param toSet Song to store
 */
export function setSong(toSet) {
    song = toSet;
}
