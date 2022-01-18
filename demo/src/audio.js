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
 */
function playNote(key, instrument, velocity, panning, pitch) {
    velocity = velocity / 100;
    const playbackRate = 2 ** (((key + pitch) - 45) / 12);

    let source = audioContext.createBufferSource();
    source.playbackRate.value = playbackRate;

    source.buffer = instrument.audioBuffer;
    source.start(0);

    if (velocity !== 100) {
        const gainNode = audioContext.createGain();
        gainNode.gain.value = velocity;
        source.connect(gainNode);
        source = gainNode;
    }

    if (panning !== 0) {
        const panningNode = audioContext.createStereoPanner();
        panningNode.pan.value = panning;
        source.connect(panningNode);
        source = panningNode;
    }

    source.connect(audioDestination);
}

function decodeAudioData(buffer) {
    return audioContext.decodeAudioData(buffer);
}
