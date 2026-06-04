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

        // OFFドットのパターンを一度だけ生成
        this.dotPattern = this._createDotPattern();
    }

    drawDot(col, row, color, usePattern = false) {
        const x = col * (this.DOT_SIZE + this.GAP);
        const y = row * (this.DOT_SIZE + this.GAP);

        if (usePattern) {
            // OFFドット：パターンを貼り付けるだけ
            this.ctx.save();
            this.ctx.fillStyle = this.dotPattern;
            this.ctx.translate(x, y);
            this.ctx.fillRect(0, 0, this.DOT_SIZE, this.DOT_SIZE);
            this.ctx.translate(-x, -y);
            this.ctx.restore();
        } else if
            (!usePattern) {
            // ONドット・現在ステップ：通常の塗りつぶし
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, this.DOT_SIZE, this.DOT_SIZE);
        }
    }

    drawGrid() {
        // 上からべた塗り（未使用）
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                this.drawDot(col, row, null, true);
            }
        }
    }

    drawWaveLayer(amplitudes) {
        const CENTER = this.ROWS / 2;

        // 最大値で正規化
        const max = Math.max(...amplitudes) || 1;

        for (let col = 0; col < this.COLS; col++) {
            const amp = amplitudes[col] / max;         // 0〜1に正規化
            const halfHeight = amp * CENTER;           // 何行分光らせるか

            for (let row = 0; row < this.ROWS; row++) {
                const distFromCenter = Math.abs(row - CENTER + 0.5);
                if (distFromCenter <= halfHeight) {
                    this.drawDot(col, row, '#ff8c14');
                }
            }
        }
    }
    // 現在ステップの列を強調表示
    drawCurrentStep(stepIndex) {
        const x = stepIndex * (this.DOT_SIZE + this.GAP);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;

        for (let row = 0; row < this.ROWS; row++) {
            const y = row * (this.DOT_SIZE + this.GAP);
            this.ctx.strokeRect(x + 0.5, y + 0.5, this.DOT_SIZE - 1, this.DOT_SIZE - 1);
        }
    }

    _createDotPattern() {
        const size = this.DOT_SIZE;
        const off = new OffscreenCanvas(size, size);
        const ctx = off.getContext('2d');

        // ① ドット打ち（角を除外）
        ctx.fillStyle = '#888888';
        for (let py = 0; py < size; py += 2) {
            for (let px = 0; px < size; px += 2) {
                const isCorner = (px === 0 && py === 0) ||
                    (px === 0 && py === size - 2) ||
                    (px === size - 2 && py === 0) ||
                    (px === size - 2 && py === size - 2);
                if (!isCorner) {
                    ctx.fillRect(px, py, 1, 1);
                }
            }
        }

        // ② 左・上辺
        ctx.fillStyle = '#aaaaaa';
        ctx.fillRect(1, 0, 1, size - 1);
        ctx.fillRect(0, 1, size - 1, 1);

        // ③ 右・下辺
        ctx.fillStyle = '#555555';
        ctx.fillRect(size - 1, 1, 1, size - 2);
        ctx.fillRect(1, size - 1, size - 2, 1);

        // ④ 網点
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let py = 3; py < size - 1; py += 3) {
            for (let px = 3; px < size - 1; px += 3) {
                ctx.fillRect(px, py, 1, 1);
            }
        }

        // ⑤ ハイライト
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(2, 2, 1, 1);
        ctx.fillRect(6, 2, 1, 1);
        ctx.fillRect(10, 2, 1, 1);
        ctx.fillRect(2, 6, 1, 1);
        ctx.fillRect(2, 10, 1, 1);
        ctx.fillRect(2, 14, 1, 1);

        return this.ctx.createPattern(off, 'no-repeat');
    }

}