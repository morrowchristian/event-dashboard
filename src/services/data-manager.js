// Core data management service
class DataManager {
    constructor() {
        this.teamMembers = [
            { id: 1, name: 'John Doe', role: 'Project Manager', avatar: 'JD' },
            { id: 2, name: 'Alice Smith', role: 'Event Coordinator', avatar: 'AS' },
            { id: 3, name: 'Robert Johnson', role: 'Marketing Lead', avatar: 'RJ' },
            { id: 4, name: 'Emma Wilson', role: 'Operations', avatar: 'EW' }
        ];

        this.events = [
            { id: 1, time: '09:00 AM', title: 'Team Stand-up Meeting', status: 'ongoing' },
            { id: 2, time: '11:00 AM', title: 'Client Presentation', status: 'upcoming' },
            { id: 3, time: '02:00 PM', title: 'Project Review', status: 'upcoming' }
        ];

        this.stats = {
            upcomingEvents: 12,
            responseRate: 75,
            availableMembers: 18,
            totalMembers: 20,
            taskProgress: 64,
            remainingTasks: 36
        };
    }

    getTeamMembers() {
        return this.teamMembers;
    }

    getEvents() {
        return this.events;
    }

    getStats() {
        return this.stats;
    }

    updateStats(newStats) {
        this.stats = { ...this.stats, ...newStats };
        return this.stats;
    }

    addEvent(event) {
        const newEvent = {
            id: this.events.length + 1,
            ...event
        };
        this.events.push(newEvent);
        return newEvent;
    }
}

export default new DataManager();