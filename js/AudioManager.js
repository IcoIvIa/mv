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
        this.amplitudes = this.analyzeAmplitudes(); //読み込み時に一度だけ計算
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
        this.state.pausedBeat = 0;
        this.state.startTime = 0;
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

    // 各ステップの振幅を事前計算して配列で返す
    analyzeAmplitudes() {
        const data = this.audioBuffer.getChannelData(0);
        const sampleRate = this.audioBuffer.sampleRate;
        const secPerBeat = 60 / this.state.bpm;
        const samplesPerBeat = Math.floor(sampleRate * secPerBeat);

        const amplitudes = [];

        for (let beat = 0; beat < Math.floor(data.length / samplesPerBeat); beat++) {
            const start = beat * samplesPerBeat;
            const end = start + samplesPerBeat;

            // この拍の範囲のサンプルの絶対値平均を取る
            let sum = 0;
            for (let i = start; i < end; i++) {
                sum += Math.abs(data[i]);
            }
            amplitudes.push(sum / samplesPerBeat);
        }

        return amplitudes;
    }

    // amplitudes配列を16ステップのループにマッピング
    mapToLoop(amplitudes) {
        const LOOP_STEPS = 16;
        const loopAmplitudes = new Array(LOOP_STEPS).fill(0);
        const counts = new Array(LOOP_STEPS).fill(0);

        amplitudes.forEach((amp, beatIndex) => {
            const stepIndex = beatIndex % LOOP_STEPS; // 16で割った余り = ループ内の位置
            loopAmplitudes[stepIndex] += amp;
            counts[stepIndex]++;
        });

        // 平均を取る
        return loopAmplitudes.map((sum, i) => sum / counts[i]);
    }

}