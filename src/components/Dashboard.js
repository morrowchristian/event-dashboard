import DataManager from '../services/data-manager.js';

export default class Dashboard {
    static render() {
        const events = DataManager.getEvents();
        const stats = {
            upcoming: events.filter(e => e.status === 'upcoming').length,
            ongoing: events.filter(e => e.status === 'ongoing').length,
            completed: events.filter(e => e.status === 'completed').length,
            total: events.length,
            events: events.filter(e => e.type === 'event').length,
            tasks: events.filter(e => e.type === 'task').length
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
                        <h3>${stats.events}</h3>
                        <p>Events</p>
                    </div>
                </div>
                <div class="stat-card" style="border-left: 4px solid #ffc107;">
                    <i class="fas fa-tasks"></i>
                    <div>
                        <h3>${stats.tasks}</h3>
                        <p>Tasks</p>
                    </div>
                </div>
            </div>
        `;
    }
}