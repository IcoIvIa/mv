import { state } from './state.js'
import { config } from './config.js';

import { AudioManager } from './AudioManager.js'
import { Renderer } from './Renderer.js';
import { SequencerRenderer } from './SequencerRenderer.js';

import { UIController } from './UIController.js';
import { SidebarController } from './SidebarController.js';
import { WaveDisplayController } from './WaveDisplayController.js';

// canvas類
const audioManager = new AudioManager(state);
const canvas = document.getElementById('waveform');
const sequencerCanvas = document.getElementById('sequencer');
const sequencerRenderer = new SequencerRenderer(sequencerCanvas);
sequencerRenderer.drawGrid();
const renderer = new Renderer(audioManager, canvas, sequencerRenderer);
// UI類
const ui = new UIController(config.windows);
const sidebar = new SidebarController(ui);
const waveDisplay = new WaveDisplayController();
waveDisplay.init();

// --音声読み込み動作（サイドバー）--
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


// --再生ボタン（ウェーブディスプレイ）
document.getElementById('playButton').addEventListener('click', () => {
    if (!audioManager.audioBuffer) return;
    audioManager.play();
    renderer.start()
    waveDisplay.setIcon('playing');
});

document.getElementById('pauseButton').addEventListener('click', () => {
    audioManager.pause();
    waveDisplay.setIcon('paused');
});

document.getElementById('stopButton').addEventListener('click', () => {
    audioManager.stop();
    renderer.stop();
    waveDisplay.setIcon('stopped');
});


// --UIController--
sidebar.init();
