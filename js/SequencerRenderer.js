export class SequencerRenderer {
    // COLS        列数（ステップ数）
    // ROWS        行数（チャンネル数）
    // DOT_SIZE    1ドットのサイズ（px）
    // GAP         ドット間の隙間（px）

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.COLS = 16;
        this.ROWS = 8;
        this.DOT_SIZE = 20;
        this.GAP = 3;

        // Canvasのサイズをドット数から自動計算
        this.canvas.width = this.COLS * (this.DOT_SIZE + this.GAP) - this.GAP;
        this.canvas.height = this.ROWS * (this.DOT_SIZE + this.GAP) - this.GAP;
    }

    // ドットを1つ描画する
    drawDot(col, row, color) {
        const x = col * (this.DOT_SIZE + this.GAP);
        const y = row * (this.DOT_SIZE + this.GAP);
    // 本体
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.roundRect(
            x,
            y,
            this.DOT_SIZE,
            this.DOT_SIZE,
            6
        );
        this.ctx.fill();

        // 角ありの描画（未使用）
        // this.ctx.fillRect(x, y, this.DOT_SIZE, this.DOT_SIZE);
    }

    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                this.drawDot(col, row, '#1a1a1a')
            }
        }
    }

    drawWaveLayer(amplitudes) {
        const CENTER = this.ROWS / 2;

        // 最大値で正規化
        const max = Math.max(...amplitudes);

        for (let col = 0; col < this.COLS; col++) {
            const amp = amplitudes[col] / max;         // 0〜1に正規化
            const halfHeight = amp * CENTER;           // 何行分光らせるか

            for (let row = 0; row < this.ROWS; row++) {
                const distFromCenter = Math.abs(row - CENTER + 0.5);
                const isWave = distFromCenter <= halfHeight;
                const color = isWave ? '#ff8c14' : '#1a1a1a';
                this.drawDot(col, row, color);
            }
        }
    }

    // 現在ステップの列を強調表示
    drawCurrentStep(stepIndex) {
        for (let row = 0; row < this.ROWS; row++) {
            this.drawDot(stepIndex, row, '#ffffff');
        }
    }

}