import DataManager from '../services/data-manager.js';

export default class Dashboard {
    static render() {
        const events = DataManager.getEvents();
        const stats = {
            upcoming: events.filter(e => e.status === 'upcoming').length,
            ongoing: events.filter(e => e.status === 'ongoing').length,
            completed: events.filter(e => e.status === 'completed').length,
            total: events.length
        };

        return `
            <div class="stats-grid">
                <div class="stat-card upcoming">
                    <i class="fas fa-clock"></i>
                    <div>
                        <h3>${stats.upcoming}</h3>
                        <p>Upcoming</p>
                    </div>
                </div>
                <div class="stat-card ongoing">
                    <i class="fas fa-sync"></i>
                    <div>
                        <h3>${stats.ongoing}</h3>
                        <p>Ongoing</p>
                    </div>
                </div>
                <div class="stat-card completed">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <h3>${stats.completed}</h3>
                        <p>Completed</p>
                    </div>
                </div>
                <div class="stat-card total">
                    <i class="fas fa-calendar-alt"></i>
                    <div>
                        <h3>${stats.total}</h3>
                        <p>Total Events</p>
                    </div>
                </div>
            </div>
        `;
    }
}