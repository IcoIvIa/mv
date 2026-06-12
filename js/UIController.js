export class UIController {
    constructor(windows) {
        if (!windows || windows.length === 0) {
            throw new Error('UIController: windows is required');
        }
        this.windows = windows;
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
    
// SidebarControllerで使用
    getElement(section) {
    return document.querySelector(`[data-section="${section}"]`);
}
getToggleBtn(section) {
    return document.querySelector(`[data-toggle="${section}"]`);
}
}