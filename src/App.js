import Sidebar from './components/Sidebar.js';
import MobileMenuToggle from './components/MobileMenuToggle.js';
import EventModal from './components/EventModal.js';
import DeleteModal from './components/DeleteModal.js';
import Dashboard from './components/Dashboard.js';
import EventList from './components/EventList.js';
import TeamMembers from './components/TeamMembers.js';
import Notification from './ui/Notification.js';
import LoadingOverlay from './ui/LoadingOverlay.js';
import Clock from './ui/Clock.js';
import DataManager from './services/data-manager.js';
import RealTimeUpdates from './services/realtime-updates.js';
import {  storage, STORAGE_KEYS, formatTime, formatDate, time24toInput, generateId, showNotification, EVENT_STATUS} from './index.js';

class App {
    constructor() {
        this.isMobileMenuOpen = false;
        this.currentEditingEventId = null;
        this.notification = new Notification();
        this.loading = new LoadingOverlay();
        this.activeTab = "dashboard";
    }

    init() {
        this.render();
        this.setupEventListeners();
        DataManager.load();
        RealTimeUpdates.init();
        Clock.start();
        this.updateDisplay();
        this.notification.show('EventFlow Dashboard Ready', 'success');
    }

    render() {
        document.getElementById('app').innerHTML = `
            <div class="dashboard-container">
                ${MobileMenuToggle.template()}
                ${Sidebar.template(this.isMobileMenuOpen, this.activeTab)}
                
                <div class="main-content">
                    <div class="header">
                        <div>
                            <h2>${this.getPageTitle()}</h2>
                            <div class="current-time" id="current-time"></div>
                        </div>
                        <div class="user-info">
                            <div class="user-avatar">JD</div>
                            <span>John Doe</span>
                        </div>
                    </div>

                    ${this.renderActiveTabContent()}
                </div>
            </div>

            ${Notification.template()}
            ${EventModal.template()}
            ${DeleteModal.template()}
            ${LoadingOverlay.template()}
        `;
    }

