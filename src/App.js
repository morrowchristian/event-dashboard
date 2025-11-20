import Dashboard from './components/Dashboard.js';
import EventList from './components/EventList.js';
import TeamMembers from './components/TeamMembers.js';
import RealTimeUpdates from './services/realtime-updates.js';
import DataManager from './services/data-manager.js';
import { storage, showNotification } from './utils/helpers.js';
import { STORAGE_KEYS } from './utils/constants.js';

class App {
    constructor() {
        this.isMobileMenuOpen = false;
        this.loadDataFromStorage();
        
        this.components = {
            dashboard: new Dashboard(),
            eventList: new EventList(),
            teamMembers: new TeamMembers()
        };
    }

    init() {
        this.render();
        this.setupEventListeners();
        this.initializeRealTimeUpdates();
        this.setupDataChangeListeners();
        this.updateEventsDisplay();
        console.log('Event Dashboard initialized');
    }

    loadDataFromStorage() {
        const storedEvents = storage.get(STORAGE_KEYS.EVENTS_DATA);
        if (storedEvents && Array.isArray(storedEvents) && storedEvents.length > 0) {
            DataManager.events = storedEvents;
            document.dispatchEvent(new CustomEvent('events:updated'));
        }
    }

    saveDataToStorage() {
        const events = DataManager.getEvents();
        storage.set(STORAGE_KEYS.EVENTS_DATA, events);
    }

