/**
 * Dashboard Component
 * Displays key statistics cards: upcoming events, team availability, and task progress
 * Includes real-time updating progress bars and stat counters
 */

import DataManager from '../services/data-manager.js';

class Dashboard {
    constructor() {
        /**
         * Current dashboard statistics
         * @type {Object}
         * @property {number} upcomingEvents - Count of scheduled events
         * @property {number} responseRate - Team response percentage
         * @property {number} availableMembers - Currently available team members
         * @property {number} totalMembers - Total team size
         * @property {number} taskProgress - Task completion percentage
         * @property {number} remainingTasks - Number of incomplete tasks
         */
        this.stats = DataManager.getStats();
    }

    /**
     * Render dashboard statistics cards
     * Creates three cards showing event count, team availability, and task progress
     * Each card includes a progress bar and real-time updating values
     * @returns {string} HTML string for dashboard grid with stat cards
     */
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
                        <!-- Event count - updates in real-time via stats:updated event -->
                        <div class="stat-value" id="upcoming-events-count">${this.stats.upcomingEvents}</div>
                        <div class="stat-label">Events scheduled this week</div>
                    </div>
                    <!-- Team response rate progress bar -->
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
                        <!-- Available/total member count ratio -->
                        <div class="stat-value" id="available-count">${this.stats.availableMembers}/${this.stats.totalMembers}</div>
                        <div class="stat-label">Available today</div>
                    </div>
                    <!-- Availability percentage progress bar -->
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
                        <!-- Task completion percentage -->
                        <div class="stat-value" id="tasks-progress">${this.stats.taskProgress}%</div>
                        <div class="stat-label">Tasks completed</div>
                    </div>
                    <!-- Task progress bar -->
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