export default {
    init() {
        // Simulate live updates
        setInterval(() => {
            document.dispatchEvent(new CustomEvent('events:updated'));
        }, 30000);
    },
    manualRefresh() {
        return new Promise(r => setTimeout(r, 800));
    }
};