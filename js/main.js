import { state } from './state.js'
import { AudioManager } from './AudioManager.js'
import { Renderer } from './Renderer.js';


const audioManager = new AudioManager(state);
const canvas = document.getElementById('waveform');
const renderer = new Renderer(audioManager, canvas);

document.getElementById('fileInput').addEventListener('change',(e) => {
    const file = e.target.files[0];
    audioManager.load(file).then(() =>{
        renderer.drawWaveform();
    });
});

document.getElementById('playButton').addEventListener('click',() => {
    audioManager.play();
})

document.getElementById('pauseButton').addEventListener('click', () => {
    audioManager.pause();
});

document.getElementById('stopButton').addEventListener('click',() => {
    audioManager.stop();
})

