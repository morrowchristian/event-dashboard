export default class MobileMenuToggle {
    static template() {
        return `
            <button 
                class="mobile-menu-toggle" 
                id="mobile-menu-toggle"
                style="pointer-events: auto; z-index: 9999; position: fixed; top: 1rem; left: 1rem; background: var(--primary); color: white; border: none; padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                <i class="fas fa-bars" style="font-size: 1.4rem;"></i>
            </button>
        `;
    }
}