    render() {
        const appContainer = document.getElementById('app');

        appContainer.innerHTML = `
            <div class="dashboard-container">
                <button class="mobile-menu-toggle" id="mobile-menu-toggle" style="pointer-events: auto;">
                    <i class="fas fa-bars" style="pointer-events: none;"></i>
                </button>

                <div class="sidebar ${this.isMobileMenuOpen ? 'mobile-open' : ''}" id="sidebar">
                    <div class="logo">
                        <h1><i class="fas fa-calendar-alt"></i> EventFlow</h1>
                    </div>
                    <ul class="nav-links">
                        <li class="active"><i class="fas fa-home"></i> Dashboard</li>
                        <li><i class="fas fa-calendar-day"></i> Events</li>
                        <li><i class="fas fa-tasks"></i> Tasks</li>
                        <li><i class="fas fa-users"></i> Team</li>
                    </ul>
                    <div class="realtime-status">
                        <i class="fas fa-circle status-indicator"></i>
                        <span>Live Updates Active</span>
                    </div>
                </div>

                <div class="main-content">
                    <div class="header">
                        <div>
                            <h2>Event Dashboard</h2>
                            <div class="current-time" id="current-time"></div>
                        </div>
                        <div class="user-info">
                            <div class="user-avatar">JD</div>
                            <span>John Doe</span>
                        </div>
                    </div>

                    <div class="dashboard-layout">
                        <div class="stats-section">
                            ${this.components.dashboard.render()}
                        </div>
                        <div class="events-section">
                            ${this.components.eventList.render()}
                        </div>
                        <div class="team-section">
                            ${this.components.teamMembers.render()}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Notification Container -->
            <div id="notification-container" class="notification-container"></div>

            <!-- Event Modal -->
            <div id="event-modal" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-calendar-plus"></i> Add New Event</h3>
                        <button class="modal-close" id="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="event-form" class="event-form">
                        <div class="form-group">
                            <label for="event-title">Event Title *</label>
                            <input 
                                type="text" 
                                id="event-title" 
                                name="title" 
                                placeholder="Enter event title"
                                required
                            >
                            <span class="error-message" id="title-error"></span>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="event-date">Date *</label>
                                <input 
                                    type="date" 
                                    id="event-date" 
                                    name="date" 
                                    required
                                >
                                <span class="error-message" id="date-error"></span>
                            </div>

                            <div class="form-group">
                                <label for="event-time">Time *</label>
                                <input 
                                    type="time" 
                                    id="event-time" 
                                    name="time" 
                                    required
                                >
                                <span class="error-message" id="time-error"></span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="event-status">Status *</label>
                            <select id="event-status" name="status" required>
                                <option value="upcoming">Upcoming</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                            </select>
                            <span class="error-message" id="status-error"></span>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" id="cancel-btn">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary" id="submit-btn">
                                <i class="fas fa-plus"></i> Add Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Loading Overlay -->
            <div id="loading-overlay" class="loading-overlay hidden">
                <div class="spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading...</p>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('mobile-menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.handleRefresh());
        }

        // Add event button
        const addEventBtn = document.getElementById('add-event-btn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => this.openEventModal());
        }

        // Modal controls
        const modalClose = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('cancel-btn');
        const eventForm = document.getElementById('event-form');

        if (modalClose) modalClose.addEventListener('click', () => this.closeEventModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeEventModal());
        if (eventForm) eventForm.addEventListener('submit', (e) => this.handleEventSubmit(e));

        // Navigation
        document.querySelectorAll('.nav-links li').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Close modal on outside click
        const modal = document.getElementById('event-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeEventModal();
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const menuToggle = document.getElementById('mobile-menu-toggle');
            if (this.isMobileMenuOpen && sidebar && !sidebar.contains(e.target) && e.target !== menuToggle) {
                this.toggleMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
        }
    }

    setupDataChangeListeners() {
        // Listen for real-time stats updates
        document.addEventListener('stats:updated', (e) => {
            this.updateStatsDisplay(e.detail);
        });

        // Listen for event updates
        document.addEventListener('events:updated', (e) => {
            this.updateEventsDisplay();
        });

        // Listen for time updates
        document.addEventListener('time:updated', (e) => {
            this.updateTimeDisplay(e.detail.time);
        });

        // Listen for manual refresh
        document.addEventListener('manual:refresh', () => {
            this.updateStatsDisplay(DataManager.getStats());
            this.updateEventsDisplay();
        });
    }

    initializeRealTimeUpdates() {
        RealTimeUpdates.init();
        this.showNotification('Real-time updates activated', 'success');
    }

    async handleRefresh() {
        const btn = document.getElementById('refresh-btn');
        if (!btn) return;

        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        btn.disabled = true;

        try {
            await RealTimeUpdates.manualRefresh();
            this.showNotification('Data refreshed successfully!', 'success');
        } catch (error) {
            this.showNotification('Failed to refresh data', 'error');
            console.error('Refresh error:', error);
        } finally {
            setTimeout(() => {
                if (btn) {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }
            }, 1000);
        }
    }

    openEventModal() {
        const modal = document.getElementById('event-modal');
        if (modal) {
            modal.classList.remove('hidden');
            
            const now = new Date();
            const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
                        .toISOString().split('T')[0];
            
            console.log('Setting default date to:', today);
            
            const dateInput = document.getElementById('event-date');
            if (dateInput) dateInput.value = today;
            document.getElementById('event-title')?.focus();
        }
    }

    closeEventModal() {
        const modal = document.getElementById('event-modal');
        const form = document.getElementById('event-form');
        
        if (modal) modal.classList.add('hidden');
        if (form) form.reset();
        
        this.clearFormErrors();
    }

    validateForm(formData) {
        const errors = {};
        let isValid = true;

        // Validate title
        if (!formData.title || formData.title.trim().length < 3) {
            errors.title = 'Event title must be at least 3 characters';
            isValid = false;
        }

        // Validate date
        if (!formData.date) {
            errors.date = 'Please select a date';
            isValid = false;
        }

        // Validate time
        if (!formData.time) {
            errors.time = 'Please select a time';
            isValid = false;
        }

        // Validate status
        if (!formData.status) {
            errors.status = 'Please select a status';
            isValid = false;
        }

        return { isValid, errors };
    }

    displayFormErrors(errors) {
        // First clear all errors
        this.clearFormErrors();
        
        // Then display all new errors at once
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(`${field}-error`);
            const inputElement = document.getElementById(`event-${field}`);
            
            if (errorElement) {
                errorElement.textContent = errors[field];
                errorElement.style.display = 'block';
            }
            
            if (inputElement) {
                inputElement.classList.add('error');
            }
        });
    }

    clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });

        document.querySelectorAll('.event-form input, .event-form select').forEach(el => {
            el.classList.remove('error');
        });
    }

    handleEventSubmit(e) {
        e.preventDefault();

        const formData = {
            title: document.getElementById('event-title')?.value.trim(),
            date: document.getElementById('event-date')?.value,
            time: this.formatTime(document.getElementById('event-time')?.value),
            status: document.getElementById('event-status')?.value
        };

        console.log('=== EVENT SUBMIT DEBUG ===');
        console.log('Form date input:', formData.date);
        console.log('Today actual:', new Date().toISOString().split('T')[0]);
        console.log('======================');
        const validation = this.validateForm(formData);

        if (!validation.isValid) {
            this.displayFormErrors(validation.errors);
            this.showNotification('Please fix form errors', 'error');
            return;
        }

        this.showLoadingOverlay();

        setTimeout(() => {
            try {
                // Add formatted date to the event
                formData.dateFormatted = this.formatDate(formData.date);
                DataManager.addEvent(formData);
                this.saveDataToStorage();
                this.closeEventModal();
                this.updateEventsDisplay();
                this.showNotification('Event added successfully!', 'success');
            } catch (error) {
                this.showNotification('Failed to add event', 'error');
                console.error('Add event error:', error);
            } finally {
                this.hideLoadingOverlay();
            }
        }, 500);
    }

    formatTime(time24) {
        if (!time24) return '';
        
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        
        return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        
        console.log('=== DATE DEBUGGING ===');
        console.log('Input dateString:', dateString);
        
        // Test different parsing methods
        const [year, month, day] = dateString.split('-');
        const dateLocal = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const dateUTC = new Date(dateString + 'T00:00:00');
        
        console.log('Local date:', dateLocal.toString());
        console.log('UTC date:', dateUTC.toString());
        console.log('Local formatted:', dateLocal.toLocaleDateString('en-US'));
        console.log('UTC formatted:', dateUTC.toLocaleDateString('en-US'));
        
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const result = dateLocal.toLocaleDateString('en-US', options);
        console.log('Final result:', result);
        console.log('=====================');
        
        return result;
    }

    updateStatsDisplay(newStats) {
        // Update upcoming events count
        const upcomingEl = document.getElementById('upcoming-events-count');
        if (upcomingEl) upcomingEl.textContent = newStats.upcomingEvents || DataManager.getStats().upcomingEvents;

        // Update response progress
        const responseProgress = document.getElementById('response-progress');
        if (responseProgress) {
            responseProgress.style.width = `${newStats.responseRate || DataManager.getStats().responseRate}%`;
        }

        // Update available members
        const availableEl = document.getElementById('available-count');
        if (availableEl) {
            availableEl.textContent = `${newStats.availableMembers || DataManager.getStats().availableMembers}/${DataManager.getStats().totalMembers}`;
        }

        // Update availability progress
        const availabilityProgress = document.getElementById('availability-progress');
        if (availabilityProgress) {
            const percentage = ((newStats.availableMembers || DataManager.getStats().availableMembers) / DataManager.getStats().totalMembers) * 100;
            availabilityProgress.style.width = `${percentage}%`;
        }

        // Update task progress
        const taskProgressEl = document.getElementById('tasks-progress');
        if (taskProgressEl) taskProgressEl.textContent = `${newStats.taskProgress || DataManager.getStats().taskProgress}%`;

        const taskProgressBar = document.getElementById('tasks-progress-bar');
        if (taskProgressBar) {
            taskProgressBar.style.width = `${newStats.taskProgress || DataManager.getStats().taskProgress}%`;
        }
    }

    updateEventsDisplay() {
        const eventList = document.getElementById('schedule-list');
        if (eventList) {
            const events = DataManager.getEvents();
            console.log('Updating events display with:', events.length, 'events'); // Debug log
            
            // Group and sort events by date
            const eventsByDate = this.groupEventsByDate(events);
            
            if (Object.keys(eventsByDate).length === 0) {
                eventList.innerHTML = `
                    <li class="date-group">
                        <div class="date-header">No Events</div>
                        <div class="event-item">
                            <div class="event-title">No events scheduled yet</div>
                        </div>
                    </li>
                `;
                return;
            }
            
            eventList.innerHTML = Object.keys(eventsByDate)
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
                }).join('');
        }
    }

    groupEventsByDate(events) {
        if (!events || !Array.isArray(events)) {
            console.warn('Invalid events data provided to groupEventsByDate');
            return {};
        }
        
        const grouped = {};
        events.forEach(event => {
            if (!event) return;
            
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

    updateTimeDisplay(time) {
        const timeEl = document.getElementById('current-time');
        if (timeEl) timeEl.textContent = time;
    }

    handleNavigation(event) {
        document.querySelectorAll('.nav-links li').forEach(li => {
            li.classList.remove('active');
        });
        event.currentTarget.classList.add('active');

        const section = event.currentTarget.textContent.trim();
        this.showNotification(`Navigating to ${section}`, 'info');
        
        // Close mobile menu after navigation
        if (this.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        notification.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.remove('hidden');
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.add('hidden');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});