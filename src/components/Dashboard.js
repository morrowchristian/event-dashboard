import DataManager from '../services/data-manager.js';

class Dashboard {
    constructor() {
        this.stats = DataManager.getStats();
    }

    render() {
        return `
            <div class="dashboard-grid">
                <!-- Upcoming Events Card -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Upcoming Events</h3>
                        <div class="card-icon">
                            <i class="fas fa-calendar-plus"></i>
                        </div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" id="upcoming-events-count">${this.stats.upcomingEvents}</div>
                        <div class="stat-label">Events scheduled this week</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" id="response-progress" style="width: ${this.stats.responseRate}%"></div>
                    </div>
                    <div class="stat-label">${this.stats.responseRate}% of team responded</div>
                </div>
                
                <!-- Team Availability Card -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Team Availability</h3>
                        <div class="card-icon">
                            <i class="fas fa-user-check"></i>
                        </div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" id="available-count">${this.stats.availableMembers}/${this.stats.totalMembers}</div>
                        <div class="stat-label">Available today</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" id="availability-progress" 
                             style="width: ${(this.stats.availableMembers / this.stats.totalMembers) * 100}%"></div>
                    </div>
                    <div class="stat-label">${this.stats.totalMembers - this.stats.availableMembers} members on leave</div>
                </div>
                
                <!-- Tasks Progress Card -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Tasks Progress</h3>
                        <div class="card-icon">
                            <i class="fas fa-tasks"></i>
                        </div>
                    </div>
                    <div class="stat">
                        <div class="stat-value" id="tasks-progress">${this.stats.taskProgress}%</div>
                        <div class="stat-label">Tasks completed</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" id="tasks-progress-bar" style="width: ${this.stats.taskProgress}%"></div>
                    </div>
                    <div class="stat-label">${this.stats.remainingTasks} tasks remaining</div>
                </div>
            </div>
        `;
    }
}

export default Dashboard;