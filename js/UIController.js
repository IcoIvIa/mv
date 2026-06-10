export class UIController {
    constructor() {
        this.windows = [
            { section: 'file', block: 'sidebar' },
            { section: 'sequencer', block: 'sidebar' },
            { section: 'motion', block: 'sidebar' },
        ]
    }

    init() {
        this.initCollapseWindows();
        // this.initMotionPicker();
    }

    initCollapseWindows() {
        this.windows.forEach(({ section }) => {
            const toggleBtn = document.querySelector(`[data-toggle="${section}"]`);
            if (!toggleBtn) return;

            toggleBtn.addEventListener('click', () => {
                this.toggle(section);
            });
        });
    }

    // initMotionPicker() {

    // } そのうち記述

    toggle(section) {
        const item = this.windows.find(w => w.section === section);
        if (!item) return;

        const target = document.querySelector(`[data-section="${section}"]`);
        if (!target) return;

        target.classList.toggle(`${item.block}__${section}--collapsed`);
    }
}