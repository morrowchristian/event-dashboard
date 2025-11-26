export default class LoadingOverlay {
    static template() {
        return `
            <div id="loading-overlay" class="loading-overlay hidden">
                <div class="spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading...</p>
                </div>
            </div>
        `;
    }

    show() {
        document.getElementById('loading-overlay')?.classList.remove('hidden');
    }

    hide() {
        document.getElementById('loading-overlay')?.classList.add('hidden');
    }
}