export class WaveDisplayController {
    constructor() {
        this.iconElement = document.querySelector('.wave-display__controls--icon');
    };

    init(){
        this.setIcon('stopped');
    }

    setIcon(state) {
        if (!this.setIcon) return;

        switch (state) {
            case 'playing':
                this.iconElement.textContent = '▶';
                break;
            case 'paused':
                this.iconElement.textContent = '⏸';
                break;
            case 'stopped':
                this.iconElement.textContent = '⏹';
                break;
        }

    };
}