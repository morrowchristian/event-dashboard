export default class Clock {
    static start() {
        const update = () => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });

            const timeEl = document.getElementById('current-time');
            if (timeEl) timeEl.textContent = time;

            document.dispatchEvent(new CustomEvent('time:updated', { 
                detail: { time } 
            }));
        };

        update();
        setInterval(update, 1000);
    }
}