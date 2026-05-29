export class AudioManager {
    // this.audioContext　Web Audio APIのルートオブジェクト
    // this.audioBuffer　デコード済みの音声データ。波形出力、再生
    // this.sourceNode 再生ごとのインスタンス

    constructor(state) {
        this.audioContext = null
        this.audioBuffer = null
        this.sourceNode = null
    }

    async load(file) {
        this.audioContext = new AudioContext()

        const arrayBuffer = await file.arrayBuffer()
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
    }

    play() {
        this.sourceNode = this.audioContext.createBufferSource()
        this.sourceNode.buffer = this.audioBuffer
        this.sourceNode.connect(this.audioContext.destination)
        this.sourceNode.start(0)
    }

    stop() {
        this.sourceNode.stop()
    }
}