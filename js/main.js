import { state } from './state.js'
import { AudioManager } from './AudioManager.js'
import { Renderer } from './Renderer.js';
import { SequencerRenderer } from './SequencerRenderer.js';


const audioManager = new AudioManager(state);
const canvas = document.getElementById('waveform');
const sequencerCanvas = document.getElementById('sequencer');
const sequencerRenderer = new SequencerRenderer(sequencerCanvas);
sequencerRenderer.drawGrid();
const renderer = new Renderer(audioManager, canvas, sequencerRenderer);

document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];

    audioManager.load(file).then(() => {
        const amplitudes = audioManager.analyzeAmplitudes();
        const pageAmplitudes = amplitudes.slice(0, 16); // 先頭16拍
        sequencerRenderer.drawGrid();
        sequencerRenderer.drawWaveLayer(pageAmplitudes);
        renderer.drawWaveform();
    });

});


document.getElementById('playButton').addEventListener('click', () => {
    audioManager.play();
    renderer.start();
});

document.getElementById('pauseButton').addEventListener('click', () => {
    audioManager.pause();
});

document.getElementById('stopButton').addEventListener('click', () => {
    audioManager.stop();
    renderer.stop();
});


