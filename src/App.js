/**
 * Main Application Controller
 * Orchestrates the entire dashboard application
 * Manages components, UI interactions, data flow, and real-time updates
 */

import Dashboard from './components/Dashboard.js';
import EventList from './components/EventList.js';
import TeamMembers from './components/TeamMembers.js';
import WeeklyCalendar from './components/WeeklyCalendar.js';
import RealTimeUpdates from './services/realtime-updates.js';
import DragDropManager from './services/drag-drop-manager.js';
import DataManager from './services/data-manager.js';
import { storage, showNotification } from './utils/helpers.js';
import { STORAGE_KEYS } from './utils/constants.js';

class App {
    constructor() {
        /**
         * Tracks mobile menu open/close state
         * @type {boolean}
         * @private
         */
        this.isMobileMenuOpen = false;
        
        /**
         * Current active view for main content area
         * @type {string}
         * @private
         */
        this.currentView = 'dashboard';
        
        // Load persisted data before initializing components
        this.loadDataFromStorage();
        
        /**
         * Dashboard component instances
         * @type {Object}
         * @property {Dashboard} dashboard - Statistics cards component
         * @property {EventList} eventList - Event schedule component
         * @property {TeamMembers} teamMembers - Team members grid component
         * @property {CalendarView} calendarView - Interactive calendar with drag and drop
         */
        this.components = {
            dashboard: new Dashboard(),
            eventList: new EventList(),
            teamMembers: new TeamMembers(),
            calendarView: new WeeklyCalendar()
        };
    }

    /**
     * Initialize the application
     * Sets up UI, event listeners, real-time updates, and data synchronization
     */
    init() {
        this.render();
        this.setupEventListeners();
        this.initializeServices();
        this.setupDataChangeListeners();
        this.updateEventsDisplay();
        console.log('Event Dashboard initialized');
    }

    /**
     * Initialize core application services
     * Starts real-time updates and drag-drop functionality
     * @private
     */
    initializeServices() {
        RealTimeUpdates.init();
        DragDropManager.init();
        this.showNotification('Real-time updates and drag-drop activated', 'success');
    }

    /**
     * Load persisted event data from localStorage
     * Restores events from previous session if available
     * @private
     */
    loadDataFromStorage() {
        const storedEvents = storage.get(STORAGE_KEYS.EVENTS_DATA);
        if (storedEvents && Array.isArray(storedEvents) && storedEvents.length > 0) {
            DataManager.events = storedEvents;
            // Dispatch event to trigger UI updates
            document.dispatchEvent(new CustomEvent('events:updated'));
        }
    }

    /**
     * Save current events to localStorage
     * Persists event data for future sessions
     * @private
     */
    saveDataToStorage() {
        const events = DataManager.getEvents();
        storage.set(STORAGE_KEYS.EVENTS_DATA, events);
    }

