/**
 * Real-time updates service
 * Simulates real-time data updates and handles live synchronization
 */

import DataManager from './data-manager.js';

class RealTimeUpdates {
    constructor() {
        this.updateIntervals = new Map();
        this.isActive = false;
    }

    /**
     * Initialize real-time updates
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
     */
    setupStatsUpdates() {
        const interval = setInterval(() => {
            this.updateDashboardStats();
        }, 10000);

        this.updateIntervals.set('stats', interval);
    }

    /**
     * Set up event status updates every 30 seconds
     */
    setupEventStatusUpdates() {
        const interval = setInterval(() => {
            this.updateEventStatuses();
        }, 30000);

        this.updateIntervals.set('events', interval);
    }

    /**
     * Set up time synchronization every second
     */
    setupTimeSync() {
        const interval = setInterval(() => {
            this.updateCurrentTime();
        }, 1000);

        this.updateIntervals.set('time', interval);
    }

    /**
     * Update dashboard statistics with simulated real-time data
     */
    updateDashboardStats() {
        const currentStats = DataManager.getStats();
        
        // Simulate real-time changes
        const newStats = {
            availableMembers: Math.max(15, Math.min(20, 
                currentStats.availableMembers + Math.floor(Math.random() * 3) - 1
            )),
            taskProgress: Math.max(0, Math.min(100,
                currentStats.taskProgress + Math.floor(Math.random() * 5) - 2
            )),
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
     */
    updateEventStatuses() {
        const events = DataManager.getEvents();
        const now = new Date();
        const currentHour = now.getHours();
        let hasChanges = false;

        events.forEach(event => {
            const eventTime = this.parseEventTime(event.time);
            let newStatus = event.status;

            if (eventTime.hours < currentHour && event.status !== 'completed') {
                newStatus = 'completed';
            } else if (eventTime.hours === currentHour && event.status === 'upcoming') {
                newStatus = 'ongoing';
            }

            if (newStatus !== event.status) {
                event.status = newStatus;
                hasChanges = true;
            }
        });

        if (hasChanges) {
            this.notifyDataChange('events:updated', events);
        }
    }

    /**
     * Parse event time string to hours
     */
    parseEventTime(timeString) {
        const [time, modifier] = timeString.split(' ');
        let [hours] = time.split(':').map(Number);
        
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        
        return { hours, minutes: 0 };
    }

    /**
     * Update current time display
     */
    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        // Dispatch event for time update
        document.dispatchEvent(new CustomEvent('time:updated', {
            detail: { time: timeString }
        }));
    }

    /**
     * Notify components of data changes
     */
    notifyDataChange(type, data) {
        document.dispatchEvent(new CustomEvent(type, {
            detail: data
        }));
    }

    /**
     * Stop all real-time updates
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
            }, 500);
        });
    }
}

// Export singleton instance
export default new RealTimeUpdates();