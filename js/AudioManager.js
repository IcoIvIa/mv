export class AudioManager {
    // this.audioContext　Web Audio APIのルートオブジェクト
    // this.audioBuffer　デコード済みの音声データ。波形出力、再生
    // this.sourceNode 再生ごとのインスタンス

    constructor(state) {
        this.state = state;
        this.audioContext = null;
        this.audioBuffer = null;
        this.sourceNode = null;
    }

    async load(file) {
        this.audioContext = new AudioContext();

        const arrayBuffer = await file.arrayBuffer();
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    }

    play() {
        if (!this.audioBuffer) return;
        if (this.state.isPlaying) return;

        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.buffer = this.audioBuffer;
        this.sourceNode.connect(this.audioContext.destination);

        const offsetSec = this.state.pausedBeat * (this.state.msPerBeat / 1000);
        this.sourceNode.start(0, offsetSec);
        this.state.startTime = this.audioContext.currentTime - offsetSec;

        this.state.isPlaying = true;

        // 再生が終わったら自動でリセット
        this.sourceNode.onended = () => {
            this.state.isPlaying = false;
            this.state.pausedBeat = 0;
            this.state.startTime = 0;
            this.sourceNode = null;
        };
    }

    stop() {
        if (!this.state.isPlaying) return;

        this.sourceNode.stop();
        this.sourceNode = null;

        this.state.isPlaying = false;
    }

    pause() {
        if (!this.state.isPlaying) return;

        this.state.pausedBeat = this.getCurrentBeat();
        this.sourceNode.onended = null;
        this.sourceNode.stop();
        this.state.isPlaying = false;
    }

    getCurrentBeat() {
        if (!this.state.isPlaying) return this.state.pausedBeat;

        return (this.audioContext.currentTime - this.state.startTime)
            / (this.state.msPerBeat / 1000);
    }
}