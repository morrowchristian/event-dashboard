import DataManager from '../services/data-manager.js';

class EventList {
    constructor() {
        this.events = DataManager.getEvents();
    }

    render() {
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Today's Schedule</h3>
                    <div class="card-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                </div>
                <ul class="event-list" id="schedule-list">
                    ${this.events.map(event => `
                        <li class="event-item" data-event-id="${event.id}">
                            <div class="event-time">${event.time}</div>
                            <div class="event-title">${event.title}</div>
                            <div class="event-status status-${event.status}">
                                ${event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
}

export default EventList;