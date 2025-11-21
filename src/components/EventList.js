/**
 * Event List Component
 * Displays scheduled events grouped by date with chronological sorting
 * Shows event times, titles, and status badges with visual grouping
 */

import DataManager from '../services/data-manager.js';

class EventList {
    constructor() {
        this.events = DataManager.getEvents();
    }

    /**
     * Render events list grouped by date
     * Creates date sections with chronological event listing
     * Shows empty state when no events are scheduled
     * @returns {string} HTML string for events card with grouped event listing
     */
    render() {
        const eventsByDate = this.groupEventsByDate(this.events);
        
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Today's Schedule</h3>
                    <div class="card-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                </div>
                <ul class="event-list" id="schedule-list">
                    ${Object.keys(eventsByDate).length === 0 ? `
                        <li class="date-group">
                            <div class="date-header">No Events</div>
                            <div class="event-item">
                                <div class="event-title">No events scheduled yet</div>
                            </div>
                        </li>
                    ` : ''}
                    ${Object.keys(eventsByDate)
                        .sort((a, b) => new Date(a) - new Date(b))
                        .map(date => {
                            const dateEvents = eventsByDate[date];
                            return `
                                <li class="date-group">
                                    <div class="date-header">${this.formatDate(date)}</div>
                                    ${dateEvents.map(event => `
                                        <div class="event-item" data-event-id="${event.id}">
                                            <div class="event-time">${event.time}</div>
                                            <div class="event-title">${event.title}</div>
                                            <div class="event-status status-${event.status}">
                                                ${event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                            </div>
                                        </div>
                                    `).join('')}
                                </li>
                            `;
                        }).join('')}
                </ul>
            </div>
        `;
    }

    /**
     * Group events by date and sort by time within each date
     * @param {Array<Object>} events - Array of event objects
     * @returns {Object} Events grouped by date (date string as key)
     */
    groupEventsByDate(events) {
        const grouped = {};
        events.forEach(event => {
            const date = event.date || new Date().toISOString().split('T')[0];
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(event);
        });
        
        // Sort events within each date by time
        Object.keys(grouped).forEach(date => {
            grouped[date].sort((a, b) => {
                const timeA = this.timeToMinutes(a.time);
                const timeB = this.timeToMinutes(b.time);
                return timeA - timeB;
            });
        });
        
        return grouped;
    }

    /**
     * Convert time string to minutes since midnight for sorting
     * @param {string} timeStr - Time string in 12-hour format
     * @returns {number} Minutes since midnight
     */
    timeToMinutes(timeStr) {
        if (!timeStr) return 0;
        
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return 0;
        
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();
        
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        return hours * 60 + minutes;
    }

    /**
     * Format date for display
     * @param {string} dateString - Date in ISO format
     * @returns {string} Formatted date string
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
}

export default EventList;