    /**
     * Render the complete application UI
     * Creates sidebar navigation, main content area, modals, and overlays
     * Dynamically renders content based on current view selection
     * @private
     */
    render() {
        const appContainer = document.getElementById('app');

        appContainer.innerHTML = `
            <div class="dashboard-container">
                <!-- Mobile hamburger menu button (visible < 968px) -->
                <button class="mobile-menu-toggle" id="mobile-menu-toggle" style="pointer-events: auto;">
                    <i class="fas fa-bars" style="pointer-events: none;"></i>
                </button>

                <!-- Sidebar Navigation -->
                <div class="sidebar ${this.isMobileMenuOpen ? 'mobile-open' : ''}" id="sidebar">
                    <div class="logo">
                        <h1><i class="fas fa-calendar-alt"></i> EventFlow</h1>
                    </div>
                    <!-- Navigation menu items -->
                    <ul class="nav-links">
                        <li class="active" data-view="dashboard"><i class="fas fa-home"></i> Dashboard</li>
                        <li data-view="calendarView"><i class="fas fa-calendar-day"></i> Calendar</li>
                        <li data-view="eventList"><i class="fas fa-list"></i> Events</li>
                        <li data-view="teamMembers"><i class="fas fa-users"></i> Team</li>
                    </ul>
                    <!-- Real-time updates status indicator -->
                    <div class="realtime-status">
                        <i class="fas fa-circle status-indicator"></i>
                        <span>Live Updates Active</span>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="main-content">
                    <!-- Header with time and user info -->
                    <div class="header">
                        <div>
                            <h2>Event Dashboard - ${this.getViewTitle()}</h2>
                            <div class="current-time" id="current-time"></div>
                        </div>
                        
                        <div class="header-actions">
                            <button class="btn btn-outline" id="refresh-btn">
                                <i class="fas fa-sync"></i> Refresh Data
                            </button>
                            <button class="btn btn-primary" id="add-event-btn">
                                <i class="fas fa-plus"></i> Add Event
                            </button>
                        </div>
                        
                        <div class="user-info">
                            <div class="user-avatar">JD</div>
                            <span>John Doe</span>
                        </div>
                    </div>

                    <!-- Dynamic content area based on current view -->
                    <div id="view-container">
                        ${this.renderCurrentView()}
                    </div>
                </div>
            </div>

            <!-- Toast Notification Container (top-right) -->
            <div id="notification-container" class="notification-container"></div>

            <!-- Event Creation Modal -->
            <div id="event-modal" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-calendar-plus"></i> Add New Event</h3>
                        <button class="modal-close" id="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="event-form" class="event-form">
                        <!-- Event title input -->
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

                        <!-- Date and time inputs (side-by-side on desktop) -->
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

                        <!-- Event status dropdown -->
                        <div class="form-group">
                            <label for="event-status">Status *</label>
                            <select id="event-status" name="status" required>
                                <option value="upcoming">Upcoming</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                            </select>
                            <span class="error-message" id="status-error"></span>
                        </div>

                        <!-- Form action buttons -->
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

            <!-- Loading Overlay (shown during async operations) -->
            <div id="loading-overlay" class="loading-overlay hidden">
                <div class="spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading...</p>
                </div>
            </div>
        `;

        // Initialize view-specific functionality after render
        this.initializeCurrentView();

        // Re-attach navigation listeners after every render
        this.setupNavigationListeners();
    }

    /**
     * Get display title for current view
     * @returns {string} Formatted title for header display
     * @private
     */
    getViewTitle() {
        const titles = {
            dashboard: 'Overview',
            calendarView: 'Calendar',
            eventList: 'Events',
            teamMembers: 'Team'
        };
        return titles[this.currentView] || 'Dashboard';
    }

    /**
     * Render content based on current view selection
     * @returns {string} HTML string for the active view
     * @private
     */
    renderCurrentView() {
        switch (this.currentView) {
            case 'calendarView':
                return this.components.calendarView.render();
            case 'eventList':
                return this.components.eventList.render();
            case 'teamMembers':
                return this.components.teamMembers.render();
            case 'dashboard':
            default:
                return `
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
                `;
        }
    }

    /**
     * Initialize view-specific functionality after render
     * Sets up drag and drop for calendar view, event listeners for other views
     * @private
     */
    initializeCurrentView() {
        // Set up navigation listeners every time we render
        document.querySelectorAll('.nav-links li').forEach(item => {
            item.removeEventListener('click', this.handleNavigation);
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        if (this.currentView === 'calendarView') {
            this.components.calendarView.initInteractions(); // Updated method name
        }
    }

    /**
     * Set up all event listeners for user interactions
     * Handles clicks, form submissions, modal controls, and navigation
     * @private
     */
    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('mobile-menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Refresh data button (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.closest('#refresh-btn')) {
                this.handleRefresh();
            }
        });

