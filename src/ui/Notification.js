export default class Notification {
    static template() {
        return `<div id="notification-container" class="notification-container"></div>`;
    }

    constructor() {
        this.container = null;
    }

    init() {
        this.container = document.getElementById('notification-container');
    }

    show(message, type = 'success') {
        if (!this.container) this.init();
        const el = document.createElement('div');
        el.className = `notification notification-${type}`;
        el.innerHTML = `<i class="fas fa-info-circle"></i><span>${message}</span>`;
        this.container.appendChild(el);
        setTimeout(() => el.classList.add('show'), 10);
        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 300);
        }, 3000);
    }
}