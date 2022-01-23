import { getElements } from "./globals.js";

/**
 * Ensure a string can be parsed into a JSON object.
 *
 * @param json String to parse
 * @returns {boolean}
 */
export function canParse(json) {
    let pass = false;

    try {
        JSON.parse(json);
        pass = true;
    } catch {}

    return pass;
}

/**
 * Set the displayed progress message.
 *
 * @param message Message to display
 * @returns {void}
 */
export function displayProgress(message) {
    getElements().text.file.progress.innerHTML = message;
}
