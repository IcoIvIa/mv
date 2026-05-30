export class Renderer {
    constructor(audioManager, canvas) {
        this.audioManager = audioManager;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    drawWaveform() {

        /* 波形の出力 */
        const data = this.audioManager.audioBuffer.getChannelData(0); // 左チャンネルの波形データを取得
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Canvasをクリア

        const width = this.canvas.width;             // 描画領域の横幅
        const height = this.canvas.height;           // 描画領域の縦幅
        const step = Math.ceil(data.length / width); // データの間引き数
        const amp = height / 2;                      // 波形の振れ幅の基準値


        // 新しい線を引く
        this.ctx.beginPath();

        for (let i = 0; i < width; i++) {
            const value = data[i * step];
            const x = i;
            const y = amp + value * amp;

            if (i === 0) {
                // 最初の点にマーカー
                this.ctx.moveTo(x, y);
            } else {
                // 前の点からマーカー
                this.ctx.lineTo(x, y);
            }
        }

        //  線を描画する
        this.ctx.stroke();

        /*  BPMグリッド線を描く */
        const duration = this.audioManager.audioBuffer.duration;  // 音楽の長さ（秒）
        const secPerBeat = 60 / this.audioManager.state.bpm;      // 1拍の秒数
        const totalBeats = duration / secPerBeat;                  // 全体の拍数
        const pxPerBeat = width / totalBeats;                      // 1拍あたりのpx

        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';  // 半透明の線

        for (let i = 0; i < totalBeats; i++) {
            const x = Math.round(i * pxPerBeat);
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
    }
}
