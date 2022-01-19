const audioContext = new AudioContext();
const audioDestination = audioContext.createGain();
audioDestination.connect(audioContext.destination);

/**
 * Play a note.
 * @param key Key to play at
 * @param instrument Instrument to play
 * @param velocity Volume of the note
 * @param panning Panning of the note
 * @param pitch Pitch of the note
 * @return {void}
 */
export function playNote(key, instrument, velocity, panning, pitch) {
    if (!instrument) {
        return;
    }

    let source = audioContext.createBufferSource();
    source.buffer = instrument.audioBuffer;
    source.start(0);

    // Process pitch
    source.playbackRate.value = 2 ** (((key + (pitch / 100)) - 45) / 12);

    // Process gain
    const gainNode = audioContext.createGain();
    gainNode.gain.value = (velocity / 2) / 100; // Decrease volume to avoid peaking
    source.connect(gainNode);
    source = gainNode;

    // Process panning
    if (panning !== 0) {
        const panningNode = audioContext.createStereoPanner();
        panningNode.pan.value = panning / 100;
        source.connect(panningNode);
        source = panningNode;
    }

    source.connect(audioDestination);
}

/**
 * Decode an audio buffer.
 * @param buffer Buffer to decode
 * @return {Promise<AudioBuffer>} Decoded audio buffer
 */
export function decodeAudioData(buffer) {
    return audioContext.decodeAudioData(buffer);
}
