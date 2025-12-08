import DataManager from '../services/data-manager.js';
import { formatDate } from '../index.js';

export default class EventList {
    static render() {
        const events = DataManager.getEvents();
        if (events.length === 0) {
            return `
                <div class="empty-state">
                    <p>No items scheduled yet</p>
                    <p>Click "Add Item" to get started!</p>
                </div>
            `;
        }

        const grouped = {};
        events.forEach(event => {
            const date = event.date || new Date().toISOString().split('T')[0];
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(event);
        });

        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

        return `
            <ul id="schedule-list" class="schedule-list">
                ${sortedDates.map(date => `
                    <li class="date-group">
                        <div class="date-header">${formatDate(date)}</div>
                        ${grouped[date]
                            .sort((a, b) => {
                                // Sort tasks by priority, then events by time
                                if (a.type === 'task' && b.type === 'event') return 1;
                                if (a.type === 'event' && b.type === 'task') return -1;
                                
                                // Both are same type
                                if (a.type === 'event') {
                                    // Sort events by time
                                    const ta = a.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
                                    const tb = b.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
                                    if (!ta || !tb) return 0;
                                    let ha = parseInt(ta[1]) + (ta[3].toUpperCase() === 'PM' && ta[1] !== '12' ? 12 : 0);
                                    let hb = parseInt(tb[1]) + (tb[3].toUpperCase() === 'PM' && tb[1] !== '12' ? 12 : 0);
                                    if (ta[3].toUpperCase() === 'AM' && ta[1] === '12') ha = 0;
                                    if (tb[3].toUpperCase() === 'AM' && tb[1] === '12') hb = 0;
                                    return ha - hb;
                                } else {
                                    // Sort tasks by priority (high > medium > low)
                                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                                    return priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
                                }
                            })
                            .map(event => `
                                <div class="event-item" data-event-id="${event.id}">
                                    <div class="event-time">
                                        ${event.type === 'event' 
                                            ? `<i class="fas fa-calendar-alt"></i> ${event.time}`
                                            : `<i class="fas fa-tasks"></i> ${event.time || 'All Day'}`
                                        }
                                    </div>
                                    <div class="event-details">
                                        <div class="event-title">
                                            ${event.type === 'task' ? `<i class="fas fa-check-circle task-checkbox"></i> ` : ''}
                                            ${event.title}
                                            ${event.type === 'task' && event.priority 
                                                ? `<span class="priority-badge priority-${event.priority}">${event.priority}</span>`
                                                : ''
                                            }
                                        </div>
                                        <div class="event-status status-${event.status}">
                                            ${event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                            ${event.type === 'task' ? ' Task' : ' Event'}
                                        </div>
                                    </div>
                                    <div class="event-actions">
                                        <button class="btn-icon edit-btn"><i class="fas fa-edit"></i></button>
                                        <button class="btn-icon delete-btn"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                </div>
                            `).join('')}
                    </li>
                `).join('')}
            </ul>
        `;
    }
}