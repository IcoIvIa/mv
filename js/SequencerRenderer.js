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

    drawDot(col, row, color) {
        const x = col * (this.DOT_SIZE + this.GAP);
        const y = row * (this.DOT_SIZE + this.GAP);

        // ① 本体
        // ① ドット打ち（角を除外）
        this.ctx.fillStyle = color;
        for (let py = 0; py < this.DOT_SIZE; py += 2) {
            for (let px = 0; px < this.DOT_SIZE; px += 2) {
                // 4隅の座標はスキップ
                const isCorner = (px === 0 && py === 0) ||
                    (px === 0 && py === this.DOT_SIZE - 2) ||
                    (px === this.DOT_SIZE - 2 && py === 0) ||
                    (px === this.DOT_SIZE - 2 && py === this.DOT_SIZE - 2);
                if (!isCorner) {
                    this.ctx.fillRect(x + px, y + py, 1, 1);
                }
            }
        }

        // ② 左端・上端（明るい1px、角を避ける）
        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.fillRect(x + 1, y, 1, this.DOT_SIZE - 1);  // 左端（上の角を避ける）
        this.ctx.fillRect(x, y + 1, this.DOT_SIZE - 1, 1);  // 上端（左の角を避ける）

        // ③ 右端・下端（暗い1px、角を避ける）
        this.ctx.fillStyle = '#555555';
        this.ctx.fillRect(x + this.DOT_SIZE - 1, y + 1, 1, this.DOT_SIZE - 2);  // 右端
        this.ctx.fillRect(x + 1, y + this.DOT_SIZE - 1, this.DOT_SIZE - 2, 1);  // 下端

        // ④ 網点
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let py = 3; py < this.DOT_SIZE - 1; py += 3) {
            for (let px = 3; px < this.DOT_SIZE - 1; px += 3) {
                this.ctx.fillRect(x + px, y + py, 1, 1);
            }
        }

        // ⑤ ハイライト（辺に沿った固定位置）
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        // 上辺（左から4px間隔）
        this.ctx.fillRect(x + 2, y + 2, 1, 1);
        this.ctx.fillRect(x + 6, y + 2, 1, 1);
        this.ctx.fillRect(x + 10, y + 2, 1, 1);

        // 左辺（上から4px間隔、3分の2まで = DOT_SIZE 20px の約13px）
        this.ctx.fillRect(x + 2, y + 2, 1, 1);  // 上辺と共有
        this.ctx.fillRect(x + 2, y + 6, 1, 1);
        this.ctx.fillRect(x + 2, y + 10, 1, 1);
        this.ctx.fillRect(x + 2, y + 14, 1, 1); // 14px ≒ 3分の2
    }

    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                this.drawDot(col, row, '#888888');
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