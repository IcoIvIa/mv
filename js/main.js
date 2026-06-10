import { state } from './state.js'
import { AudioManager } from './AudioManager.js'
import { Renderer } from './Renderer.js';
import { SequencerRenderer } from './SequencerRenderer.js';
import { UIController } from './UIController.js';


const audioManager = new AudioManager(state);
const canvas = document.getElementById('waveform');
const sequencerCanvas = document.getElementById('sequencer');
const sequencerRenderer = new SequencerRenderer(sequencerCanvas);
sequencerRenderer.drawGrid();
const renderer = new Renderer(audioManager, canvas, sequencerRenderer);
const ui = new UIController();


// --音声読み込み動作--
document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];

    audioManager.load(file).then(() => {
        // const amplitudes = audioManager.analyzeAmplitudes();
        // const pageAmplitudes = amplitudes.slice(0, 16); // 先頭16拍
        const pageAmplitudes = audioManager.amplitudes.slice(0, 16);
        sequencerRenderer.drawWaveLayer(pageAmplitudes);
        sequencerRenderer.drawGrid();
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


// --UIController--
ui.init();
