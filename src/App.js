import Dashboard from './components/Dashboard.js';
import EventList from './components/EventList.js';
import TeamMembers from './components/TeamMembers.js';

class App {
    constructor() {
        this.components = {
            dashboard: new Dashboard(),
            eventList: new EventList(),
            teamMembers: new TeamMembers()
        };
    }

    init() {
        this.render();
        this.setupEventListeners();
        console.log('Event Dashboard initialized');
    }

    render() {
        const appContainer = document.getElementById('app');
        
        appContainer.innerHTML = `
            <div class="dashboard-container">
                <div class="sidebar">
                    <div class="logo">
                        <h1><i class="fas fa-calendar-alt"></i> EventFlow</h1>
                    </div>
                    <ul class="nav-links">
                        <li class="active"><i class="fas fa-home"></i> Dashboard</li>
                        <li><i class="fas fa-calendar-day"></i> Events</li>
                        <li><i class="fas fa-tasks"></i> Tasks</li>
                        <li><i class="fas fa-users"></i> Team</li>
                    </ul>
                </div>
                
                <div class="main-content">
                    <div class="header">
                        <h2>Event Dashboard</h2>
                        <div class="user-info">
                            <div class="user-avatar">JD</div>
                            <span>John Doe</span>
                        </div>
                    </div>
                    
                    ${this.components.dashboard.render()}
                    ${this.components.eventList.render()}
                    ${this.components.teamMembers.render()}
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refresh-btn')?.addEventListener('click', () => {
            this.handleRefresh();
        });

        // Add event button
        document.getElementById('add-event-btn')?.addEventListener('click', () => {
            this.handleAddEvent();
        });

        // Navigation
        document.querySelectorAll('.nav-links li').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleNavigation(e);
            });
        });
    }

    handleRefresh() {
        const btn = document.getElementById('refresh-btn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        btn.disabled = true;

        setTimeout(() => {
            this.render();
            btn.innerHTML = originalText;
            btn.disabled = false;
            this.showNotification('Data refreshed successfully!', 'success');
        }, 1000);
    }

    handleAddEvent() {
        alert('Add Event feature would open a modal here. This demonstrates event handling.');
    }

    handleNavigation(event) {
        document.querySelectorAll('.nav-links li').forEach(li => {
            li.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        this.showNotification(`Navigating to ${event.currentTarget.textContent.trim()}`, 'info');
    }

    showNotification(message, type) {
        // Simple notification implementation
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});