    setupEventListeners() {
        const sidebar = document.getElementById('sidebar');

        // Mobile menu toggle
        document.getElementById('mobile-menu-toggle')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            sidebar?.classList.toggle('mobile-open');
        });

        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen && 
                !sidebar?.contains(e.target) && 
                e.target.id !== 'mobile-menu-toggle') {
                this.isMobileMenuOpen = false;
                sidebar?.classList.remove('mobile-open');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.isMobileMenuOpen = false;
                sidebar?.classList.remove('mobile-open');
            }
        });

        // Add event
        document.getElementById('add-event-btn')?.addEventListener('click', () => this.openEventModal());

        // Form submit
        document.getElementById('event-form')?.addEventListener('submit', (e) => this.handleEventSubmit(e));

        // Dynamic form fields based on type
        document.getElementById('event-type')?.addEventListener('change', (e) => {
            const type = e.target.value;
            const timeContainer = document.getElementById('time-container');
            const priorityContainer = document.getElementById('priority-container');
            const timeInput = document.getElementById('event-time');
            
            if (type === 'task') {
                timeContainer.style.display = 'none';
                priorityContainer.style.display = 'block';
                timeInput.required = false;
                timeInput.value = '';
            } else {
                timeContainer.style.display = 'block';
                priorityContainer.style.display = 'none';
                timeInput.required = true;
            }
        });
        
        // Edit & delete delegation
        document.getElementById('schedule-list')?.addEventListener('click', (e) => {
            const item = e.target.closest('.event-item');
            if (!item) return;
            const id = item.dataset.eventId;

            if (e.target.closest('.edit-btn')) this.handleEditEvent(id);
            if (e.target.closest('.delete-btn')) this.handleDeleteClick(id);
        });

        // Modal controls
        document.getElementById('modal-close')?.addEventListener('click', () => this.closeEventModal());
        document.getElementById('cancel-btn')?.addEventListener('click', () => this.closeEventModal());
        document.getElementById('event-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'event-modal') this.closeEventModal();
        });

        // Delete modal
        document.getElementById('confirm-delete')?.addEventListener('click', () => this.confirmDelete());
        document.getElementById('cancel-delete')?.addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('delete-modal-close')?.addEventListener('click', () => this.closeDeleteModal());

        // Real-time updates listener
        document.addEventListener('events:updated', () => this.updateDisplay());

        // Sidebar navigation
            document.querySelector('.nav-links')?.addEventListener('click', (e) => {
            const listItem = e.target.closest('li');
            if (!listItem) return;
            
            const tab = listItem.dataset.tab;
            if (tab && tab !== this.activeTab) {
                this.activeTab = tab;
                this.isMobileMenuOpen = false; // Close mobile menu on navigation
                
                // Re-render the entire app
                this.render();
                this.setupEventListeners(); // Re-attach event listeners
                this.updateDisplay(); // Update if needed
                
                // Show notification
                this.notification.show(`Switched to ${tab}`, 'info');
            }
        });
    }

    openEventModal() {
        const modal = document.getElementById('event-modal');
        modal?.classList.remove('hidden');
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('event-date').value = today;
        document.getElementById('event-title')?.focus();
    }

    handleEditEvent(id) {
        const event = DataManager.getEvents().find(e => e.id == id);
        if (!event) return;

        this.currentEditingEventId = id;
        this.openEventModal();

        document.getElementById('event-title').value = event.title;
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-time').value = time24toInput(event.time);
        document.getElementById('event-status').value = event.status;

        document.querySelector('#event-modal h3').innerHTML = 'Edit Event';
        document.getElementById('submit-btn').innerHTML = 'Update Event';
    }

    handleDeleteClick(id) {
        const event = DataManager.getEvents().find(e => e.id == id);
        if (!event) return;

        this.currentEditingEventId = id;
        document.getElementById('delete-event-title').textContent = event.title;
        document.getElementById('delete-modal').classList.remove('hidden');
    }

    confirmDelete() {
        DataManager.deleteEvent(this.currentEditingEventId);
        DataManager.save();
        this.closeDeleteModal();
        this.updateDisplay();
        this.notification.show('Event deleted permanently', 'success');
    }

    closeDeleteModal() {
        document.getElementById('delete-modal').classList.add('hidden');
        this.currentEditingEventId = null;
    }

    closeEventModal() {
        document.getElementById('event-modal').classList.add('hidden');
        document.getElementById('event-form').reset();
        this.currentEditingEventId = null;
        document.querySelector('#event-modal h3').innerHTML = 'Add New Event';
        document.getElementById('submit-btn').innerHTML = 'Add Event';
        this.clearFormErrors();
    }

    handleEventSubmit(e) {
        e.preventDefault();
        const type = document.getElementById('event-type').value;
        const formData = {
            title: document.getElementById('event-title').value.trim(),
            date: document.getElementById('event-date').value,
            time: type === 'event' ? formatTime(document.getElementById('event-time').value) : 'All Day',
            status: document.getElementById('event-status').value,
            type: type,
            priority: type === 'task' ? document.getElementById('event-priority').value : null
        };

        const validation = this.validateForm(formData, type);
        if (!validation.isValid) {
            this.displayFormErrors(validation.errors);
            return;
        }

        this.loading.show();
        setTimeout(() => {
            try {
                if (this.currentEditingEventId) {
                    DataManager.updateEvent(this.currentEditingEventId, {
                        ...formData,
                        dateFormatted: formatDate(formData.date)
                    });
                    this.notification.show('Item updated successfully!', 'success');
                } else {
                    DataManager.addEvent({
                        ...formData,
                        id: Date.now(),
                        dateFormatted: formatDate(formData.date)
                    });
                    this.notification.show('Item added successfully!', 'success');
                }
                DataManager.save();
                this.closeEventModal();
                this.updateDisplay();
            } finally {
                this.loading.hide();
            }
        }, 600);
    }

    getPageTitle() {
        const titles = {
            'dashboard': 'Event Dashboard',
            'events': 'Event Schedule',
            'tasks': 'Task Manager',
            'team': 'Team Members'
        };
        return titles[this.activeTab] || 'Event Dashboard';
    }

    validateForm(data, type) {
        const errors = {};
        if (!data.title || data.title.length < 3) errors.title = 'Title too short';
        if (!data.date) errors.date = 'Date required';
        if (type === 'event' && !document.getElementById('event-time').value) errors.time = 'Time required';
        return { isValid: Object.keys(errors).length === 0, errors };
    }

    displayFormErrors(errors) {
        this.clearFormErrors();
        Object.keys(errors).forEach(field => {
            const errorEl = document.getElementById(`${field}-error`);
            const input = document.getElementById(`event-${field}`);
            if (errorEl) errorEl.textContent = errors[field];
            if (input) input.classList.add('error');
        });
    }

    clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.event-form input, .event-form select').forEach(el => el.classList.remove('error'));
    }

    renderActiveTabContent() {
        switch(this.activeTab) {
            case 'dashboard':
                return `
                    <div class="dashboard-layout">
                        <div class="stats-section">${Dashboard.render()}</div>
                        <div class="events-section">
                            <div class="section-header">
                                <h3>Today's Schedule</h3>
                                <button id="add-event-btn" class="btn btn-primary">
                                    <i class="fas fa-plus"></i> Add Event
                                </button>
                            </div>
                            ${EventList.render()}
                        </div>
                        <div class="team-section">
                            <h3>Team Members</h3>
                            ${TeamMembers.render()}
                        </div>
                    </div>
                `;
                
            case 'events':
                return `
                    <div class="full-width-section">
                        <div class="section-header">
                            <h3>All Events</h3>
                            <button id="add-event-btn" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Add Event
                            </button>
                        </div>
                        ${EventList.render()}
                    </div>
                `;
                
            case 'team':
                return `
                    <div class="full-width-section">
                        <div class="section-header">
                            <h3>Team Management</h3>
                        </div>
                        ${TeamMembers.render()}
                    </div>
                `;
                
            case 'tasks':
                return `
                    <div class="full-width-section">
                        <div class="section-header">
                            <h3>Tasks (Coming Soon)</h3>
                        </div>
                        <div class="empty-state">
                            <p>Task management feature is under development</p>
                        </div>
                    </div>
                `;
                
            default:
                return Dashboard.render();
        }
    }

    updateDisplay() {
        document.querySelector('.stats-section').innerHTML = Dashboard.render();
        document.querySelector('.events-section > div:last-child').innerHTML = EventList.render();
    }
}

export default App;