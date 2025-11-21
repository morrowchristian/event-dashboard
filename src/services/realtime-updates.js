/**
 * Real-Time Updates Service
 * Simulates real-time data updates and handles live synchronization
 * Manages periodic updates for stats, event statuses, and time display
 * Singleton pattern - exports single instance
 */

import DataManager from './data-manager.js';

class RealTimeUpdates {
    constructor() {
        /**
         * Map of active update intervals
         * @type {Map<string, number>}
         * @private
         */
        this.updateIntervals = new Map();

        /**
         * Tracks whether real-time updates are currently active
         * @type {boolean}
         * @private
         */
        this.isActive = false;
    }

    /**
     * Initialize real-time updates system
     * Sets up periodic updates for stats (10s), events (30s), and time (1s)
     * Prevents re-initialization if already active
     */
    init() {
        if (this.isActive) return;

        this.isActive = true;
        console.log('Real-time updates initialized');

        // Set up various update intervals
        this.setupStatsUpdates();
        this.setupEventStatusUpdates();
        this.setupTimeSync();
    }

    /**
     * Set up statistics updates every 10 seconds
     * Updates available members, task progress, and response rate
     * @private
     */
    setupStatsUpdates() {
        const interval = setInterval(() => {
            this.updateDashboardStats();
        }, 10000); // 10 seconds

        this.updateIntervals.set('stats', interval);
    }

    /**
     * Set up event status updates every 30 seconds
     * Automatically transitions events based on current time
     * @private
     */
    setupEventStatusUpdates() {
        const interval = setInterval(() => {
            this.updateEventStatuses();
        }, 30000); // 30 seconds

        this.updateIntervals.set('events', interval);
    }

    /**
     * Set up time synchronization every second
     * Updates current time display in header
     * @private
     */
    setupTimeSync() {
        const interval = setInterval(() => {
            this.updateCurrentTime();
        }, 1000); // 1 second

        this.updateIntervals.set('time', interval);
    }

    /**
     * Update dashboard statistics with simulated real-time data
     * Simulates random fluctuations within realistic bounds
     * @fires stats:updated - Dispatched when stats are updated
     * @private
     */
    updateDashboardStats() {
        const currentStats = DataManager.getStats();

        // Simulate real-time changes with bounded random values
        const newStats = {
            // Available members: 15-20 range, changes by -1, 0, or +1
            availableMembers: Math.max(15, Math.min(20,
                currentStats.availableMembers + Math.floor(Math.random() * 3) - 1
            )),
            // Task progress: 0-100 range, changes by -2 to +2
            taskProgress: Math.max(0, Math.min(100,
                currentStats.taskProgress + Math.floor(Math.random() * 5) - 2
            )),
            // Response rate: 50-100 range, changes by -1, 0, or +1
            responseRate: Math.max(50, Math.min(100,
                currentStats.responseRate + Math.floor(Math.random() * 3) - 1
            ))
        };

        DataManager.updateStats(newStats);

        // Notify components of data change
        this.notifyDataChange('stats:updated', newStats);
    }

    /**
     * Update event statuses based on current time
     * Transitions events from 'upcoming' → 'ongoing' → 'completed'
     * @fires events:updated - Dispatched when any event status changes
     * @private
     */
    updateEventStatuses() {
        const events = DataManager.getEvents();
        const now = new Date();
        const currentHour = now.getHours();
        let hasChanges = false;

        events.forEach(event => {
            const eventTime = this.parseEventTime(event.time);
            let newStatus = event.status;

            // Mark past events as completed
            if (eventTime.hours < currentHour && event.status !== 'completed') {
                newStatus = 'completed';
            } 
            // Mark current hour events as ongoing
            else if (eventTime.hours === currentHour && event.status === 'upcoming') {
                newStatus = 'ongoing';
            }

            if (newStatus !== event.status) {
                event.status = newStatus;
                hasChanges = true;
            }
        });

        // Only dispatch update if changes occurred
        if (hasChanges) {
            this.notifyDataChange('events:updated', events);
        }
    }

    /**
     * Parse event time string to 24-hour format
     * Converts 12-hour format (e.g., "02:30 PM") to hour object
     * @param {string} timeString - Time in 12-hour format with AM/PM
     * @returns {Object} Parsed time object
     * @returns {number} returns.hours - Hours in 24-hour format (0-23)
     * @returns {number} returns.minutes - Minutes (currently always 0)
     * @private
     * @example
     * parseEventTime("02:30 PM") // Returns { hours: 14, minutes: 0 }
     * parseEventTime("12:00 AM") // Returns { hours: 0, minutes: 0 }
     */
    parseEventTime(timeString) {
        const [time, modifier] = timeString.split(' ');
        let [hours] = time.split(':').map(Number);

        // Convert to 24-hour format
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        return {
            hours,
            minutes: 0
        };
    }

    /**
     * Update current time display
     * Gets current time and dispatches event for header display
     * @fires time:updated - Dispatched every second with current time
     * @private
     */
    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();

        // Dispatch custom event for time update
        document.dispatchEvent(new CustomEvent('time:updated', {
            detail: {
                time: timeString
            }
        }));
    }

    /**
     * Notify components of data changes
     * Generic event dispatcher for real-time updates
     * @param {string} type - Event type (e.g., 'stats:updated', 'events:updated')
     * @param {*} data - Data payload to send with event
     * @fires CustomEvent - Dispatches custom event with provided type and data
     * @private
     */
    notifyDataChange(type, data) {
        document.dispatchEvent(new CustomEvent(type, {
            detail: data
        }));
    }

    /**
     * Stop all real-time updates
     * Clears all intervals and deactivates the update system
     * Should be called when component unmounts or updates are no longer needed
     */
    stop() {
        this.updateIntervals.forEach((interval, key) => {
            clearInterval(interval);
        });

        this.updateIntervals.clear();
        this.isActive = false;
        console.log('Real-time updates stopped');
    }

    /**
     * Manually trigger data refresh
     * Forces immediate update of all data (stats, events, time)
     * Used by the "Refresh Data" button
     * @returns {Promise<void>} Resolves after 500ms delay
     * @fires manual:refresh - Dispatched when manual refresh completes
     * @example
     * await RealTimeUpdates.manualRefresh();
     * console.log('Data refreshed!');
     */
    manualRefresh() {
        this.updateDashboardStats();
        this.updateEventStatuses();
        this.updateCurrentTime();

        return new Promise((resolve) => {
            setTimeout(() => {
                this.notifyDataChange('manual:refresh', {
                    timestamp: new Date().toISOString()
                });
                resolve();
            }, 500); // 500ms delay for UX feedback
        });
    }
}

// Export singleton instance for app-wide real-time updates
export default new RealTimeUpdates();