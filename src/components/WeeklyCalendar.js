/**
 * Weekly Calendar Component
 * Displays 7-day week view with 24-hour timeline
 * Shows events as blocks on the timeline with click-to-edit functionality
 */

import DataManager from '../services/data-manager.js';
import { showNotification, formatTime } from '../utils/helpers.js';

class WeeklyCalendar {
    constructor() {
        this.days = this.generateWeekDays();
        this.timeSlots = this.generateTimeSlots();
        this.events = DataManager.getEvents();
        this.selectedEvent = null;
    }

    /**
     * Generate array of 7 days starting from today
     * @returns {Array} Array of day objects with date and formatted display
     */
    generateWeekDays() {
        const days = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            days.push({
                date: date.toISOString().split('T')[0],
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                monthDay: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                isToday: i === 0
            });
        }
        return days;
    }

    /**
     * Generate time slots for 24-hour day in 15-minute increments
     * @returns {Array} Array of time slot objects
     */
    generateTimeSlots() {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const displayTime = formatTime(new Date(2024, 0, 1, hour, minute));
                
                slots.push({
                    time: timeString,
                    displayTime: displayTime,
                    hour: hour,
                    minute: minute,
                    isHourMark: minute === 0
                });
            }
        }
        return slots;
    }

    /**
     * Render weekly calendar view
     * @returns {string} HTML string for weekly calendar
     */
    render() {
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Weekly Calendar</h3>
                    <div class="card-icon">
                        <i class="fas fa-calendar-week"></i>
                    </div>
                </div>
                
                <div class="weekly-calendar">
                    <!-- Time column header -->
                    <div class="time-column">
                        <div class="time-header"></div>
                        ${this.timeSlots.map(slot => `
                            <div class="time-slot ${slot.isHourMark ? 'hour-mark' : ''}">
                                ${slot.isHourMark ? slot.displayTime : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Days columns -->
                    ${this.days.map(day => `
                        <div class="day-column ${day.isToday ? 'today' : ''}">
                            <div class="day-header">
                                <div class="day-name">${day.dayName}</div>
                                <div class="month-day">${day.monthDay}</div>
                                ${day.isToday ? '<div class="today-badge">Today</div>' : ''}
                            </div>
                            
                            ${this.timeSlots.map(slot => `
                                <div class="time-slot ${slot.isHourMark ? 'hour-mark' : ''}"
                                     data-date="${day.date}"
                                     data-time="${slot.time}">
                                    ${this.getEventForSlot(day.date, slot.time)}
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Event Preview Modal -->
            <div id="event-preview-modal" class="modal hidden">
                <div class="modal-content event-preview">
                    <div class="modal-header">
                        <h3><i class="fas fa-calendar-alt"></i> Event Details</h3>
                        <button class="modal-close" id="preview-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="event-preview-content" id="event-preview-content">
                        <!-- Dynamic content will be inserted here -->
                    </div>
                    
                    <div class="event-actions">
                        <button class="btn btn-outline" id="edit-event-btn">
                            <i class="fas fa-edit"></i> Edit Event
                        </button>
                        <button class="btn btn-primary" id="complete-event-btn">
                            <i class="fas fa-check"></i> Mark Complete
                        </button>
                        <button class="btn btn-danger" id="delete-event-btn">
                            <i class="fas fa-trash"></i> Delete Event
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get event for specific date and time slot
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {string} time - Time string (HH:MM)
     * @returns {string} HTML for event block or empty string
     */
    getEventForSlot(date, time) {
        const event = this.events.find(e => 
            e.date === date && this.isTimeInRange(time, e.time, e.duration)
        );
        
        if (!event) return '';
        
        return `
            <div class="event-block ${event.status}" 
                 data-event-id="${event.id}"
                 style="${this.calculateEventStyle(event, time)}">
                <div class="event-time">${event.time}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-status-indicator"></div>
            </div>
        `;
    }

    /**
     * Check if time slot contains an event
     * @param {string} slotTime - Current time slot (HH:MM)
     * @param {string} eventTime - Event start time (HH:MM)
     * @param {number} duration - Event duration in minutes (default: 60)
     * @returns {boolean} True if slot contains event
     */
    isTimeInRange(slotTime, eventTime, duration = 60) {
        const [slotHour, slotMinute] = slotTime.split(':').map(Number);
        const [eventHour, eventMinute] = eventTime.split(':').map(Number);
        
        const slotTotalMinutes = slotHour * 60 + slotMinute;
        const eventTotalMinutes = eventHour * 60 + eventMinute;
        
        return slotTotalMinutes >= eventTotalMinutes && 
               slotTotalMinutes < eventTotalMinutes + duration;
    }

    /**
     * Calculate event block positioning and height
     * @param {Object} event - Event object
     * @param {string} currentTime - Current time slot
     * @returns {string} CSS style string
     */
    calculateEventStyle(event, currentTime) {
        const duration = event.duration || 60; // Default 1 hour
        const height = (duration / 15) * 20; // 20px per 15-minute slot
        
        return `height: ${height}px;`;
    }

    /**
     * Initialize calendar interactions
     */
    initInteractions() {
        // Event block clicks
        document.querySelectorAll('.event-block').forEach(block => {
            block.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEventPreview(block.dataset.eventId);
            });
        });

        // Time slot clicks (for adding new events)
        document.querySelectorAll('.time-slot[data-date]').forEach(slot => {
            slot.addEventListener('click', (e) => {
                if (!e.target.closest('.event-block')) {
                    this.createNewEvent(slot.dataset.date, slot.dataset.time);
                }
            });
        });

        // Modal controls
        document.getElementById('preview-close')?.addEventListener('click', () => {
            this.hideEventPreview();
        });

        // Action buttons
        document.getElementById('edit-event-btn')?.addEventListener('click', () => {
            this.editEvent();
        });

        document.getElementById('complete-event-btn')?.addEventListener('click', () => {
            this.completeEvent();
        });

        document.getElementById('delete-event-btn')?.addEventListener('click', () => {
            this.deleteEvent();
        });
    }

    /**
     * Show event preview modal
     * @param {string} eventId - Event ID to preview
     */
    showEventPreview(eventId) {
        const event = this.events.find(e => e.id == eventId);
        if (!event) return;

        this.selectedEvent = event;
        
        const previewContent = document.getElementById('event-preview-content');
        previewContent.innerHTML = `
            <div class="event-preview-header">
                <h4>${event.title}</h4>
                <span class="event-status-badge status-${event.status}">
                    ${event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
            </div>
            <div class="event-preview-details">
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${event.time} • ${event.duration || 60} minutes</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>${event.dateFormatted || event.date}</span>
                </div>
                ${event.description ? `
                    <div class="detail-item">
                        <i class="fas fa-align-left"></i>
                        <span>${event.description}</span>
                    </div>
                ` : ''}
            </div>
        `;

        document.getElementById('event-preview-modal').classList.remove('hidden');
    }

    /**
     * Hide event preview modal
     */
    hideEventPreview() {
        document.getElementById('event-preview-modal').classList.add('hidden');
        this.selectedEvent = null;
    }

    /**
     * Edit selected event
     */
    editEvent() {
        if (!this.selectedEvent) return;
        // Would integrate with your existing event modal
        showNotification('Edit event functionality would open here', 'info');
        this.hideEventPreview();
    }

    /**
     * Mark event as complete
     */
    completeEvent() {
        if (!this.selectedEvent) return;
        
        this.selectedEvent.status = 'completed';
        document.dispatchEvent(new CustomEvent('events:updated'));
        showNotification('Event marked as complete', 'success');
        this.hideEventPreview();
    }

    /**
     * Delete selected event
     */
    deleteEvent() {
        if (!this.selectedEvent) return;
        
        if (confirm('Are you sure you want to delete this event?')) {
            DataManager.events = DataManager.events.filter(e => e.id !== this.selectedEvent.id);
            document.dispatchEvent(new CustomEvent('events:updated'));
            showNotification('Event deleted', 'success');
            this.hideEventPreview();
        }
    }

    /**
     * Create new event at specified time
     * @param {string} date - Event date
     * @param {string} time - Event time
     */
    createNewEvent(date, time) {
        // Would integrate with your existing event modal
        showNotification(`Create new event on ${date} at ${time}`, 'info');
    }
}

export default WeeklyCalendar;