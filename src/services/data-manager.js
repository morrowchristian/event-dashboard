/**
 * Core Data Management Service
 * Centralized data store for team members, events, and dashboard statistics
 * Singleton pattern - exports single instance
 */

class DataManager {
    constructor() {
        /**
         * Team members array
         * @type {Array<Object>}
         * @property {number} id - Unique team member identifier
         * @property {string} name - Full name
         * @property {string} role - Job title/role
         * @property {string} avatar - Initials for avatar display
         */
        this.teamMembers = [
            {
                id: 1,
                name: 'John Doe',
                role: 'Project Manager',
                avatar: 'JD'
            },
            {
                id: 2,
                name: 'Alice Smith',
                role: 'Event Coordinator',
                avatar: 'AS'
            },
            {
                id: 3,
                name: 'Robert Johnson',
                role: 'Marketing Lead',
                avatar: 'RJ'
            },
            {
                id: 4,
                name: 'Emma Wilson',
                role: 'Operations',
                avatar: 'EW'
            }
        ];

        /**
         * Events array
         * @type {Array<Object>}
         * @property {number} id - Unique event identifier
         * @property {string} time - Event time in 12-hour format (e.g., "09:00 AM")
         * @property {string} date - Event date in ISO format (YYYY-MM-DD)
         * @property {string} title - Event name/description
         * @property {string} status - Event status: 'upcoming' | 'ongoing' | 'completed'
         */
        this.events = [
            {
                id: 1,
                time: '09:00 AM',
                title: 'Team Stand-up Meeting',
                status: 'ongoing'
            },
            {
                id: 2,
                time: '11:00 AM',
                title: 'Client Presentation',
                status: 'upcoming'
            },
            {
                id: 3,
                time: '02:00 PM',
                title: 'Project Review',
                status: 'upcoming'
            }
        ];

        /**
         * Dashboard statistics
         * @type {Object}
         * @property {number} upcomingEvents - Total upcoming events count
         * @property {number} responseRate - Team response rate percentage (0-100)
         * @property {number} availableMembers - Currently available team members
         * @property {number} totalMembers - Total team size
         * @property {number} taskProgress - Overall task completion percentage (0-100)
         * @property {number} remainingTasks - Number of incomplete tasks
         */
        this.stats = {
            upcomingEvents: 12,
            responseRate: 75,
            availableMembers: 18,
            totalMembers: 20,
            taskProgress: 64,
            remainingTasks: 36
        };
    }

    /**
     * Get all team members
     * @returns {Array<Object>} Array of team member objects
     */
    getTeamMembers() {
        return this.teamMembers;
    }

    /**
     * Get all events
     * @returns {Array<Object>} Array of event objects
     */
    getEvents() {
        return this.events;
    }

    /**
     * Get dashboard statistics
     * @returns {Object} Current statistics object
     */
    getStats() {
        return this.stats;
    }

    /**
     * Update dashboard statistics
     * Merges new stats with existing stats (partial update supported)
     * @param {Object} newStats - Object containing stat properties to update
     * @returns {Object} Updated statistics object
     * @example
     * updateStats({ taskProgress: 75, remainingTasks: 30 })
     */
    updateStats(newStats) {
        this.stats = {
            ...this.stats,
            ...newStats
        };
        return this.stats;
    }

    /**
     * Add a new event to the events array
     * Automatically generates ID based on current array length
     * @param {Object} event - Event object to add
     * @param {string} event.title - Event title
     * @param {string} event.time - Event time
     * @param {string} event.date - Event date
     * @param {string} event.status - Event status
     * @returns {Object} The newly created event with generated ID
     * @example
     * addEvent({ title: 'Meeting', time: '10:00 AM', date: '2025-01-15', status: 'upcoming' })
     */
    addEvent(event) {
        const newEvent = {
            id: this.events.length + 1,
            ...event
        };
        this.events.push(newEvent);
        return newEvent;
    }
}

// Export singleton instance for app-wide data consistency
export default new DataManager();