        // Add event button (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.closest('#add-event-btn')) {
                this.openEventModal();
            }
        });

        // Modal close controls
        const modalClose = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('cancel-btn');
        const eventForm = document.getElementById('event-form');

        if (modalClose) modalClose.addEventListener('click', () => this.closeEventModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeEventModal());
        if (eventForm) eventForm.addEventListener('submit', (e) => this.handleEventSubmit(e));

        // Sidebar navigation
        this.setupNavigationListeners();

        // Close modal when clicking backdrop
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

    /**
     * Set up navigation listeners - called after every render
     * @private
     */
    setupNavigationListeners() {
        // Remove any existing listeners first to prevent duplicates
        document.querySelectorAll('.nav-links li').forEach(item => {
            item.replaceWith(item.cloneNode(true));
        });
        
        // Add fresh listeners
        document.querySelectorAll('.nav-links li').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });
    }

    /**
     * Toggle mobile menu open/closed state
     * Adds/removes 'mobile-open' class to sidebar
     * @private
     */
    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
        }
    }

    /**
     * Set up listeners for data change events
     * Responds to real-time updates from RealTimeUpdates service
     * @private
     */
    setupDataChangeListeners() {
        // Listen for real-time stats updates (every 10s)
        document.addEventListener('stats:updated', (e) => {
            this.updateStatsDisplay(e.detail);
        });

        // Listen for event updates (status changes, new events, drag-drop changes)
        document.addEventListener('events:updated', (e) => {
            this.updateEventsDisplay();
            this.saveDataToStorage(); // Persist changes
        });

        // Listen for time updates (every 1s)
        document.addEventListener('time:updated', (e) => {
            this.updateTimeDisplay(e.detail.time);
        });

        // Listen for manual refresh completion
        document.addEventListener('manual:refresh', () => {
            this.updateStatsDisplay(DataManager.getStats());
            this.updateEventsDisplay();
        });
    }

    /**
     * Handle manual data refresh
     * Triggers immediate update of all data and shows loading state
     * @private
     * @async
     */
    async handleRefresh() {
        const btn = document.getElementById('refresh-btn');
        if (!btn) return;

        // Store original button content
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
            // Restore button after 1 second
            setTimeout(() => {
                if (btn) {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }
            }, 1000);
        }
    }

    /**
     * Open event creation modal
     * Sets default date to today (adjusted for timezone) and focuses title input
     * @private
     */
    openEventModal() {
        const modal = document.getElementById('event-modal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Set default date to today (adjusted for timezone offset)
            const now = new Date();
            const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
                        .toISOString().split('T')[0];
            
            console.log('Setting default date to:', today);
            
            const dateInput = document.getElementById('event-date');
            if (dateInput) dateInput.value = today;
            
            // Focus title input for immediate typing
            document.getElementById('event-title')?.focus();
        }
    }

    /**
     * Close event creation modal
     * Resets form and clears all error messages
     * @private
     */
    closeEventModal() {
        const modal = document.getElementById('event-modal');
        const form = document.getElementById('event-form');
        
        if (modal) modal.classList.add('hidden');
        if (form) form.reset();
        
        this.clearFormErrors();
    }

    /**
     * Validate event form data
     * Checks for required fields and minimum lengths
     * @param {Object} formData - Form data to validate
     * @param {string} formData.title - Event title
     * @param {string} formData.date - Event date (YYYY-MM-DD)
     * @param {string} formData.time - Event time (HH:MM)
     * @param {string} formData.status - Event status
     * @returns {Object} Validation result
     * @returns {boolean} returns.isValid - Whether form is valid
     * @returns {Object} returns.errors - Map of field names to error messages
     * @private
     */
    validateForm(formData) {
        const errors = {};
        let isValid = true;

        // Validate title (minimum 3 characters)
        if (!formData.title || formData.title.trim().length < 3) {
            errors.title = 'Event title must be at least 3 characters';
            isValid = false;
        }

        // Validate date is selected
        if (!formData.date) {
            errors.date = 'Please select a date';
            isValid = false;
        }

        // Validate time is selected
        if (!formData.time) {
            errors.time = 'Please select a time';
            isValid = false;
        }

        // Validate status is selected
        if (!formData.status) {
            errors.status = 'Please select a status';
            isValid = false;
        }

        return { isValid, errors };
    }

    /**
     * Display form validation errors
     * Shows error messages below fields and adds error styling
     * @param {Object} errors - Map of field names to error messages
     * @private
     */
    displayFormErrors(errors) {
        // Clear all previous errors first
        this.clearFormErrors();
        
        // Display all new errors
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

    /**
     * Clear all form validation errors
     * Removes error messages and error styling from inputs
     * @private
     */
    clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });

        document.querySelectorAll('.event-form input, .event-form select').forEach(el => {
            el.classList.remove('error');
        });
    }

    /**
     * Handle event form submission
     * Validates data, adds event to DataManager, and updates UI
     * @param {Event} e - Form submit event
     * @private
     */
    handleEventSubmit(e) {
        e.preventDefault();

        // Collect form data
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
        
        // Validate form data
        const validation = this.validateForm(formData);

        if (!validation.isValid) {
            this.displayFormErrors(validation.errors);
            this.showNotification('Please fix form errors', 'error');
            return;
        }

        // Show loading overlay during save
        this.showLoadingOverlay();

        // Simulate async save with 500ms delay
        setTimeout(() => {
            try {
                // Add formatted date for display
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

    /**
     * Format time from 24-hour to 12-hour format
     * Converts "14:30" to "02:30 PM"
     * @param {string} time24 - Time in 24-hour format (HH:MM)
     * @returns {string} Time in 12-hour format with AM/PM
     * @private
     * @example
     * formatTime("14:30") // Returns "02:30 PM"
     * formatTime("09:00") // Returns "09:00 AM"
     */
    formatTime(time24) {
        if (!time24) return '';
        
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        
        // Pad single-digit hours with leading zero
        return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }

    /**
     * Format date string for display
     * Converts ISO date to readable format: "Mon, Jan 15, 2025"
     * Uses local date parsing to avoid timezone issues
     * @param {string} dateString - Date in ISO format (YYYY-MM-DD)
     * @returns {string} Formatted date string
     * @private
     * @example
     * formatDate("2025-01-15") // Returns "Wed, Jan 15, 2025"
     */
    formatDate(dateString) {
        if (!dateString) return '';
        
        console.log('=== DATE DEBUGGING ===');
        console.log('Input dateString:', dateString);
        
        // Parse date components to avoid timezone offset issues
        const [year, month, day] = dateString.split('-');
        const dateLocal = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const dateUTC = new Date(dateString + 'T00:00:00');
        
        console.log('Local date:', dateLocal.toString());
        console.log('UTC date:', dateUTC.toString());
        console.log('Local formatted:', dateLocal.toLocaleDateString('en-US'));
        console.log('UTC formatted:', dateUTC.toLocaleDateString('en-US'));
        
        // Use local date to avoid timezone shifts
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const result = dateLocal.toLocaleDateString('en-US', options);
        console.log('Final result:', result);
        console.log('=====================');
        
        return result;
    }

    /**
     * Update statistics display with new values
     * Updates all stat cards, progress bars, and counters
     * @param {Object} newStats - New statistics values
     * @private
     */
    updateStatsDisplay(newStats) {
        // Update upcoming events count
        const upcomingEl = document.getElementById('upcoming-events-count');
        if (upcomingEl) upcomingEl.textContent = newStats.upcomingEvents || DataManager.getStats().upcomingEvents;

        // Update response rate progress bar
        const responseProgress = document.getElementById('response-progress');
        if (responseProgress) {
            responseProgress.style.width = `${newStats.responseRate || DataManager.getStats().responseRate}%`;
        }

        // Update available members count
        const availableEl = document.getElementById('available-count');
        if (availableEl) {
            availableEl.textContent = `${newStats.availableMembers || DataManager.getStats().availableMembers}/${DataManager.getStats().totalMembers}`;
        }

        // Update availability progress bar
        const availabilityProgress = document.getElementById('availability-progress');
        if (availabilityProgress) {
            const percentage = ((newStats.availableMembers || DataManager.getStats().availableMembers) / DataManager.getStats().totalMembers) * 100;
            availabilityProgress.style.width = `${percentage}%`;
        }

        // Update task progress percentage
        const taskProgressEl = document.getElementById('tasks-progress');
        if (taskProgressEl) taskProgressEl.textContent = `${newStats.taskProgress || DataManager.getStats().taskProgress}%`;

        // Update task progress bar
        const taskProgressBar = document.getElementById('tasks-progress-bar');
        if (taskProgressBar) {
            taskProgressBar.style.width = `${newStats.taskProgress || DataManager.getStats().taskProgress}%`;
        }
    }

    /**
     * Update events display in schedule list
     * Groups events by date, sorts chronologically, and renders
     * Shows "No events" message if list is empty
     * @private
     */
    updateEventsDisplay() {
        const eventList = document.getElementById('schedule-list');
        if (eventList) {
            const events = DataManager.getEvents();
            console.log('Updating events display with:', events.length, 'events');
            
            // Group and sort events by date
            const eventsByDate = this.groupEventsByDate(events);
            
            // Show message if no events exist
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
            
            // Render events grouped by date
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

    /**
     * Group events by date and sort by time within each date
     * @param {Array<Object>} events - Array of event objects
     * @returns {Object} Events grouped by date (date string as key)
     * @private
     * @example
     * groupEventsByDate([...]) // Returns { "2025-01-15": [...], "2025-01-16": [...] }
     */
    groupEventsByDate(events) {
        if (!events || !Array.isArray(events)) {
            console.warn('Invalid events data provided to groupEventsByDate');
            return {};
        }
        
        const grouped = {};
        events.forEach(event => {
            if (!event) return;
            
            // Use event date or default to today
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
     * Convert time string to minutes since midnight
     * Used for sorting events chronologically
     * @param {string} timeStr - Time string in 12-hour format (e.g., "02:30 PM")
     * @returns {number} Minutes since midnight (0-1439)
     * @private
     * @example
     * timeToMinutes("02:30 PM") // Returns 870 (14 * 60 + 30)
     * timeToMinutes("12:00 AM") // Returns 0
     */
    timeToMinutes(timeStr) {
        if (!timeStr) return 0;
        
        // Parse time string: "02:30 PM"
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return 0;
        
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();
        
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        return hours * 60 + minutes;
    }

    /**
     * Update current time display in header
     * @param {string} time - Formatted time string from Date.toLocaleTimeString()
     * @private
     */
    updateTimeDisplay(time) {
        const timeEl = document.getElementById('current-time');
        if (timeEl) timeEl.textContent = time;
    }

    /**
     * Handle sidebar navigation click
     * Updates active state and switches between views
     * @param {Event} event - Click event from navigation item
     * @private
     */
    handleNavigation(event) {
        const navItem = event.currentTarget;
        const view = navItem.dataset.view;
        
        // Update active navigation item
        document.querySelectorAll('.nav-links li').forEach(li => {
            li.classList.remove('active');
        });
        navItem.classList.add('active');
        
        // Update current view and re-render
        this.currentView = view;
        this.render();
        
        const section = navItem.textContent.trim();
        this.showNotification(`Switched to ${section} view`, 'info');
        
        // Close mobile menu after navigation
        if (this.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    /**
     * Show toast notification
     * Creates and animates a notification toast message
     * Auto-dismisses after 3 seconds
     * @param {string} message - Notification message text
     * @param {string} [type='info'] - Notification type: 'success' | 'error' | 'warning' | 'info'
     * @private
     */
    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Icon mapping for each notification type
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

        // Trigger slide-in animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Show loading overlay
     * Displays full-screen loading spinner
     * @private
     */
    showLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.remove('hidden');
    }

    /**
     * Hide loading overlay
     * Removes full-screen loading spinner
     * @private
     */
    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.add('hidden');
    }
}

/**
 * Initialize application when DOM is fully loaded
 * Entry point for the entire application
 */
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});