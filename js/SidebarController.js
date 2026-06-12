export class SidebarController {
    constructor(ui) {
        if (!ui) {
            throw new Error('SidebarController: UIController is required');
        }
        this.ui       = ui;
        this.sections = ['file', 'sequencer', 'motion'];
        this.savedState = {};
    }

    init() {
        this.ui.init();
        this.initWrapperToggle();
    }

    initWrapperToggle() {
        const toggleBtn = this.ui.getToggleBtn('wrapper');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            this.isWrapperCollapsed()
                ? this.expandWrapper()
                : this.collapseWrapper();
        });
    }

    isWrapperCollapsed() {
        return this.ui.getElement('wrapper')
            ?.classList.contains('sidebar--collapsed') ?? false;
    }

    collapseWrapper() {
        this.sections.forEach((section) => {
            const item   = this.ui.windows.find(w => w.section === section);
            const target = this.ui.getElement(section);
            const cls    = `${item.block}__${section}--collapsed`;

            this.savedState[section] = target?.classList.contains(cls) ?? false;
            target?.classList.add(cls);
        });

        this.ui.getElement('wrapper')?.classList.add('sidebar--collapsed');
    }

    expandWrapper() {
        this.sections.forEach((section) => {
            const item   = this.ui.windows.find(w => w.section === section);
            const target = this.ui.getElement(section);
            const cls    = `${item.block}__${section}--collapsed`;

            target?.classList.toggle(cls, this.savedState[section] ?? false);
        });

        this.ui.getElement('wrapper')?.classList.remove('sidebar--collapsed');
    }
}